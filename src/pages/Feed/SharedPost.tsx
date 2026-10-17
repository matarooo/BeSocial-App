import { Person ,ArrowUpRightFromSquare} from "@gravity-ui/icons";
import type { SharedPost } from "./feed.interface";

export default function SharedPost({ sharedPost }: { sharedPost: SharedPost }) {
    const { user, body, image } = sharedPost
  return (
    <div>
      <div className="flex justify-between items-center px-4 pt-4">
                <div className="flex gap-2">
                    <div className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm transition hover:ring-2 hover:ring-[#ff5005] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5005] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                        {user.photo ? (
                            <img src={user.photo} alt="" className="size-full object-cover" />
                        ) : (
                            <Person aria-hidden='true' className='size-5' />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">{user.name}</span>
                        <span className="text-zinc-600 dark:text-zinc-400 text-xs">@{user.username}</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-accent font-bold text-xs px-3 py-1 rounded-2xl cursor-pointer hover:bg-accent/20">
                    <ArrowUpRightFromSquare/>
                    Original Post
                </button>
            </div>
            <div className="mt-4 flex flex-col gap-2">
                {body && <p className="px-4 pb-4">{body}</p>}
                {image && <img src={image} alt="Post" className="max-h-128 w-full rounded-2xl object-cover" />}
            </div>
    </div>
  )
}
