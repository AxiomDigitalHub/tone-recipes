"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "@/lib/db/notifications";
import type { Notification, NotificationType } from "@/types/community";
import {
  MessageSquare,
  Star,
  UserPlus,
  CheckCircle,
  XCircle,
  MessageCircle,
  Heart,
  Bell,
  CheckCheck,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const ICON_MAP: Record<NotificationType, typeof MessageSquare> = {
  comment_reply: MessageSquare,
  rating: Star,
  new_follower: UserPlus,
  recipe_approved: CheckCircle,
  recipe_rejected: XCircle,
  forum_reply: MessageCircle,
  recipe_comment: Heart,
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/* -------------------------------------------------------------------------- */
/*  Skeleton                                                                  */
/* -------------------------------------------------------------------------- */

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-border" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-border" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  /* ---- Auth guard -------------------------------------------------------- */

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  /* ---- Fetch notifications ---------------------------------------------- */

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* ---- Actions ---------------------------------------------------------- */

  async function handleMarkAllRead() {
    if (!user) return;
    setMarkingAll(true);
    try {
      await markAllAsRead(user.id);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true })),
      );
    } catch {
      // silent
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleClick(notification: Notification) {
    if (!user) return;

    // Mark as read optimistically
    if (!notification.is_read) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n,
        ),
      );
      markAsRead(notification.id, user.id);
    }

    // Navigate
    if (notification.link) {
      router.push(notification.link);
    }
  }

  /* ---- Render ----------------------------------------------------------- */

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-muted">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            {markingAll ? "Marking..." : "Mark all as read"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-6 space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))
        ) : error ? (
          <div className="rounded-lg border border-border bg-surface p-6 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-3 text-sm font-medium text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16">
            <Bell className="mb-4 h-10 w-10 text-muted" />
            <p className="text-lg font-semibold text-foreground">
              You&apos;re all caught up!
            </p>
            <p className="mt-1 text-sm text-muted">
              No notifications to show right now.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = ICON_MAP[notification.type] ?? Bell;
            return (
              <button
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  notification.is_read
                    ? "border-border bg-surface hover:bg-surface-hover"
                    : "border-accent/20 bg-accent/5 hover:bg-accent/10"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    notification.is_read
                      ? "bg-border text-muted"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Body */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-medium ${
                        notification.is_read
                          ? "text-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted">
                        {timeAgo(notification.created_at)}
                      </span>
                      {!notification.is_read && (
                        <span className="h-2 w-2 rounded-full bg-accent" />
                      )}
                    </div>
                  </div>
                  {notification.body && (
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                      {notification.body}
                    </p>
                  )}
                  {notification.actor?.display_name && (
                    <p className="mt-1 text-xs text-muted">
                      by {notification.actor.display_name}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
