/**
 * Social v2 shared types. Spec: docs/social-strategy/council/03-prompt-engineer-spec.md
 * (+ the must-fix items in 04-*-signoff.md).
 *
 * The one invariant every type here serves: numbers and names come from data
 * (the FactSheet), never from the LLM. The LLM fills `Copy`; the gate proves
 * every digit in it traces to a fact.
 */

export type Format = "knob_card" | "sunday_sound" | "worship_rig" | "fix_it" | "new_tone";
export type HookStyle = "H1" | "H2";
export type SocialPlatform = "instagram" | "pinterest";
export type Attribution = "documented" | "pool" | "tribute" | "unset";

export interface Config {
  /** IANA zone. scheduledFor is sent WITHOUT an offset plus this `timezone`, so Zernio handles DST. */
  timezone: string;
  profileReady: boolean;
  approvalMode: boolean;
  platforms: Record<SocialPlatform, boolean>;
  pinterestBoardId: string | null;
  postTime: string; // "HH:MM" local
  slots: Record<string, Format>; // mon..fri
  seasonal: { from: string; to: string; day: string; format: Format; filter: string }[];
  cooldownDays: { entity: number };
  hashtagPools: Record<Format, string[]>;
  fixItAllowlist: string[];
  unwrappedGear: string[];
}

export interface InventoryItem {
  sourceKind: "recipe" | "blog";
  slug: string;
  path: string; // site path, e.g. /recipe/hislop-goodness-of-god
  entityKey: string;
  formats: Format[];
  worship: boolean;
  attribution: Attribution;
  date: string; // newest of updated/created
  title: string;
  category: string;
  excluded?: string;
}

export interface SlotPlan {
  slotId: string;
  date: string; // YYYY-MM-DD (local)
  weekday: string; // mon..fri
  format: Format; // the format actually used
  requestedFormat: Format; // what the grid asked for (differs on fallback)
  fallbackReason?: string;
  item: InventoryItem | null;
  skipped?: string;
  hookStyle: HookStyle;
  scheduledFor: string; // local wall time "YYYY-MM-DDTHH:MM:00" (no offset; see Config.timezone)
}

export type FactKind = "setting" | "text" | "key" | "bpm" | "display";

export interface Fact {
  id: string;
  kind: FactKind;
  /** Rendered string. For settings: value + unit. For text: the text. */
  display: string;
  label?: string;
  blockId?: string;
  value?: string | number | boolean;
  /** Normalized numeric tokens this fact licenses (computed by code). */
  numbers: string[];
  sourcePath: string;
}

export interface FactBlock {
  blockId: string;
  name: string;
  category: string;
  enabled: boolean;
  factIds: string[];
  notes: string;
  /** new_tone: the real gear this Helix block stands in for (a text fact), as on the recipe page ("← JHS Superbolt"). */
  originalGearFactId?: string;
  /** new_tone: site chain-tile chrome — kind label ("Comp", "Cab·Mic"), Helix color bucket, inline icon SVG. */
  tile?: { kind: string; color?: string; iconSvg: string };
}

/** new_tone: the guitar profile card that sits above the chain on the recipe page. */
export interface FactGuitar {
  nameFactId: string;
  iconSvg: string;
  specs: { label: string; factId: string }[];
}

export interface FactTable {
  tableId: string;
  heading: string | null;
  header: string[];
  /** Each cell is a fact id (first column too, as a text/label fact). */
  rows: string[][];
  noteFactIds: string[]; // parentheticals stripped from cells
}

export interface FactSheet {
  schema: "fk.factsheet.v1";
  slotId: string;
  format: Format;
  hookStyle: HookStyle;
  source: { kind: "recipe" | "blog"; slug: string; url: string; path: string };
  entityKey: string;
  display: {
    title: string;
    song: string | null;
    band: string | null;
    album: string | null;
    year: number | null;
    platformLabel: string;
    otherPlatforms: string[];
  };
  attribution: { confidence: Attribution; line: string | null; bannedNames: string[] };
  facts: Fact[];
  blocks: FactBlock[];
  guitar?: FactGuitar;
  /** new_tone cover eyebrow ("2019 · Worship · 7 blocks"), each part a fact id. */
  eyebrowFactIds?: string[];
  tables: FactTable[];
  takeawayFactIds: string[];
  recentHooks: string[];
  recentLine1s: string[];
  hashtags: string[];
  cta: string;
  disclosure: string;
}

