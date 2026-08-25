import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Unit tests only — pure logic with no network, no Supabase, no Next
 * runtime. The suite exists to make the audited bug classes (quota
 * fail-open, secret comparison, workflow-in-docs) impossible to reintroduce
 * silently; it runs in CI before the Docker build (build-image.yml).
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    env: {
      // unsubscribe-token reads this at module load.
      NEWSLETTER_UNSUBSCRIBE_SECRET: "test-secret-do-not-use-in-prod",
    },
  },
});
