"use client";

import { useState, useCallback } from "react";
import { UserPlus, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { toggleFollow } from "@/lib/db/follows";
import Link from "next/link";

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  onToggle?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  userId,
  initialFollowing = false,
  onToggle,
}: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = useCallback(async () => {
    if (!user || loading) return;
    const prev = isFollowing;
    // Optimistic update
    setIsFollowing(!prev);
    setLoading(true);

    try {
      const newState = await toggleFollow(user.id, userId);
      setIsFollowing(newState);
      onToggle?.(newState);
    } catch {
      // Rollback
      setIsFollowing(prev);
    } finally {
      setLoading(false);
    }
  }, [user, userId, isFollowing, loading, onToggle]);

  // Don't show follow button for own profile
  if (user?.id === userId) return null;

  // Not logged in
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--ink)]/15 px-4 py-2 text-sm font-medium text-[var(--ink-muted)] transition-colors hover:border-[var(--amber)]/40 hover:text-[var(--ink)]"
      >
        <UserPlus className="h-4 w-4" />
        Follow
      </Link>
    );
  }

  const showUnfollow = isFollowing && isHovered;

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
        isFollowing
          ? showUnfollow
            ? "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            : "border-[var(--amber)]/40 bg-[var(--amber)]/10 text-[var(--amber-2)]"
          : "border-[var(--ink)]/15 text-[var(--ink-muted)] hover:border-[var(--amber)]/40 hover:text-[var(--ink)]"
      }`}
      aria-label={isFollowing ? "Unfollow" : "Follow"}
    >
      {showUnfollow ? (
        <>
          <UserX className="h-4 w-4" />
          Unfollow
        </>
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </button>
  );
}
