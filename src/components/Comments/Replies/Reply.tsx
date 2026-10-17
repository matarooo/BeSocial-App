import { useQuery } from "@tanstack/react-query"
import { getAllReplies } from "./replies.services"
import ReplyCard from "./ReplyCard"
import CreateReplyCard from "./CreateReply"

interface ReplyProps {
  postId: string
  commentId: string
  creatorName:string
}

export default function Reply({ postId, commentId,creatorName }: ReplyProps) {
    const { data: replies = [], error } = useQuery({
        queryKey: ["replies", postId, commentId],
        queryFn: () => getAllReplies(postId, commentId),
    });

    return (
      <div className="ml-20 mt-3 space-y-3 border-l-2 border-zinc-600">
        <div className="ml-5">
        {error && <p role="alert">Failed to load replies. Please try again.</p>}
        {replies.map((reply) => (
            <ReplyCard key={reply._id} reply={reply} />
        ))}
        </div>
        <div className="mt-3">
          <CreateReplyCard postId={postId} commentId={commentId} creatorName={creatorName}/>
        </div>
      </div>
    )
}
