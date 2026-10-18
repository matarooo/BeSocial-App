import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CheckDouble, Comment, HeartFill, Person, PersonPlus } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import {
  getNotifications,
  getUnreadNotifications,
  patchNotificationAllAsRead,
  patchNotificationAsRead,
  unreadNotificationsQueryKey,
} from "./notifications.services";
import type { NotificationItem } from "./getnotifications.interface";
import { useState } from "react";

type NotificationFilter = "all" | "unread";

const getNotificationMessage = (notification: NotificationItem) => {
  if (notification.message?.trim()) return notification.message;

  const action = notification.type?.toLowerCase().replaceAll("_", " ").replaceAll("-", " ");
  switch (true) {
    case action?.includes("like"):
      return "liked your post";
    case action?.includes("comment"):
      return "commented on your post";
    case action?.includes("share"):
      return "shared your post";
    case action?.includes("follow"):
      return "started following you";
    default:
      return action || "New activity";
  }
};

const getNotificationIcon = (notification: NotificationItem) => {
  const type = notification.type?.toLowerCase();

  if (type?.includes("comment")) {
    return <Comment aria-hidden="true" className="size-4 text-accent" />;
  }
  if (type?.includes("follow")) {
    return <PersonPlus aria-hidden="true" className="size-4 text-accent" />;
  }
  if (type?.includes("like")) {
    return <HeartFill aria-hidden="true" className="size-4 text-red-500" />;
  }

  return <Bell aria-hidden="true" className="size-4 text-accent" />;
};

const formatNotificationTime = (createdAt?: string) => {
  if (!createdAt) return "";

  const elapsedMs = Date.now() - new Date(createdAt).getTime();
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return "";

  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
};

export default function Notifications() {
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const queryClient = useQueryClient();
  const {
    data: notifications = [],
    error,
    isPending,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
  const {
    data: unreadCountFromApi,
    error: unreadCountError,
  } = useQuery({
    queryKey: unreadNotificationsQueryKey,
    queryFn: getUnreadNotifications,
  });
  const markAsReadMutation = useMutation({
    mutationFn: patchNotificationAsRead,
    onSuccess: async (_notification, notificationId) => {
      queryClient.setQueryData<NotificationItem[]>(["notifications"], (current = []) =>
        current.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
      await queryClient.invalidateQueries({ queryKey: unreadNotificationsQueryKey });
    },
    onError: (mutationError) =>
      toast.error(mutationError.message || "Failed to mark notification as read."),
  });
  const markAllAsReadMutation = useMutation({
    mutationFn: patchNotificationAllAsRead,
    onSuccess: async () => {
      queryClient.setQueryData<NotificationItem[]>(["notifications"], (current = []) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
      await queryClient.invalidateQueries({ queryKey: unreadNotificationsQueryKey });
      toast.success("All notifications marked as read.");
    },
    onError: (mutationError) =>
      toast.error(mutationError.message || "Failed to mark notifications as read."),
  });

  const isRead = (notification: NotificationItem) => Boolean(notification.isRead);
  const unreadCount =
    unreadCountFromApi ?? notifications.filter((notification) => !isRead(notification)).length;
  const filteredNotifications = notifications.filter(
    (notification) => filter === "all" || !isRead(notification),
  );

  return (
    <section className="mx-2 mt-24 max-w-7xl overflow-hidden rounded-3xl border border-zinc-900/10 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white sm:mx-auto sm:mt-30 sm:rounded-4xl">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-900/10 px-4 py-4 dark:border-white/10 sm:px-5 sm:py-5">
        <div>
          <h1 className="text-xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Realtime updates for likes, comments, shares, and follows.
          </p>
          <div className="mt-4 flex gap-2" aria-label="Filter notifications">
            {(["all", "unread"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  filter === option
                    ? "bg-accent text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-accent-soft hover:text-accent dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-accent/15 dark:hover:text-accent"
                }`}
              >
                {option}
                {option === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => markAllAsReadMutation.mutate()}
          disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-900/10 px-3 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:text-zinc-300 dark:hover:bg-accent/15 dark:hover:text-accent"
        >
          <CheckDouble aria-hidden="true" className="size-4" />
          {markAllAsReadMutation.isPending ? "Marking..." : "Mark all as read"}
        </button>
      </header>

      <div className="space-y-3 p-2 sm:p-4">
        {unreadCountError && (
          <p role="alert" className="text-sm text-amber-700 dark:text-amber-400">
            Could not load the unread notification count.
          </p>
        )}
        {isPending && (
          <p role="status" className="py-8 text-center text-sm text-zinc-500">
            Loading notifications...
          </p>
        )}
        {error && (
          <p role="alert" className="py-8 text-center text-sm text-red-600">
            Failed to load notifications. Please try again.
          </p>
        )}
        {!isPending && !error && filteredNotifications.map((notification) => {
          const actor = notification.sender ?? notification.actor ?? notification.user;
          const hasBeenRead = isRead(notification);
          return (
            <article
              key={notification._id}
              className={`flex items-start gap-3 rounded-2xl border p-3 transition-colors sm:gap-4 sm:p-4 ${
                hasBeenRead
                  ? "border-zinc-900/10 bg-white/70 dark:border-white/10 dark:bg-zinc-900/40"
                  : "border-accent/30 bg-accent-soft dark:border-accent/40 dark:bg-accent/10"
              }`}
            >
              <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200">
                {actor?.photo ? (
                  <img src={actor.photo} alt="" className="size-full object-cover" />
                ) : (
                  <Person aria-hidden="true" className="size-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-800 dark:text-zinc-100">
                  {actor?.name && <strong className="font-bold">{actor.name} </strong>}
                  {getNotificationMessage(notification)}
                </p>
                {(notification.post?.body ?? notification.entity?.body) && (
                  <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {notification.post?.body ?? notification.entity?.body}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {getNotificationIcon(notification)}
                  {hasBeenRead ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Check aria-hidden="true" className="size-4" />
                      Read
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markAsReadMutation.mutate(notification._id)}
                      disabled={markAsReadMutation.isPending}
                      className="font-semibold text-accent hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              <time
                className="shrink-0 pt-1 text-xs text-zinc-500 dark:text-zinc-400"
                dateTime={notification.createdAt}
              >
                {formatNotificationTime(notification.createdAt)}
              </time>
            </article>
          );
        })}
        {!isPending && !error && filteredNotifications.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {filter === "unread" ? "You have no unread notifications." : "You have no notifications yet."}
          </p>
        )}
      </div>
    </section>
  );
}
