"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getUnreadCount } from "@/lib/db/notifications";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const POLL_INTERVAL_MS = 30_000;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const prevCountRef = useRef(0);

  const fetchCount = useCallback(async () => {
    if (!user) {
      setCount(0);
      return;
    }

    try {
      const unread = await getUnreadCount(user.id);
      setCount(unread);

      // Trigger pulse animation if count increased
      if (unread > prevCountRef.current && prevCountRef.current >= 0) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 1000);
      }
      prevCountRef.current = unread;
    } catch {
      // Silently fail — don't break the header
    }
  }, [user]);

  // Fetch on mount and poll
  useEffect(() => {
    fetchCount();

    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchCount]);

  const handleClick = () => {
    router.push("/dashboard/notifications");
  };

  if (!user) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative inline-flex items-center justify-center rounded-lg p-2 text-muted transition-colors hover:text-foreground hover:bg-surface-hover"
      aria-label={
        count > 0
          ? `${count} unread notification${count !== 1 ? "s" : ""}`
          : "Notifications"
      }
    >
      <Bell className="h-5 w-5" />

      {count > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ${
            animate ? "animate-pulse" : ""
          }`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
