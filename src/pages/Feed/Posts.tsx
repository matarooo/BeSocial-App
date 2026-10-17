import { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, BroadcastSignal } from "@gravity-ui/icons";
import { getAllPosts, getHomeFeed, getSavedPosts } from "./feed.services";
import { getUsersPostsData } from "../Profile/UserPosts/userposts.services";
import PostCard from "./PostCard";
import CreatePostCard from "./Post/CreatePost/CreatePostCard";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import type { Post } from "./feed.interface";

export type FeedType = "home" | "community" | "saved" | "myPosts";

export default function Posts({ feedType = "home" }: { feedType?: FeedType }) {
  return <PaginatedPosts key={feedType} feedType={feedType} />;
}

function PaginatedPosts({ feedType }: { feedType: FeedType }) {
  const isCommunity = feedType === "community";
  const isSaved = feedType === "saved";
  const isMyPosts = feedType === "myPosts";
  const { userData } = useContext(UserAuthContext);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingNextPage = useRef(false);
  const {
    data,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: isMyPosts
      ? ["userPosts", userData?._id]
      : [isSaved ? "savedPosts" : isCommunity ? "communityPosts" : "homeFeed", page],
    queryFn: async () => {
      if (isMyPosts) {
        if (!userData) throw new Error("A user ID is required to load posts.");
        const userPosts = await getUsersPostsData(userData._id);
        return {
          posts: userPosts,
          meta: { pagination: { currentPage: 1, numberOfPages: 1, nextPage: 1 } },
        };
      }
      if (isSaved) return getSavedPosts(page);
      return isCommunity ? getAllPosts(page) : getHomeFeed(page);
    },
  });

  useEffect(() => {
    if (!data) return;

    setPosts((currentPosts) => {
      if (page === 1) return data.posts;

      const existingIds = new Set(currentPosts.map((post) => post._id));
      return [...currentPosts, ...data.posts.filter((post) => !existingIds.has(post._id))];
    });
    setHasMore(data.meta.pagination.currentPage < data.meta.pagination.numberOfPages);
    isLoadingNextPage.current = false;
  }, [data, page]);

  useEffect(() => {
    function handleScroll() {
      const isAtPageEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      if (
        isAtPageEnd &&
        hasMore &&
        !isFetching &&
        !isError &&
        !isLoadingNextPage.current
      ) {
        isLoadingNextPage.current = true;
        setPage(data?.meta.pagination.nextPage ?? page + 1);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data, hasMore, isError, isFetching, page]);

  const isLoadingMore = isFetching && page > 1;

  return (
    <div className="w-full">
      {(isSaved || isMyPosts) && (
        <div className="mb-5 flex items-center gap-3 rounded-3xl border border-zinc-900/10 bg-white/80 p-5 text-zinc-900 shadow-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white">
          {isSaved
            ? <Bookmark aria-hidden="true" className="size-5 text-accent" />
            : <BroadcastSignal aria-hidden="true" className="size-5 text-accent" />}
          <h1 className="text-lg font-bold">{isSaved ? "Saved posts" : "My posts"}</h1>
        </div>
      )}
      <div>
        {userData && !isSaved && !isMyPosts && <CreatePostCard userData={userData} />}
      </div>
      {isError && page === 1 && (
        <p role="alert">
          Failed to load {isSaved ? "saved posts" : isMyPosts ? "your posts" : "posts"}. Please try again.
        </p>
      )}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {!isError && !isFetching && posts.length === 0 && (isSaved || isMyPosts) && (
        <p className="rounded-3xl border border-zinc-900/10 bg-white/80 p-6 text-center text-zinc-600 dark:border-white/15 dark:bg-zinc-900/70 dark:text-zinc-400">
          {isSaved ? "You haven’t saved any posts yet." : "You haven’t created any posts yet."}
        </p>
      )}
      {isLoadingMore && <p role="status" className="py-4 text-center">Loading more posts...</p>}
      {isError && page > 1 && (
        <div className="py-4 text-center">
          <p role="alert">Failed to load more posts.</p>
          <button
            type="button"
            className="mt-2 text-accent hover:underline"
            onClick={() => {
              isLoadingNextPage.current = true;
              void refetch();
            }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
