import { ArrowsExpand, Camera, Person, Xmark } from "@gravity-ui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { getUsersPostsData } from "./UserPosts/userposts.services";
import PostCard from "../Feed/PostCard";
import { updateUserProfilePicture } from "./UserProfile/authuserPorfile.services";
import ImageModalChange from "./imageModalChange";

export default function Profile() {
     const { userData, setUserData } = useContext(UserAuthContext);
     const queryClient = useQueryClient();
     const fileInputRef = useRef<HTMLInputElement>(null);
     const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);
     const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
     const { data: userPosts = [], error } = useQuery({
      queryKey: ["userPosts", userData?._id],
      queryFn: () => {
        if (!userData) throw new Error("A user ID is required to load posts.");
        return getUsersPostsData(userData._id);
      },
      enabled: Boolean(userData?._id),
     });
     const updatePhotoMutation = useMutation({
      mutationFn: updateUserProfilePicture,
      onSuccess: (updatedUser) => {
        setUserData((currentUser) => currentUser
          ? { ...currentUser, ...updatedUser }
          : updatedUser
        );
        void queryClient.invalidateQueries({ queryKey: ["userProfile", updatedUser._id] });
        setSelectedPhoto(null);
        toast.success("Profile photo updated");
      },
      onError: (mutationError) => toast.error(mutationError.message || "Failed to update profile photo."),
     });

     useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setIsPhotoPreviewOpen(false);
          if (!updatePhotoMutation.isPending) setSelectedPhoto(null);
        }
      }
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
     }, [updatePhotoMutation.isPending]);

     function handleUploadPhoto(photo: File) {
      if (updatePhotoMutation.isPending) return;
      const photoData = new FormData();
      photoData.append("photo", photo);
      updatePhotoMutation.mutate(photoData);
     }

  return ( 
    <div className="mx-auto mt-20 w-[calc(100%_-_1rem)] max-w-7xl rounded-3xl border border-zinc-900/10 bg-white/80 p-4 text-zinc-900 shadow-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white sm:mt-24 sm:w-full sm:p-6">
      <div>
      {userData?.cover && (
        <img
          src={userData.cover}
          alt=""
          className="mb-5 h-32 w-full rounded-2xl object-cover sm:h-48"
        />
      )}
      {userData && (
        <>
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="group relative size-24 shrink-0">
            <div className="flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-white bg-zinc-200 text-zinc-700 shadow-sm ring-1 ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:ring-white/15">
              {userData.photo ? (
                <img src={userData.photo} alt={`${userData.name}'s profile`} className="size-full object-cover" />
              ) : (
                <Person aria-hidden="true" className="size-9" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const photo = event.target.files?.[0];
                if (photo) setSelectedPhoto(photo);
                event.target.value = "";
              }}
            />
            {userData.photo && (
              <button
                type="button"
                onClick={() => setIsPhotoPreviewOpen(true)}
                aria-label="View profile photo full screen"
                className="pointer-events-none absolute bottom-0 left-0 flex size-9 translate-y-1/4 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-white text-zinc-700 opacity-0 shadow-md transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 dark:border-zinc-900 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                <ArrowsExpand aria-hidden="true" className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={updatePhotoMutation.isPending}
              aria-label="Change profile photo"
              className="pointer-events-none absolute bottom-0 right-0 flex size-9 translate-y-1/4 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-accent text-white opacity-0 shadow-md transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-900"
            >
              <Camera aria-hidden="true" className="size-4" />
            </button>
          </div>
          <div className="min-w-0">
            <h1 className="break-words text-xl font-bold sm:text-2xl">{userData.name}</h1>
            <p className="mt-1 break-all text-sm text-zinc-600 dark:text-zinc-400">@{userData.username}</p>
            <p className="mt-1 break-all text-sm text-zinc-600 dark:text-zinc-400">{userData.email}</p>
          </div>
        </div>
        {isPhotoPreviewOpen && userData.photo && createPortal(
          <div
            className="fixed inset-0 z-9999 flex h-dvh w-screen items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Full-screen profile photo"
            onClick={() => setIsPhotoPreviewOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsPhotoPreviewOpen(false)}
              aria-label="Close profile photo preview"
              className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Xmark aria-hidden="true" />
            </button>
            <img
              src={userData.photo}
              alt={`${userData.name}'s profile`}
              className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] rounded-2xl object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </div>,
          document.body,
        )}
        {selectedPhoto && (
          <ImageModalChange
            selectedPhoto={selectedPhoto}
            isUploading={updatePhotoMutation.isPending}
            onCancel={() => setSelectedPhoto(null)}
            onSave={handleUploadPhoto}
          />
        )}
        </>
      )}
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
          {userData?.followersCount ?? 0} followers
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
          {userData?.followingCount ?? 0} following
        </span>
      </div>
    </div>
      <div className="mt-5">
        {error && <p role="alert">Failed to load user posts.</p>}
        {userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
