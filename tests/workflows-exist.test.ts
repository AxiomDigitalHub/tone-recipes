import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Every GitHub Actions workflow referenced from source code or docs must
 * actually exist in .github/workflows/.
 *
 * This test exists because the email-sequence cron shipped as a complete,
 * correct workflow file... in docs/ — so the queue it was supposed to drain
 * silently accumulated for weeks while a code comment claimed the cron was
 * live. A grep would have caught it; now this does.
 */

const ROOT = path.resolve(__dirname, "..");
const WORKFLOWS_DIR = path.join(ROOT, ".github", "workflows");

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx|md|mjs|yml|yaml)$/.test(entry.name)) yield full;
  }
}

describe("referenced workflows exist", () => {
  it("every .github/workflows/<file> mention resolves to a real file", () => {
    const referencePattern = /\.github\/workflows\/([\w.-]+\.ya?ml)/g;
    const missing: string[] = [];

    for (const dir of ["src", "docs", "scripts"]) {
      const abs = path.join(ROOT, dir);
      if (!fs.existsSync(abs)) continue;
      for (const file of walk(abs)) {
        const text = fs.readFileSync(file, "utf-8");
        for (const match of text.matchAll(referencePattern)) {
          const workflow = match[1];
          if (!fs.existsSync(path.join(WORKFLOWS_DIR, workflow))) {
            missing.push(`${path.relative(ROOT, file)} → ${workflow}`);
          }
        }
      }
    }

    expect(missing, `Referenced workflows not found:\n${missing.join("\n")}`).toEqual([]);
  });

  it("no complete workflow files are stranded outside .github/workflows", () => {
    // A file in docs/ that has BOTH an `on:` trigger and a `jobs:` block is
    // a runnable workflow that will never run.
    const stranded: string[] = [];
    const docsDir = path.join(ROOT, "docs");
    if (fs.existsSync(docsDir)) {
      for (const file of walk(docsDir)) {
        if (!/\.ya?ml$/.test(file)) continue;
        const text = fs.readFileSync(file, "utf-8");
        if (/^on:/m.test(text) && /^jobs:/m.test(text)) {
          stranded.push(path.relative(ROOT, file));
        }
      }
    }
    expect(stranded, `Runnable workflows stranded in docs/: ${stranded.join(", ")}`).toEqual([]);
  });
});
