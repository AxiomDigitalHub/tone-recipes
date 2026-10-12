import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateDraft, findDraftForSunday, nextSundayLabel } from "../src/lib/newsletter-draft";

/**
 * The Sunday Setlist cron sent an auto-generated email for months while the
 * hand-researched drafts sat unread in content/newsletters/. Now the route
 * prefers a draft — so the rules deciding *which* draft, and whether it is
 * sendable at all, are load-bearing. Chiefly: a stale draft must never go out.
 */

function song(over: Record<string, unknown> = {}) {
  return {
    title: "Goodness of God",
    artist: "Bethel Music",
    tone: "82 BPM in Ab — dotted-eighth delay at 549 ms, snapshot 5.",
    links: [{ label: "Full recipe", url: "/recipe/hislop-goodness-of-god" }],
    ...over,
  };
}

function draft(over: Record<string, unknown> = {}) {
  return {
    subject: "Sunday Setlist — October 18: 6 songs, one AC30",
    sundayDate: "October 18",
    intro: "You got the setlist. Now you need the tones.",
    songs: [song(), song({ title: "Holy Forever" }), song({ title: "Way Maker" })],
    outro: "Hit reply with your setlist.",
    ...over,
  };
}

describe("validateDraft", () => {
  it("accepts a well-formed draft", () => {
    expect(validateDraft(draft())).toEqual([]);
  });

  it("rejects missing top-level fields", () => {
    expect(validateDraft(draft({ subject: "" }))).toContain("missing subject");
    expect(validateDraft(draft({ intro: "" }))).toContain("missing intro");
    expect(validateDraft(draft({ sundayDate: "" }))).toContain("missing sundayDate");
  });

  it("requires at least 3 songs", () => {
    expect(validateDraft(draft({ songs: [song(), song()] }))).toContain("needs at least 3 songs");
  });

  it("requires every song to link back to the site", () => {
    const errors = validateDraft(draft({ songs: [song({ links: [] }), song(), song()] }));
    expect(errors.join(" ")).toMatch(/has no site links/);
  });

  it("rejects absolute URLs — links must be site-relative", () => {
    const bad = song({ links: [{ label: "x", url: "https://faderandknob.com/recipe/x" }] });
    const errors = validateDraft(draft({ songs: [bad, song(), song()] }));
    expect(errors.join(" ")).toMatch(/must be a site-relative URL/);
  });

  // "Coordinates, not vibes" — a tone note with no number has no delay time,
  // no BPM and no snapshot the reader can act on.
  it("rejects a tone note with no number in it", () => {
    const vague = song({ tone: "Big ambient wash, lots of feel, let it breathe." });
    const errors = validateDraft(draft({ songs: [vague, song(), song()] }));
    expect(errors.join(" ")).toMatch(/contains no number/);
  });

  it("rejects non-objects", () => {
    expect(validateDraft(null)).toEqual(["draft is not an object"]);
    expect(validateDraft("nope")).toEqual(["draft is not an object"]);
  });
});

describe("nextSundayLabel", () => {
  it("returns the upcoming Sunday from a weekday", () => {
    // Tuesday 2026-10-13 → Sunday 2026-10-18
    expect(nextSundayLabel(new Date("2026-10-13T12:00:00Z"))).toBe("October 18");
  });

  it("returns the FOLLOWING Sunday when called on a Sunday", () => {
    expect(nextSundayLabel(new Date("2026-10-11T12:00:00Z"))).toBe("October 18");
  });
});

describe("findDraftForSunday", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "fk-drafts-"));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const write = (name: string, body: unknown) =>
    fs.writeFileSync(path.join(dir, name), JSON.stringify(body));

  const tuesday = new Date("2026-10-13T14:00:00Z");

  it("finds the draft whose sundayDate matches", () => {
    write("sunday-setlist-2026-10-13.json", draft());
    const got = findDraftForSunday("October 18", tuesday, dir);
    expect(got.draft?.file).toBe("sunday-setlist-2026-10-13.json");
    expect(got.draft?.draft.subject).toMatch(/October 18/);
  });

  // The whole point of matching on sundayDate: last week's email must not
  // go out again as if it were this week's.
  it("does NOT return a stale draft for a previous Sunday", () => {
    write("sunday-setlist-2026-10-06.json", draft({ sundayDate: "October 11" }));
    const got = findDraftForSunday("October 18", tuesday, dir);
    expect(got.draft).toBeUndefined();
    expect(got.reason).toMatch(/October 11/);
  });

  it("ignores a draft authored outside the freshness window", () => {
    // Same month/day label a year earlier — would match on string alone.
    write("sunday-setlist-2025-10-14.json", draft());
    expect(findDraftForSunday("October 18", tuesday, dir).draft).toBeUndefined();
  });

  it("skips an invalid draft rather than sending it", () => {
    write("sunday-setlist-2026-10-13.json", draft({ songs: [song()] }));
    const got = findDraftForSunday("October 18", tuesday, dir);
    expect(got.draft).toBeUndefined();
    expect(got.reason).toMatch(/at least 3 songs/);
  });

  it("skips unparseable JSON rather than throwing", () => {
    fs.writeFileSync(path.join(dir, "sunday-setlist-2026-10-13.json"), "{ not json");
    const got = findDraftForSunday("October 18", tuesday, dir);
    expect(got.draft).toBeUndefined();
    expect(got.reason).toMatch(/unparseable/);
  });

  it("prefers the newest draft when two target the same Sunday", () => {
    write("sunday-setlist-2026-10-12.json", draft({ subject: "older" }));
    write("sunday-setlist-2026-10-13.json", draft({ subject: "newer" }));
    expect(findDraftForSunday("October 18", tuesday, dir).draft?.draft.subject).toBe("newer");
  });

  it("reports a reason when the directory is absent", () => {
    const got = findDraftForSunday("October 18", tuesday, path.join(dir, "nope"));
    expect(got.draft).toBeUndefined();
    expect(got.reason).toMatch(/no newsletters directory/);
  });

  it("ignores files that aren't named like drafts", () => {
    write("notes.json", draft());
    expect(findDraftForSunday("October 18", tuesday, dir).draft).toBeUndefined();
  });
});
