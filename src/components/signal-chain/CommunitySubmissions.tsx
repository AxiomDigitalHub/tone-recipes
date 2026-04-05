"use client";

import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, ThumbsDown, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getSubmissions,
  createSubmission,
  voteOnSubmission,
  type CommunitySubmission,
} from "@/lib/db/submissions";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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
/*  Setting row for the submission form                                        */
/* -------------------------------------------------------------------------- */

interface SettingRow {
  block_name: string;
  param: string;
  value: string;
}

function SettingRowInput({
  row,
  onChange,
  onRemove,
}: {
  row: SettingRow;
  onChange: (updated: SettingRow) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Block name"
        value={row.block_name}
        onChange={(e) => onChange({ ...row, block_name: e.target.value })}
        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <input
        type="text"
        placeholder="Param"
        value={row.param}
        onChange={(e) => onChange({ ...row, param: e.target.value })}
        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <input
        type="text"
        placeholder="Value"
        value={row.value}
        onChange={(e) => onChange({ ...row, value: e.target.value })}
        className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove setting row"
        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Submission card                                                            */
/* -------------------------------------------------------------------------- */

function SubmissionCard({
  submission,
  onVote,
}: {
  submission: CommunitySubmission;
  onVote: (id: string, type: "up" | "down") => void;
}) {
  const net = submission.upvotes - submission.downvotes;

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {submission.user_display_name}
          </span>
          <span className="text-xs text-muted">
            {timeAgo(submission.created_at)}
          </span>
        </div>
        <span
          className={`text-xs font-mono font-bold ${
            net > 0 ? "text-green-400" : net < 0 ? "text-red-400" : "text-muted"
          }`}
        >
          {net > 0 ? "+" : ""}
          {net}
        </span>
      </div>

      {/* Settings badges */}
      {submission.settings.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {submission.settings.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-xs"
            >
              <span className="text-muted">
                {s.block_name}/{s.param}
              </span>
              <span className="font-mono font-bold text-foreground">
                {s.value}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {submission.notes && (
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {submission.notes}
        </p>
      )}

      {/* Vote buttons */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => onVote(submission.id, "up")}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:bg-surface hover:text-green-400"
          aria-label="Upvote"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{submission.upvotes}</span>
        </button>
        <button
          onClick={() => onVote(submission.id, "down")}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:bg-surface hover:text-red-400"
          aria-label="Downvote"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          <span>{submission.downvotes}</span>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Skeleton loader                                                            */
/* -------------------------------------------------------------------------- */

function SkeletonLoader() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-border bg-background p-4"
        >
          <div className="h-4 w-32 rounded bg-surface" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-20 rounded bg-surface" />
            <div className="h-6 w-24 rounded bg-surface" />
          </div>
          <div className="mt-2 h-3 w-48 rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

interface CommunitySubmissionsProps {
  recipeSlug: string;
  platform: string;
}

export default function CommunitySubmissions({
  recipeSlug,
  platform,
}: CommunitySubmissionsProps) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [settingRows, setSettingRows] = useState<SettingRow[]>([
    { block_name: "", param: "", value: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sync display name when user changes
  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
  }, [user?.displayName]);

  /* ---- Fetch submissions -------------------------------------------------- */

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const data = await getSubmissions(recipeSlug, platform);
    setSubmissions(data);
    setLoading(false);
  }, [recipeSlug, platform]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  /* ---- Vote handler ------------------------------------------------------- */

  async function handleVote(submissionId: string, voteType: "up" | "down") {
    if (!user) return;

    // Optimistic update
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== submissionId) return s;
        return {
          ...s,
          upvotes: voteType === "up" ? s.upvotes + 1 : s.upvotes,
          downvotes: voteType === "down" ? s.downvotes + 1 : s.downvotes,
        };
      }),
    );

    await voteOnSubmission(submissionId, user.email, voteType);
  }

  /* ---- Submit handler ----------------------------------------------------- */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const validSettings = settingRows.filter(
      (r) => r.block_name.trim() && r.param.trim() && r.value.trim(),
    );
    if (validSettings.length === 0) return;

    setSubmitting(true);
    const result = await createSubmission({
      recipe_slug: recipeSlug,
      platform,
      user_email: user.email,
      user_display_name: displayName || user.email.split("@")[0],
      settings: validSettings,
      notes: notes.trim(),
    });

    if (result) {
      setSettingRows([{ block_name: "", param: "", value: "" }]);
      setNotes("");
      setShowForm(false);
      await fetchSubmissions();
    }
    setSubmitting(false);
  }

  /* ---- Setting row helpers ------------------------------------------------ */

  function addSettingRow() {
    setSettingRows((prev) => [...prev, { block_name: "", param: "", value: "" }]);
  }

  function removeSettingRow(index: number) {
    setSettingRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  function updateSettingRow(index: number, updated: SettingRow) {
    setSettingRows((prev) => prev.map((r, i) => (i === index ? updated : r)));
  }

  /* ---- Render ------------------------------------------------------------- */

  return (
    <div className="border-t border-border">
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface-hover md:px-6"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            Community Settings
          </span>
          <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
            !loading && submissions.length > 0
              ? "bg-accent/15 text-accent"
              : "bg-muted/20 text-muted"
          }`}>
            {loading ? "-" : submissions.length}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted" />
        )}
      </button>

      {/* Collapsible body */}
      {isOpen && (
        <div className="space-y-4 px-4 pb-4 md:px-6 md:pb-6">
          {/* Submissions list */}
          {loading ? (
            <SkeletonLoader />
          ) : submissions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No community submissions yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3">
              {submissions.map((s) => (
                <SubmissionCard key={s.id} submission={s} onVote={handleVote} />
              ))}
            </div>
          )}

          {/* Submit form or sign-in prompt */}
          {user ? (
            <>
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                >
                  Suggest Your Settings
                </button>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 rounded-xl border border-border bg-background p-4"
                >
                  {/* Display name */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>

                  {/* Settings rows */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-medium text-muted">
                        Settings
                      </label>
                      <button
                        type="button"
                        onClick={addSettingRow}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-accent transition-colors hover:bg-surface"
                        aria-label="Add setting row"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {settingRows.map((row, i) => (
                        <SettingRowInput
                          key={i}
                          row={row}
                          onChange={(updated) => updateSettingRow(i, updated)}
                          onRemove={() => removeSettingRow(i)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Describe why you chose these settings..."
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <p className="py-2 text-center text-sm text-muted">
              <a href="/login" className="text-accent hover:underline">
                Sign in
              </a>{" "}
              to suggest settings
            </p>
          )}
        </div>
      )}
    </div>
  );
}
