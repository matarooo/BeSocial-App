import { ArrowLeft, Person } from "@gravity-ui/icons";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUsersData } from "./userprofile.services";
import { getUsersPostsData } from "../UserPosts/userposts.services";
import PostCard from "../../Feed/PostCard";

export default function UserProfile() {
  const { id } = useParams();
  const {
    data: usersData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => {
      if (!id) throw new Error("A user ID is required to load a profile.");
      return getUsersData(id);
    },
    enabled: Boolean(id),
  });
  const {
    data: userPosts = [],
    error: postsError,
  } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: () => {
      if (!id) throw new Error("A user ID is required to load posts.");
      return getUsersPostsData(id);
    },
    enabled: Boolean(id),
  });

  if (!usersData && isProfileLoading) {
    return (
      <div className="mx-auto mt-24 w-full max-w-3xl rounded-3xl border border-zinc-900/10 bg-white/80 p-6 text-zinc-600 shadow-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-zinc-300">
        Loading profile...
      </div>
    );
  }

  if (!usersData) {
    return (
      <div role="alert" className="mx-auto mt-24 w-full max-w-3xl p-6 text-red-600">
        {profileError ? "Failed to load user profile." : "User profile not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-24 w-full max-w-7xl rounded-3xl border border-zinc-900/10 bg-white/80 p-6 text-zinc-900 shadow-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white">
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-white/15 dark:bg-zinc-800/70 dark:text-zinc-200 dark:hover:border-accent/50 dark:hover:text-accent"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </Link>
      <div >
      {usersData.cover && (
        <img
          src={usersData.cover}
          alt=""
          className="mb-5 h-48 w-full rounded-2xl object-cover"
        />
      )}
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-900/10 bg-zinc-200 text-zinc-700 dark:border-white/15 dark:bg-zinc-800 dark:text-white">
          {usersData.photo ? (
            <img src={usersData.photo} alt={`${usersData.name}'s profile`} className="size-full object-cover" />
          ) : (
            <Person aria-hidden="true" className="size-7" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{usersData.name}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">@{usersData.username}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{usersData.email}</p>
        </div>
      </div>
      <div className="mt-5 flex gap-3 text-sm">
        <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
          {usersData.followersCount} followers
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
          {usersData.followingCount} following
        </span>
      </div>
    </div>
    <div className="mx-auto mt-5 w-full max-w-7xl">
      {postsError && <p role="alert">Failed to load user posts.</p>}
      {userPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
    </div>
  )
}
