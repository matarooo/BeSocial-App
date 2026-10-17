import { Person , PersonPlus } from "@gravity-ui/icons"
import { Link } from "react-router"
import type { SuggestionList } from "../follow-suggest.interface"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putFollowSuggest } from "../follow-suggest.services";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserAuthContext } from "../../../../Context/UserAuthProvider/UserAuthProvider";

export default function UserFollowCard({suggestion}:{suggestion:SuggestionList}) {
    const {username ,name , photo , followersCount ,mutualFollowersCount,_id } = suggestion;
    const { userData } = useContext(UserAuthContext);
    const queryClient = useQueryClient();
    const followMutation = useMutation({
        mutationFn: putFollowSuggest,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["followSuggestions"] }),
                queryClient.invalidateQueries({ queryKey: ["followSuggestionsPage"] }),
                queryClient.invalidateQueries({ queryKey: ["userData"] }),
            ]);
        },
        onError: (error) => toast.error(error.message || "Failed to update follow status. Please try again."),
    });
    const isFollowingInUserData = userData?.following?.some((followedUser) =>
        typeof followedUser === "string"
            ? followedUser === _id
            : followedUser?._id === _id || followedUser?.id === _id
    ) ?? false;
    const isFollowing = followMutation.data?.data.following
        ?? suggestion.isFollowing
        ?? isFollowingInUserData;

  return (
    <div className="border border-zinc-900/10 dark:border-zinc-600 bg-white/70 dark:bg-zinc-900/40 p-5 rounded-2xl mb-2">
        <div className="flex justify-between items-center mb-3">
            <Link
                to={`/profile/${suggestion._id}`}
                state={{ profile: suggestion }}
                className="flex gap-2 w-full"
            >
                <div className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm transition hover:ring-2 hover:ring-[#ff5005] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5005] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                    {photo ? (
                        <img src={photo} alt={name} className="size-full w-full object-cover" />
                    ) : (
                        <Person aria-hidden='true' className='size-5' />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-xs">{name}</span>
                    <span className="text-zinc-600 dark:text-zinc-400 text-xs">@{username}</span>
                </div>
            </Link>
                <button
                    type="button"
                    onClick={() => {
                        if (!followMutation.isPending) {
                            followMutation.mutate(_id);
                        }
                    }}
                    disabled={followMutation.isPending}
                    aria-label={isFollowing ? `Following ${name}` : `Follow ${name}`}
                    className={`flex items-center gap-1 text-[10px] text-white px-3 py-1 font-bold rounded-full disabled:cursor-default cursor-pointer ${
                        isFollowing
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-[#ff5005] hover:bg-[#d13f00]"
                    }`}
                >
                    <PersonPlus/>
                    {followMutation.isPending ? "..." : isFollowing ? "Following" : "Follow"}
                </button>
        </div>
        <div className="flex gap-3">
        {followersCount !== undefined && (
            <span className="bg-zinc-200 dark:bg-zinc-700 rounded-full px-3 py-1 text-[11px] text-zinc-700 dark:text-zinc-200">
                {followersCount} Followers
            </span>
        )}
        {(mutualFollowersCount ?? 0) > 0 && (
            <span className="bg-accent-soft rounded-full px-3 py-1 text-[11px] text-accent">
                {mutualFollowersCount} mutual
            </span>
        )}
        </div>
    
    </div>
  )
}
