import { Xmark } from "@gravity-ui/icons";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

interface ImageModalChangeProps {
  selectedPhoto: File;
  isUploading: boolean;
  onCancel: () => void;
  onSave: (photo: File) => void;
}

export default function ImageModalChange({
  selectedPhoto,
  isUploading,
  onCancel,
  onSave,
}: ImageModalChangeProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isPreparing, setIsPreparing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(selectedPhoto);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedPhoto]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isUploading && !isPreparing) onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUploading, isPreparing, onCancel]);

  if (!previewUrl) return null;

  async function handleSavePhoto() {
    const image = imageRef.current;
    if (!image || isUploading || isPreparing) return;

    setIsPreparing(true);
    try {
      const cropSize = Math.min(image.naturalWidth, image.naturalHeight) / zoom;
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not prepare the selected photo.");

      context.drawImage(
        image,
        (image.naturalWidth - cropSize) / 2,
        (image.naturalHeight - cropSize) / 2,
        cropSize,
        cropSize,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => result ? resolve(result) : reject(new Error("Could not prepare the selected photo.")),
          "image/jpeg",
          0.92,
        );
      });
      onSave(new File([blob], "profile-photo.jpg", { type: "image/jpeg" }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not prepare the selected photo.");
    } finally {
      setIsPreparing(false);
    }
  }

  const isBusy = isUploading || isPreparing;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex h-dvh w-screen items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-photo-dialog-title"
        className="w-full max-w-xl rounded-3xl border border-zinc-900/10 bg-white p-5 text-zinc-900 shadow-2xl dark:border-white/15 dark:bg-zinc-900 dark:text-white sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="profile-photo-dialog-title" className="text-lg font-bold">Adjust profile photo</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Preview and zoom your photo before uploading.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            aria-label="Cancel profile photo upload"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10"
          >
            <Xmark aria-hidden="true" />
          </button>
        </div>
        <div className="mx-auto flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800">
          <img
            src={previewUrl}
            alt="Selected profile photo preview"
            className="size-full object-cover transition-transform duration-150"
            style={{ transform: `scale(${zoom})` }}
            ref={imageRef}
          />
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <label htmlFor="profile-photo-zoom">Zoom</label>
            <span>{zoom.toFixed(1)}×</span>
          </div>
          <input
            id="profile-photo-zoom"
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            aria-label="Zoom profile photo"
            className="w-full cursor-pointer accent-accent"
          />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            className="cursor-pointer rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSavePhoto}
            disabled={isBusy}
            className="cursor-pointer rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : isPreparing ? "Preparing..." : "Save photo"}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
