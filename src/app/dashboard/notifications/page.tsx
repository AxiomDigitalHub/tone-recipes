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
    <div className="dashboard-notif-row dashboard-notif-row-skeleton">
      <span className="dashboard-notif-icon" aria-hidden />
      <div className="dashboard-notif-skel-lines">
        <span />
        <span />
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
      <div>
        <h1 className="page-title page-title-sm">Notifications</h1>
        <p className="dashboard-inner-dek">Loading…</p>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      {/* Header */}
      <div className="dashboard-notif-head">
        <div>
          <h1 className="page-title page-title-sm">Notifications</h1>
          {unreadCount > 0 && (
            <p className="dashboard-inner-dek">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="hero-cta hero-cta-secondary"
          >
            <CheckCheck className="h-4 w-4" />
            {markingAll ? "Marking…" : "Mark all as read"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="dashboard-notif-list">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))
        ) : error ? (
          <div className="dashboard-notif-empty">
            <p className="dashboard-notif-empty-title">{error}</p>
            <button
              onClick={fetchNotifications}
              className="dashboard-notif-retry"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="dashboard-notif-empty">
            <Bell className="dashboard-notif-empty-icon" aria-hidden />
            <p className="dashboard-notif-empty-title">
              You&apos;re all caught up.
            </p>
            <p className="dashboard-notif-empty-dek">
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
                className={`dashboard-notif-row ${notification.is_read ? "is-read" : "is-unread"}`}
              >
                <span className="dashboard-notif-icon" aria-hidden>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="dashboard-notif-body">
                  <div className="dashboard-notif-row-top">
                    <p className="dashboard-notif-title">
                      {notification.title}
                    </p>
                    <div className="dashboard-notif-meta">
                      <span>{timeAgo(notification.created_at)}</span>
                      {!notification.is_read && (
                        <span
                          className="dashboard-notif-dot"
                          aria-label="Unread"
                        />
                      )}
                    </div>
                  </div>
                  {notification.body && (
                    <p className="dashboard-notif-text">{notification.body}</p>
                  )}
                  {notification.actor?.display_name && (
                    <p className="dashboard-notif-actor">
                      <em>by {notification.actor.display_name}</em>
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
