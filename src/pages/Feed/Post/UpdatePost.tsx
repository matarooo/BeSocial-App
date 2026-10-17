import { Globe, LogoYandexMessenger, Person, Persons, Picture,Xmark } from "@gravity-ui/icons";
import { ListBox, Select, TextArea } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import type { Post } from "../feed.interface";
import { updatePost } from "../feed.services";

interface UpdatePostProps {
  post: Post;
  onClose: () => void;
}

export default function UpdatePost({ post, onClose }: UpdatePostProps) {
  const [body, setBody] = useState(post.body ?? "");
  const [privacy, setPrivacy] = useState(post.privacy);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const isVideoPreview = selectedFile?.type.startsWith("video/") ?? false;

  const updatePostMutation = useMutation({
    mutationFn: (postData: FormData) => updatePost(post._id, postData),
    onSuccess: (result) => {
      toast.success(result.message || "Post updated successfully");
      void queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
      void queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      void queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      onClose();
    },
    onError: (error) => toast.error(error.message || "Failed to update post. Please try again."),
  });

  useEffect(() => {
    if (!selectedFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !updatePostMutation.isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, updatePostMutation.isPending]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody && !selectedFile && !post.image) return;

    const postData = new FormData();
    postData.append("body", trimmedBody);
    postData.append("privacy", privacy);
    if (selectedFile) postData.append("image", selectedFile);
    updatePostMutation.mutate(postData);
  }

  function closeIfIdle() {
    if (!updatePostMutation.isPending) onClose();
  }

  const preview = imagePreview ?? post.image;
  const previewIsVideo = selectedFile ? isVideoPreview : false;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex h-dvh w-screen items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeIfIdle();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-post-title"
        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-zinc-900/10 bg-white p-5 text-zinc-900 shadow-2xl dark:border-white/15 dark:bg-zinc-900 dark:text-white sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-white/10">
          <h2 id="update-post-title" className="text-lg font-bold">Edit post</h2>
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={updatePostMutation.isPending}
            aria-label="Close edit post dialog"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-xl text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10"
          >
            <Xmark/>
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-white">
            {post.user.photo ? (
              <img src={post.user.photo} alt="" className="size-full object-cover" />
            ) : (
              <Person aria-hidden="true" className="size-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold">{post.user.name}</p>
            <Select
              aria-label="Post audience"
              selectedKey={privacy}
              onSelectionChange={(key) => {
                if (key === "public" || key === "following" || key === "only_me") {
                  setPrivacy(key);
                }
              }}
            >
              <Select.Trigger>
                <Select.Value className={'flex gap-2'}/>
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="public" textValue="public">
                    <Globe /> Public <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="following" textValue="following">
                    <Persons /> Following <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="only_me" textValue="only_me">
                    <Person /> Only Me <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <TextArea
            fullWidth
            aria-label="Post text"
            className="min-h-32"
            placeholder="Write what's in your mind..."
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />

          {preview && (
            <div className="relative mt-4">
              {previewIsVideo ? (
                <video
                  src={preview}
                  controls
                  playsInline
                  aria-label="Post video preview"
                  className="max-h-96 w-full rounded-xl object-contain"
                />
              ) : (
                <img
                  src={preview}
                  alt="Post media preview"
                  className="max-h-96 w-full rounded-xl object-contain"
                />
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
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
                className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-xs hover:bg-accent/10 dark:hover:bg-accent/20"
              >
                <Picture aria-hidden="true" className="text-green-600" />
                {post.image ? "Replace photo/video" : "Add photo/video"}
              </button>
            </div>
            <button
              type="submit"
              disabled={(!body.trim() && !selectedFile && !post.image) || updatePostMutation.isPending}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-2xl bg-accent px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogoYandexMessenger aria-hidden="true" />
              {updatePostMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  );
}
