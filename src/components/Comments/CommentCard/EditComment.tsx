import { LogoYandexMessenger, Picture } from "@gravity-ui/icons";
import { TextArea } from "@heroui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateComments } from "./comment.services";
import type { Comment } from "./comment.interface";

type EditCommentProps = {
  comment: Comment;
  onCancel: () => void;
  onUpdated: () => void;
};

export default function EditComment({ comment, onCancel, onUpdated }: EditCommentProps) {
  const [content, setContent] = useState(comment.content);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const isVideoPreview = selectedFile?.type.startsWith("video/") ?? false;

  const updateCommentMutation = useMutation({
    mutationFn: (commentData: FormData) =>
      UpdateComments(comment.post, comment._id, commentData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", comment.post] });
      toast.success("Comment updated successfully.");
      onUpdated();
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update comment. Please try again."),
  });

  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent && !comment.image && !selectedFile) return;

    const commentData = new FormData();
    commentData.append("content", trimmedContent);
    if (selectedFile) commentData.append("image", selectedFile);
    updateCommentMutation.mutate(commentData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 rounded-2xl border border-zinc-900/10 bg-white/80 p-4 dark:border-white/15 dark:bg-zinc-900/70"
    >
      <TextArea
        fullWidth
        aria-label="Edit comment"
        className="min-h-20"
        placeholder="Write what's in your mind..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      {(filePreview || comment.image) && (
        <div className="relative mt-3">
          {isVideoPreview ? (
            <video
              src={filePreview ?? undefined}
              controls
              playsInline
              aria-label="Selected video preview"
              className="max-h-64 w-full rounded-xl object-contain"
            />
          ) : (
            <img
              src={filePreview ?? comment.image}
              alt="Comment attachment preview"
              className="max-h-64 w-full rounded-xl object-contain"
            />
          )}
          {filePreview && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/70 px-2 py-1 text-xs text-white"
            >
              Remove new attachment
            </button>
          )}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 text-xs hover:bg-accent/10 dark:hover:bg-accent/20"
          >
            <Picture className="text-green-600" />
            Photo/Video
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={updateCommentMutation.isPending}
            className="cursor-pointer rounded-full px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed dark:text-zinc-300 dark:hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
        <button
          type="submit"
          aria-label="Save comment"
          disabled={
            (!content.trim() && !comment.image && !selectedFile) ||
            updateCommentMutation.isPending
          }
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-accent/90 text-white shadow-sm transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogoYandexMessenger />
        </button>
      </div>
    </form>
  );
}
