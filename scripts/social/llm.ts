/**
 * OPTIONAL SDK path (`--llm sdk`). v1 default is `--llm agent`: the scheduled
 * Claude session writes copy.json in-session. Use this once ANTHROPIC_API_KEY
 * exists in .env.local. Not exercised in v1 verification (no key, no paid calls).
 */
import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { SOCIAL_DIR } from "./paths";
import type { Copy, Critic, FactSheet } from "./types";

export const COPY_MODEL = "claude-sonnet-5-5";
export const CRITIC_MODEL = "claude-haiku-5-5";

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set — use --llm agent");
  // The Claude Code shell exports ANTHROPIC_BASE_URL; pin the public API explicitly.
  return new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" });
}

const COPY_SCHEMA = {
  type: "object",
  required: ["schema", "slotId", "hook_style", "slide1_headline", "slide1_fact_ids", "caption_line1", "caption_body", "cited_facts"],
  properties: {
    schema: { const: "fk.copy.v1" },
    slotId: { type: "string" },
    hook_style: { enum: ["H1", "H2"] },
    slide1_headline: { type: "string" },
    slide1_fact_ids: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 },
    caption_line1: { type: "string" },
    caption_body: { type: "string" },
    block_notes: { type: "array", items: { type: "object", required: ["blockId", "line"], properties: { blockId: { type: "string" }, line: { type: "string" } } } },
    cited_facts: { type: "array", items: { type: "object", required: ["fact_id", "text"], properties: { fact_id: { type: "string" }, text: { type: "string" } } } },
  },
} as const;

const CRITIC_SCHEMA = {
  type: "object",
  required: ["schema", "slotId", "independent", "C1_stranger", "C2_question", "C3_specific", "C4_hook_style_match", "C5_honest", "reasons"],
  properties: {
    schema: { const: "fk.critic.v1" },
    slotId: { type: "string" },
    independent: { type: "boolean" },
    C1_stranger: { enum: [0, 1] },
    C2_question: { enum: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "none"] },
    C3_specific: { enum: [0, 1] },
    C4_hook_style_match: { enum: [0, 1] },
    C5_honest: { enum: [0, 1] },
    reasons: { type: "array", items: { type: "string" } },
  },
} as const;

function prompt(name: string, vars: Record<string, string>): string {
  let t = fs.readFileSync(path.join(SOCIAL_DIR, "prompts", name), "utf-8");
  for (const [k, v] of Object.entries(vars)) t = t.replaceAll(`{{${k}}}`, v);
  return t;
}

async function forcedTool<T>(model: string, system: string, user: string, name: string, schema: object): Promise<T> {
  const res = await client().messages.create({
    model,
    max_tokens: 1500,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    tools: [{ name, description: `Return the ${name} JSON`, input_schema: schema as Anthropic.Tool.InputSchema }],
    tool_choice: { type: "tool", name },
    messages: [{ role: "user", content: user }],
  });
  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error(`${model} returned no tool_use`);
  return block.input as T;
}

export async function writeCopy(fsx: FactSheet, feedback: string[] = []): Promise<Copy> {
  const system = prompt("copy.md", { factsheetPath: "(inline below)", copyPath: "(return via the write_copy tool)", slotId: fsx.slotId, format: fsx.format, hookStyle: fsx.hookStyle });
  const user = `FACT SHEET:\n${JSON.stringify(fsx)}${feedback.length ? `\n\nYOUR PREVIOUS DRAFT WAS REJECTED:\n- ${feedback.join("\n- ")}` : ""}`;
  return forcedTool<Copy>(COPY_MODEL, system, user, "write_copy", COPY_SCHEMA);
}

export async function critique(fsx: FactSheet, copy: Copy): Promise<Critic> {
  const system = prompt("critic.md", { criticPath: "(return via the write_critic tool)", slotId: fsx.slotId, hookStyle: fsx.hookStyle, factsheetPath: "(inline)", copyPath: "(inline)" });
  const c = await forcedTool<Critic>(CRITIC_MODEL, system, `FACT SHEET:\n${JSON.stringify(fsx)}\n\nCOPY:\n${JSON.stringify(copy)}`, "write_critic", CRITIC_SCHEMA);
  return { ...c, independent: true }; // separate model call, fresh context
}
