import { formatDate } from "../../../utils/formatDate";
import type { Comment } from "./comment.interface";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { likeAndUnlike } from "./LikeAndUnlike/like-unlike.services";
import { deleteComments } from "./comment.services";
import toast from "react-hot-toast";
import { Ellipsis, Pencil, Person, TrashBin } from "@gravity-ui/icons";
import { UserAuthContext } from "../../../Context/UserAuthProvider/UserAuthProvider";
import Reply from "../Replies/Reply";
import DropdownList, { type DropdownListEntry } from "../../DropdownList/DropdownList";
import EditComment from "./EditComment";

export default function CommentCard({comment}:{comment:Comment}) {
    const {createdAt , commentCreator ,content , image ,repliesCount,likes,post,_id} = comment
    const {name , photo , username} = commentCreator
    const { userData } = useContext(UserAuthContext);
    const queryClient = useQueryClient();
    const isCommentOwner = userData?._id === commentCreator._id;
    const formattedDate = formatDate(createdAt);
    const [isLiked, setIsLiked] = useState(() => Boolean(
      userData && likes.includes(userData._id)
    ));
    const [likesTotal, setLikesTotal] = useState(likes.length);
    const [isUpdatingLike, setIsUpdatingLike] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      if (!showImagePreview) return;

      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") setShowImagePreview(false);
      }

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showImagePreview]);

    async function handleLikeClick() {
      setIsUpdatingLike(true);
      try {
        const result = await likeAndUnlike(post, _id);
        setIsLiked(result.like);
        setLikesTotal(result.likesTotal);
      } catch {
        toast.error("Failed to update comment like. Please try again.");
      } finally {
        setIsUpdatingLike(false);
      }
    }

    async function handleDelete() {
      if (!isCommentOwner || isDeleting) return;

      setIsDeleting(true);
      try {
        const message = await deleteComments(post, _id);
        await queryClient.invalidateQueries({ queryKey: ["comments", post] });
        toast.success(message);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete comment. Please try again.",
        );
      } finally {
        setIsDeleting(false);
      }
    }

    const commentMenuItems: DropdownListEntry[] = [
      {
        type: "item",
        label: "Edit",
        icon: <Pencil aria-hidden="true" className="size-4" />,
        onSelect: () => setIsEditing(true),
      },
      { type: "separator" },
      {
        type: "item",
        label: isDeleting ? "Deleting..." : "Delete",
        icon: <TrashBin aria-hidden="true" className="size-4" />,
        onSelect: handleDelete,
        variant: "danger",
      },
    ];

  return (
    <div className="mb-3 p-4">
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
                    <div>
                        <span aria-hidden="true">· </span>
                        <time dateTime={createdAt}>{formattedDate}</time>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2 mt-3">
                {!isEditing && content && <p>{content}</p>}
                {image && !isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowImagePreview(true)}
                    aria-label="View comment image full screen"
                    className="mt-2 abs w-full cursor-pointer"
                  >
                    <img src={image} alt="Comment" className="max-h-44 w-full rounded-lg object-cover" />
                  </button>
                )}
            </div>
            {isEditing && (
              <EditComment
                comment={comment}
                onCancel={() => setIsEditing(false)}
                onUpdated={() => setIsEditing(false)}
              />
            )}
            <div className="flex items-center gap-3 text-xs mt-3">
                <button
                  className={`cursor-pointer hover:underline disabled:cursor-not-allowed ${isLiked ? 'text-accent' : ''}`}
                  onClick={handleLikeClick}
                  disabled={isUpdatingLike}
                  aria-pressed={isLiked}
                >
                  ({likesTotal}) {isLiked ? "Unlike" : "Like"}
                </button>
                <button
                  className={`cursor-pointer hover:underline disabled:cursor-not-allowed ${showReplies ? "text-accent" : ""}`}
                  onClick={() => setShowReplies((visible) => !visible)}
                  aria-expanded={showReplies}
                >
                  {showReplies ? "Hide Replies" : `(${repliesCount}) Reply`}
                </button>
                {isCommentOwner && (
                  <DropdownList
                    ariaLabel="Comment options"
                    triggerLabel="Comment options"
                    items={commentMenuItems}
                    renderTrigger={(triggerProps) => (
                      <button
                        {...triggerProps}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <Ellipsis aria-hidden="true" className="size-5" />
                      </button>
                    )}
                  />
                )}
            </div>
        </div>
      </div>
      {showReplies && (
        <div>
          <Reply postId={post} commentId={_id} creatorName={name} />
        </div>
      )}
      {image && showImagePreview && createPortal(
        <div
          className="fixed inset-0 z-9999 flex h-dvh w-screen items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen comment image"
          onClick={() => setShowImagePreview(false)}
        >
          <button
            type="button"
            onClick={() => setShowImagePreview(false)}
            aria-label="Close image preview"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-3xl leading-none text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            x
          </button>
          <img
            src={image}
            alt="Comment full size"
            className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>,
        document.body,
      )}
      
    </div>
  )
}
