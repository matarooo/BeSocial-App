import { Person } from "@gravity-ui/icons";
import type { TopComment2 } from "../../../pages/Feed/feed.interface";
import { formatDate } from "../../../utils/formatDate";


export default function TopCommentCard({
    topComment,
    onViewAllComments,
}: {
    topComment: TopComment2;
    onViewAllComments: () => void;
}) {
    const {commentCreator,content,image ,createdAt} = topComment
    const {name , photo , username} = commentCreator;
    const formattedDate = formatDate(createdAt);
    return (
    <div className="bg-zinc-100 dark:bg-zinc-500/30 rounded-2xl p-2">
      <p className="font-bold text-sm px-3 py-2 mb-3">Top Comment</p>
      <div className="flex gap-2">
        <div className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm transition hover:ring-2 hover:ring-[#ff5005] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5005] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
            {photo ? (
                    <img src={photo} alt="" className="size-full object-cover" />
            ) : (
                <Person aria-hidden='true' className='size-5' />
                )}
        </div>
        <div className="flex flex-col bg-white/80 dark:bg-zinc-900/50 rounded-2xl w-full px-3 py-2">
            <span className="font-bold text-sm">{name}</span>
            <div className="flex flex-wrap items-center gap-1 text-zinc-600 dark:text-zinc-400 text-xs">
                <span>@{username}</span>
                {formattedDate && (
                    <>
                        <span aria-hidden="true">·</span>
                        <time dateTime={createdAt}>{formattedDate}</time>
                    </>
                )}
            </div>
            <div className="flex flex-col gap-2 mt-3">
                {content && <p>{content}</p>}
                {image && <img src={image} alt="Post" className="mt-2 max-h-44 w-full rounded-lg object-cover" />}
            </div>
        </div>
      </div>
      <button
        className=" text-xs text-accent cursor-pointer font-semibold px-3 py-2 hover:underline "
        onClick={onViewAllComments}
      >
                View All Comments
      </button>
    </div>
  )
}
