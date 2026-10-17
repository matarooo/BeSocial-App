import { Person,Picture,LogoYandexMessenger } from "@gravity-ui/icons";
import { Link } from "react-router";
import { TextArea } from "@heroui/react";
import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserAuthContext } from "../../../Context/UserAuthProvider/UserAuthProvider";
import { postComments } from "./comment.services";


export default function CreateCommentCard({ postId }: { postId: string }) {
    const {userData} = useContext(UserAuthContext)
    const [body, setBody] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const isVideoPreview = selectedFile?.type.startsWith("video/") ?? false;
    const fileBtn = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient();
    
    const createCommentMutation = useMutation({
        mutationFn: (commentData: FormData) => postComments(postId, commentData),
        onSuccess: () => {
            toast.success("Comment Added Successfully");
            setBody("");
            setSelectedFile(null);
            if (fileBtn.current) fileBtn.current.value = "";
            void queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (error) => toast.error(error.message || "Failed to create Comment. Please try again."),
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

     function handleUserComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedBody = body.trim();
        if (!trimmedBody && !selectedFile) return;

        const commentData = new FormData();
        if (trimmedBody) {
            commentData.append("content", trimmedBody);
        }
        if (selectedFile) {
            commentData.append("image", selectedFile);
        }
        createCommentMutation.mutate(commentData);
     }
     function handleImgBtn(){
        fileBtn.current?.click()
     }
  return (
    <>
    <div className=" mx-5  flex-col gap-6 border border-zinc-900/10 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white p-5 rounded-3xl mb-5">
        <form onSubmit={handleUserComment}>
        <div className="flex gap-2 items-center">
        <div className="flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm transition hover:ring-2 hover:ring-[#ff5005] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5005] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                {userData?.photo ? (
                    <img src={userData?.photo} alt="" className="size-full object-cover" />
                ) : (
                    <Person aria-hidden='true' className='size-5' />
                )}
            </div>
            <div className="flex flex-col">
                <Link to={`/profile/${userData?._id}`}
                state={{ profile: userData }} className="font-bold text-sm">{userData?.name}</Link>
            </div>
        </div>
        <div className="grow mt-5">
            <TextArea
                fullWidth
                aria-label="Quick project update"
                className="h-15"
                placeholder="Write what's in your mind..."
                value={body}
                onChange={(event) => setBody(event.target.value)}
                />
        {imagePreview && (
            <div className="w-full relative mt-3">
                {isVideoPreview ? (
                    <video
                        src={imagePreview}
                        controls
                        playsInline
                        aria-label="Selected video preview"
                        className="max-h-96 w-full rounded-xl object-contain"
                    />
                ) : (
                    <img
                        src={imagePreview}
                        alt="Selected image preview"
                        className="max-h-96 w-full rounded-xl object-contain"
                    />
                )}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedFile(null);
                        if (fileBtn.current) fileBtn.current.value = "";
                    }}
                    aria-label="Remove selected image"
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white cursor-pointer"
                >
                    Remove
                </button>
            </div>
        )}
        </div>
        <div className="flex justify-between">
            <div>
                <input
                    ref={fileBtn}
                    type="file"
                    accept="image/*,video/*"
                    hidden
                    onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
                <button type="button" onClick={handleImgBtn} className="flex gap-2 items-center text-xs mt-2 cursor-pointer hover:bg-accent/10 dark:hover:bg-accent/20 rounded-full px-2 py-1">
                    <Picture className="text-green-600"/>
                    Photo/Video
                </button>
            </div>
            <button
                type="submit"
                className="cursor-pointer w-10 h-10 rounded-4xl flex items-center justify-center bg-accent/90 text-lg font-semibold text-white shadow-sm transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
                disabled={(!body.trim() && !selectedFile) || createCommentMutation.isPending}
            >
                <LogoYandexMessenger />
            </button>
        </div>
        </form>
    </div>
    </>
)
}
