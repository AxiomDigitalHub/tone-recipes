import { describe, it, expect } from "vitest";
import {
  isAtLeast,
  getToneRequestLimit,
  getDownloadLimit,
  setPackAccess,
  FREE_DOWNLOAD_LIMIT,
} from "@/lib/permissions";

describe("role ordering (isAtLeast)", () => {
  it("free < pass < pro < admin", () => {
    expect(isAtLeast("pass", "free")).toBe(true);
    expect(isAtLeast("free", "pass")).toBe(false);
    expect(isAtLeast("pro", "pass")).toBe(true);
    expect(isAtLeast("admin", "pro")).toBe(true);
  });

  it("legacy premium/creator sit above pass, below pro", () => {
    expect(isAtLeast("premium", "pass")).toBe(true);
    expect(isAtLeast("premium", "pro")).toBe(false);
    expect(isAtLeast("creator", "pro")).toBe(false);
  });
});

describe("tone request limits", () => {
  // These MUST stay in sync with the DB trigger in migration 024 —
  // enforce_tone_request_quota() hardcodes the same numbers.
  it("matches the migration-024 trigger values", () => {
    expect(getToneRequestLimit("free")).toBe(2);
    expect(getToneRequestLimit("pass")).toBe(10);
    expect(getToneRequestLimit("pro")).toBe(20);
    expect(getToneRequestLimit("premium")).toBe(10);
    expect(getToneRequestLimit("creator")).toBe(10);
    expect(getToneRequestLimit("admin")).toBe(Infinity);
  });

  it("unknown roles fall back to the free limit", () => {
    // @ts-expect-error deliberately passing a junk role
    expect(getToneRequestLimit("banana")).toBe(2);
  });
});

describe("download limits", () => {
  it("free is metered, everyone else unlimited", () => {
    expect(getDownloadLimit("free")).toBe(FREE_DOWNLOAD_LIMIT);
    expect(getDownloadLimit("pass")).toBe(Infinity);
    expect(getDownloadLimit("pro")).toBe(Infinity);
  });
});

describe("set pack bundling", () => {
  it("only pro and staff get packs bundled", () => {
    expect(setPackAccess("pro")).toBe(true);
    expect(setPackAccess("admin")).toBe(true);
    expect(setPackAccess("super_admin")).toBe(true);
    expect(setPackAccess("pass")).toBe(false);
    expect(setPackAccess("free")).toBe(false);
    expect(setPackAccess("premium")).toBe(false);
  });
});
