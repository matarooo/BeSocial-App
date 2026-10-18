import { Person , Ellipsis , ThumbsUp , ArrowsRotateRight , Comment , NodesRight, Pencil, TrashBin, Bookmark, BookmarkFill } from "@gravity-ui/icons";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { Post } from "./feed.interface";
import { deletePost, savePost } from "./feed.services";
import UpdatePost from "./Post/UpdatePost";
import SharePost from "./Post/SharePost";
import SharedPost from "./SharedPost";
import TopCommentCard from "../../components/Comments/TopCommentCard/TopCommentCard";
import Comments from "../../components/Comments/CommentCard/Comment";
import { postLike } from "./Post/PostLike/postlike.services";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import DropdownList, { type DropdownListEntry } from "../../components/DropdownList/DropdownList";
import toast from "react-hot-toast";

export default function PostCard({ post }: { post: Post }) {
  const { user, body, image, commentsCount,sharesCount,sharedPost ,topComment ,_id ,likes,likesCount} = post;
  const [showComments, setShowComments] = useState(false);

  const { userData } = useContext(UserAuthContext);
  const queryClient = useQueryClient();
  const isOwnPost = userData?._id === user._id;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(Boolean(post.bookmarked));
  const [isSaving, setIsSaving] = useState(false);
    const [isLiked, setIsLiked] = useState(() => Boolean(
      userData && likes.includes(userData._id)
    ));
    const [likesTotal, setLikesTotal] = useState(likesCount);
    const [isUpdatingLike, setIsUpdatingLike] = useState(false);

    useEffect(() => {
      setIsBookmarked(Boolean(post.bookmarked));
    }, [post.bookmarked]);

    async function handlePostLikeClick() {
      setIsUpdatingLike(true);
      try {
        const result = await postLike(_id);
        setIsLiked(result.like);
        setLikesTotal(result.likesTotal);
      } catch (error) {
        toast.error("Failed to update post like. Please try again.");
      } finally {
        setIsUpdatingLike(false);
      }
    }

    async function handleDelete() {
      if (!isOwnPost || isDeleting) return;

      setIsDeleting(true);
      try {
        const result = await deletePost(_id);
        setIsDeleted(true);
        toast.success(result.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["homeFeed"] }),
          queryClient.invalidateQueries({ queryKey: ["communityPosts"] }),
          queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
          queryClient.invalidateQueries({ queryKey: ["savedPosts"] }),
        ]);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete post. Please try again.",
        );
      } finally {
        setIsDeleting(false);
      }
    }

    async function handleSavePost() {
      if (isSaving) return;

      setIsSaving(true);
      try {
        const result = await savePost(_id);
        setIsBookmarked(result.bookmarked);
        toast.success(result.bookmarked ? "Post saved" : "Post removed from saved posts");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["homeFeed"] }),
          queryClient.invalidateQueries({ queryKey: ["communityPosts"] }),
          queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
          queryClient.invalidateQueries({ queryKey: ["savedPosts"] }),
        ]);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save post. Please try again.",
        );
      } finally {
        setIsSaving(false);
      }
    }

    const saveMenuItem: DropdownListEntry = {
      type: "item",
      label: isBookmarked ? "Remove Bookmark" : "Save",
      icon: isBookmarked
        ? <BookmarkFill aria-hidden="true" className="size-4.5 shrink-0 text-accent" />
        : <Bookmark aria-hidden="true" className="size-4.5 shrink-0 text-zinc-500 dark:text-zinc-400" />,
      onSelect: handleSavePost,
    };

    const postMenuItems: DropdownListEntry[] = isOwnPost
      ? [
          {
            type: "item",
            label: "Edit",
            icon: <Pencil aria-hidden="true" className="size-4.5 shrink-0 text-zinc-500 dark:text-zinc-400" />,
            onSelect: () => setIsUpdateOpen(true),
          },
          {
            type: "item",
            label: "Delete",
            icon: <TrashBin aria-hidden="true" className="size-4.5 shrink-0" />,
            variant: "danger",
            onSelect: handleDelete,
          },
          { type: "separator" },
          saveMenuItem,
        ]
      : [saveMenuItem];

  if (isDeleted) return null;

  return (
    <>
    {isUpdateOpen && (
      <UpdatePost post={post} onClose={() => setIsUpdateOpen(false)} />
    )}
    {isShareOpen && userData && !isOwnPost && (
      <SharePost post={post} onClose={() => setIsShareOpen(false)} />
    )}
    <div className="w-full min-w-0 flex-col gap-6 rounded-3xl border border-zinc-900/10 bg-white/80 p-3 text-zinc-900 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white sm:mb-5 sm:p-5">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <div className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm transition hover:ring-2 hover:ring-[#ff5005] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5005] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                        {user.photo ? (
                            <img src={user.photo} alt="" className="size-full object-cover" />
                        ) : (
                            <Person aria-hidden='true' className='size-5' />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <Link to={`/profile/${user._id}`}
                        state={{ profile: user }} className="font-bold text-sm">{user.name}</Link>
                        <span className="text-zinc-600 dark:text-zinc-400 text-xs">@{user.username}</span>
                    </div>
                </div>
                <DropdownList
                    ariaLabel="Post options"
                    triggerLabel="Open post options"
                    items={postMenuItems}
                    renderTrigger={(triggerProps) => (
                        <button
                            {...triggerProps}
                            className="bg-zinc-200 dark:bg-zinc-700 rounded-full w-6 h-6 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                            <Ellipsis aria-hidden="true" />
                        </button>
                    )}
                />
            </div>
            <div className="mt-4 flex flex-col gap-2 mb-2 flex-wrap">
                {body && <p className="min-w-0 max-w-full whitespace-pre-wrap wrap-break-words">{body}</p>}
                {image && <img src={image} alt="Post" className="max-h-128 w-full rounded-2xl object-cover" />}
            </div>
            { sharedPost ? <div className="mt-4 bg-zinc-100/80 dark:bg-zinc-800/60 rounded-2xl border border-accent/40 dark:border-accent/70">
                 <SharedPost sharedPost={sharedPost}/>
            </div> : ''}
            <div className="flex flex-wrap items-start justify-between gap-2 px-1 pb-2 pt-3 text-xs text-zinc-600 dark:text-slate-300 sm:items-center sm:px-4 sm:text-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-accent rounded-full w-6 h-6 flex justify-center items-center">
                        <ThumbsUp/>
                    </div>
                    <Link
                        to={'/'}
                        className={`text-sm ${likesCount > 0 ? "cursor-pointer underline-offset-2 hover:underline hover:decoration-2" : ""}`}
                    >
                        {likesTotal} Likes
                    </Link>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1 sm:justify-end sm:gap-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <ArrowsRotateRight/>
                        <span>{sharesCount} Shares</span>
                    </div>
                    <span>{commentsCount} comments</span>
                    <button
                        className="text-accent font-bold text-xs px-3 py-1 rounded-2xl cursor-pointer hover:bg-accent/20"
                        onClick={() => setShowComments(true)}
                    >
                        View details
                    </button>
                </div>
            </div>
            <div className='my-1.5 border-t border-zinc-200 dark:border-white/6'></div>
            <div className="grid grid-cols-3 gap-1 p-1 mb-1.5">
                <button
                    onClick={handlePostLikeClick}
                    disabled={isUpdatingLike}
                    aria-pressed={isLiked}
                    className={`cursor-pointer flex items-center justify-center gap-1.5 rounded-2xl p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm ${
                        isLiked
                            ? "bg-accent-soft text-accent"
                            : "text-zinc-700 hover:bg-accent/10 dark:text-slate-200 dark:hover:bg-accent"
                    }`}
                >
                    <ThumbsUp/>
                    {isLiked ? "Unlike" : "Like"}  
                </button>
                <button onClick={() => setShowComments((showingComments) => !showingComments)} className="cursor-pointer flex items-center justify-center gap-1.5 rounded-2xl p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-zinc-700 dark:text-slate-200 hover:bg-accent/10 dark:hover:bg-accent">
                    <Comment/>
                    Comment
                </button>
                {userData && !isOwnPost && (
                    <button
                        type="button"
                        onClick={() => setIsShareOpen(true)}
                        className="cursor-pointer flex items-center justify-center gap-1.5 rounded-2xl p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-zinc-700 dark:text-slate-200 hover:bg-accent/10 dark:hover:bg-accent"
                    >
                        <NodesRight/>
                        Share
                    </button>
                )}
            </div>
            {topComment && !showComments && (
                <TopCommentCard
                    topComment={topComment}
                    onViewAllComments={() => setShowComments(true)}
                />
            )}
            {showComments && <Comments postId={_id} />}
            
    </div>
    </>
  )
}
