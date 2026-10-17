import { LogoYandexMessenger, Person,Xmark } from "@gravity-ui/icons";
import { TextArea } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { sharePost } from "../feed.services";
import type { Post } from "../feed.interface";
import { UserAuthContext } from "../../../Context/UserAuthProvider/UserAuthProvider";

interface SharePostProps {
  post: Post;
  onClose: () => void;
}

export default function SharePost({ post, onClose }: SharePostProps) {
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();
  const { userData } = useContext(UserAuthContext);

  const sharePostMutation = useMutation({
    mutationFn: () => sharePost(post._id, { body: body.trim()}),
    onSuccess: (result) => {
      toast.success(result.message || "Post shared successfully");
      void queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
      void queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      void queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      onClose();
    },
    onError: (error) => toast.error(error.message || "Failed to share post. Please try again."),
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !sharePostMutation.isPending) onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, sharePostMutation.isPending]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sharePostMutation.mutate();
  }

  function closeIfIdle() {
    if (!sharePostMutation.isPending) onClose();
  }

  if (!userData) return null;

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
        aria-labelledby="share-post-title"
        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-zinc-900/10 bg-white p-5 text-zinc-900 shadow-2xl dark:border-white/15 dark:bg-zinc-900 dark:text-white sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-white/10">
          <h2 id="share-post-title" className="text-lg font-bold">Share post</h2>
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={sharePostMutation.isPending}
            aria-label="Close share post dialog"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-xl text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10"
          >
            <Xmark/>
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-white">
            {userData.photo ? (
              <img src={userData.photo} alt="" className="size-full object-cover" />
            ) : (
              <Person aria-hidden="true" className="size-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold">{userData.name}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">@{userData.username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <TextArea
            fullWidth
            aria-label="Add a message to your share"
            className="min-h-24 mt-2"
            placeholder="Say something about this..."
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
            <div className="px-4 pt-3">
              <p className="text-sm font-bold">{post.user.name}</p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">@{post.user.username}</p>
            </div>
            {post.body && (
              <p className="whitespace-pre-wrap wrap-break-words px-4 py-3 text-sm">{post.body}</p>
            )}
            {post.image && (
              <img src={post.image} alt="Post being shared" className="max-h-72 w-full object-cover" />
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={sharePostMutation.isPending}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-2xl bg-accent px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogoYandexMessenger aria-hidden="true" />
              {sharePostMutation.isPending ? "Sharing..." : "Share post"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  );
}