export interface Copy {
  schema: "fk.copy.v1";
  slotId: string;
  hook_style: HookStyle;
  slide1_headline: string;
  slide1_fact_ids: string[];
  caption_line1: string;
  caption_body: string;
  block_notes?: { blockId: string; line: string }[];
  cited_facts: { fact_id: string; text: string }[];
}

export interface Critic {
  schema: "fk.critic.v1";
  slotId: string;
  independent: boolean;
  C1_stranger: 0 | 1;
  C2_question: "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6" | "none";
  C3_specific: 0 | 1;
  C4_hook_style_match: 0 | 1;
  C5_honest: 0 | 1;
  reasons: string[];
}

export interface Check {
  id: string;
  pass: boolean;
  detail?: string;
}

export interface GateReport {
  schema: "fk.gate.v1";
  slotId: string;
  pass: boolean;
  forceApproval: boolean;
  blocking: Check[];
  advisory: Check[];
}

export interface TextItem {
  text: string;
  /** When set, `text` must contain this fact's display verbatim (D1b). */
  factId?: string;
  /** Slide chrome (page index etc.) — exempt from the number check. */
  structural?: boolean;
}

export interface KnobCell {
  label: string;
  value: string;
  factId: string;
  /** 0..1 position for the arc, only when the registry range is trustworthy. */
  pos?: number;
  off?: boolean;
}

export interface SlideGroup {
  title: TextItem;
  subtitle?: TextItem;
  /** new_tone block cards: site icon + category tag, as in "Every knob, broken out". */
  iconSvg?: string;
  tag?: TextItem;
  cells: KnobCell[];
  note?: TextItem;
  off?: boolean;
}

/** One tile of the signal-path row (new_tone), mirroring PreviewSchematicChain. */
export interface ChainNode {
  kind: TextItem;
  name: TextItem;
  gear?: TextItem;
  color?: string;
  iconSvg: string;
  off?: boolean;
}

export interface SlideSpec {
  kind: "cover" | "block" | "rule" | "table" | "close" | "pin" | "song" | "chain";
  index: number;
  total: number;
  layout?: "knobs" | "rows";
  kicker?: TextItem;
  title: TextItem;
  lines: TextItem[];
  groups?: SlideGroup[];
  table?: { header: TextItem[]; rows: { cells: TextItem[] }[]; notes: TextItem[] };
  /** new_tone song cover / signal-path slide. */
  eyebrow?: TextItem[];
  chain?: {
    meta: TextItem[];
    guitar?: { name: TextItem; iconSvg: string; specs: { label: TextItem; value: TextItem }[] };
    nodes: ChainNode[];
  };
  footer: TextItem[];
  altText: string;
}

export type LedgerState =
  | "planned"
  | "gated"
  | "gate_failed"
  | "rendered"
  | "publishing"
  | "scheduled"
  | "pending_approval"
  | "published"
  | "failed_permanent"
  | "unknown"
  | "skipped";

export interface LedgerRow {
  fkKey: string;
  slotId: string;
  date: string;
  platform: SocialPlatform;
  format: Format;
  entityKey: string;
  sourceSlug: string;
  hookStyle: HookStyle;
  hook?: string;
  captionLine1?: string;
  state: LedgerState;
  zernioPostId?: string;
  platformPostUrl?: string;
  detail?: string;
  at: string;
}

export interface MetricRow {
  pulledAt: string;
  zernioPostId: string;
  fkKey: string | null;
  platform: string;
  format: Format | null;
  hookStyle: HookStyle | null;
  publishedAt: string | null;
  syncStatus: string;
  reach: number;
  impressions: number;
  views: number;
  saves: number;
  shares: number;
  likes: number;
  comments: number;
  profileViews: number;
  follows: number | null;
}
