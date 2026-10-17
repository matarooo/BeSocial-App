import { Ellipsis, Pencil, Person, TrashBin } from "@gravity-ui/icons";
import type { Reply } from "./replies.interface";
import { formatDate } from "../../../utils/formatDate";
import { useContext, useState, type SubmitEvent } from "react";
import { UserAuthContext } from "../../../Context/UserAuthProvider/UserAuthProvider";
import DropdownList, { type DropdownListEntry } from "../../DropdownList/DropdownList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReply, updateReply } from "./replies.services";
import { TextArea } from "@heroui/react";
import toast from "react-hot-toast";

interface ReplyCardProps {
  reply: Reply
}

export default function ReplyCard({ reply }: ReplyCardProps) {
    const{_id,commentCreator,content,createdAt,post,parentComment}= reply
    const {name,photo} = commentCreator
    const formattedDate = formatDate(createdAt);
    const { userData } = useContext(UserAuthContext);
    const queryClient = useQueryClient();
    const isReplyOwner = userData?._id === commentCreator._id;
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const updateMutation = useMutation({
      mutationFn: (data: FormData) => updateReply(post, _id, data),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["replies", post, parentComment] });
        toast.success("Reply updated successfully.");
        setIsEditing(false);
      },
      onError: (error) => toast.error(error.message || "Failed to update reply."),
    });
    const deleteMutation = useMutation({
      mutationFn: () => deleteReply(post, _id),
      onSuccess: async (message) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["replies", post, parentComment] }),
          queryClient.invalidateQueries({ queryKey: ["comments", post] }),
        ]);
        toast.success(message || "Reply deleted successfully.");
      },
      onError: (error) => toast.error(error.message || "Failed to delete reply."),
    });

    function handleEditSubmit(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      const trimmedContent = editedContent.trim();
      if (!trimmedContent || trimmedContent === content) {
        setIsEditing(false);
        return;
      }
      const formData = new FormData();
      formData.append("content", trimmedContent);
      updateMutation.mutate(formData);
    }

    const menuItems: DropdownListEntry[] = [
      {
        type: "item",
        label: "Edit",
        icon: <Pencil aria-hidden="true" className="size-4" />,
        onSelect: () => {
          setEditedContent(content);
          setIsEditing(true);
        },
      },
      { type: "separator" },
      {
        type: "item",
        label: deleteMutation.isPending ? "Deleting..." : "Delete",
        icon: <TrashBin aria-hidden="true" className="size-4" />,
        onSelect: () => deleteMutation.mutate(),
        variant: "danger",
      },
    ];

  return (
    <div className="flex gap-2">
        <div className="flex size-9  cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm transition hover:ring-2 hover:ring-[#ff5005] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5005] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
        {photo ? (
                <img src={photo} alt="" className="size-full object-cover" />
        ) : (
            <Person aria-hidden='true' className='size-5' />
        )}
        </div>
    <div key={_id} className="mb-2 flex min-w-0 flex-1 items-start justify-between gap-2 rounded-xl bg-white/60 px-3 py-2 dark:bg-zinc-900/40">
        <div className="min-w-0 flex-1">
            <p className="text-xs font-bold">{name}</p>
            <div className="flex flex-wrap items-center gap-1 text-zinc-600 dark:text-zinc-400 text-xs">
            {formattedDate && (
                    <div>
                        <time dateTime={createdAt}>{formattedDate}</time>
                    </div>
                )}
            </div>
            {!isEditing && <p className="text-sm">{content}</p>}
            {isEditing && (
              <form onSubmit={handleEditSubmit} className="mt-2 space-y-2">
                <TextArea
                  fullWidth
                  aria-label="Edit reply"
                  value={editedContent}
                  onChange={(event) => setEditedContent(event.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={updateMutation.isPending}
                    className="cursor-pointer rounded-full px-3 py-1 text-xs hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!editedContent.trim() || updateMutation.isPending}
                    className="cursor-pointer rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white hover:bg-[#d13f00] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}
        </div>
        {isReplyOwner && (
          <DropdownList
            ariaLabel="Reply options"
            triggerLabel="Reply options"
            items={menuItems}
            renderTrigger={(triggerProps) => (
              <button
                {...triggerProps}
                disabled={deleteMutation.isPending || updateMutation.isPending}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Ellipsis aria-hidden="true" className="size-5" />
              </button>
            )}
          />
        )}
    </div>
    </div>
  )
}
