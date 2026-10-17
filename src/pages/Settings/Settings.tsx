import { Key } from "@gravity-ui/icons";
import { useMutation } from "@tanstack/react-query";
import { useState, type SubmitEvent } from "react";
import toast from "react-hot-toast";
import { patchPassword } from "../Profile/ChangePassword/chnagepassword.services";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: patchPassword,
    onSuccess: (message) => {
      toast.success(message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setValidationError("");
      
    },
    onError: (error) => toast.error(error.message || "Failed to update password."),
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (!passwordPattern.test(newPassword)) {
      setValidationError("Use at least 8 characters with uppercase, lowercase, number, and special character.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("New password and confirmation do not match.");
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  }

  return (
    <section className="w-full rounded-3xl border border-zinc-900/10 bg-white/80 p-6 text-zinc-900 shadow-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white sm:p-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Key aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Change Password</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Keep your account secure by using a strong password.
          </p>
        </div>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="current-password" className="mb-1.5 block text-sm font-semibold">
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Enter current password"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-semibold">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
          />
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            At least 8 characters with uppercase, lowercase, number, and special character.
          </p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-semibold">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter new password"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-800 dark:placeholder:text-zinc-500"
          />
        </div>

        {validationError && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {validationError}
          </p>
        )}

        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full cursor-pointer rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {changePasswordMutation.isPending ? "Updating password..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
