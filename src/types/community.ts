// Comments
export interface Comment {
  id: string;
  recipe_slug: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  upvotes: number;
  downvotes: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
  user_vote?: "up" | "down" | null;
}

// Ratings
export interface RecipeRating {
  id: string;
  recipe_slug: string;
  user_id: string;
  rating: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface RatingStats {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

// Follows
export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// User Recipes
export type UserRecipeStatus = "pending" | "approved" | "rejected" | "flagged";

export interface UserRecipe {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  guitar_specs: Record<string, unknown> | null;
  signal_chain: Record<string, unknown>;
  platform_translations: Record<string, unknown> | null;
  tags: string[];
  status: UserRecipeStatus;
  moderator_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  author?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
}

// Forum
export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  icon: string | null;
  created_at: string;
  // Aggregated
  thread_count?: number;
  latest_thread?: { title: string; slug: string; created_at: string } | null;
}

export interface ForumThread {
  id: string;
  category_id: string;
  user_id: string;
  title: string;
  slug: string;
  body: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  last_reply_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  author?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
  category?: { name: string; slug: string };
}

export interface ForumReply {
  id: string;
  thread_id: string;
  user_id: string;
  body: string;
  is_accepted: boolean;
  upvotes: number;
  created_at: string;
  updated_at: string;
  // Joined
  author?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
}

// Notifications
export type NotificationType =
  | "comment_reply"
  | "recipe_approved"
  | "recipe_rejected"
  | "new_follower"
  | "forum_reply"
  | "recipe_comment"
  | "rating";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  actor_id: string | null;
  created_at: string;
  // Joined
  actor?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
}

// Reports
export type ReportContentType =
  | "comment"
  | "forum_thread"
  | "forum_reply"
  | "user_recipe"
  | "user";
export type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate"
  | "misinformation"
  | "other";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

export interface Report {
  id: string;
  reporter_id: string;
  content_type: ReportContentType;
  content_id: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

// Public user profile
export interface PublicProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  primary_platform: string | null;
  follower_count: number;
  following_count: number;
  recipe_count: number;
  created_at: string;
  is_following?: boolean; // whether current user follows this user
}
