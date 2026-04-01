import jsPDF from "jspdf";
import type {
  ToneRecipe,
  SignalChainNode,
  PlatformBlock,
  Platform,
} from "@/types/recipe";

// ---------------------------------------------------------------------------
// Platform display labels (mirrors src/lib/constants.ts PLATFORMS)
// ---------------------------------------------------------------------------
const PLATFORM_LABELS: Record<string, string> = {
  physical: "Physical",
  helix: "Helix",
  quad_cortex: "Quad Cortex",
  tonex: "TONEX",
  fractal: "Fractal",
  kemper: "Kemper",
  katana: "Boss Katana",
};

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------
const AMBER = "#f59e0b";
const DARK_TEXT = "#1a1a1a";
const MEDIUM_TEXT = "#4b5563";
const LIGHT_TEXT = "#6b7280";
const BORDER_COLOR = "#e5e7eb";
const LIGHT_BG = "#f9fafb";
const WHITE = "#ffffff";

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
const PAGE_W = 210; // A4-ish US Letter width in mm (jsPDF default)
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_HEIGHT = 5;
const SECTION_GAP = 10;

// ---------------------------------------------------------------------------
// Helper: hex -> RGB tuple
// ---------------------------------------------------------------------------
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

// ---------------------------------------------------------------------------
// PDF Builder class — wraps jsPDF with auto-pagination helpers
// ---------------------------------------------------------------------------
class RecipePDFBuilder {
  private doc: jsPDF;
  private y: number = MARGIN;

  constructor() {
    this.doc = new jsPDF({ unit: "mm", format: "letter" });
    this.y = MARGIN;
  }

  // --- pagination --------------------------------------------------------

  /** Ensure at least `needed` mm of space remain; add a page if not. */
  private ensureSpace(needed: number) {
    if (this.y + needed > PAGE_H - MARGIN) {
      this.doc.addPage();
      this.y = MARGIN;
    }
  }

  // --- primitive drawing helpers -----------------------------------------

  private setFont(
    style: "normal" | "bold" | "italic" = "normal",
    size: number = 10,
    color: string = DARK_TEXT,
  ) {
    this.doc.setFont("helvetica", style);
    this.doc.setFontSize(size);
    const [r, g, b] = hexToRgb(color);
    this.doc.setTextColor(r, g, b);
  }

  /** Draw text with automatic wrapping. Returns the height consumed. */
  private drawWrappedText(
    text: string,
    x: number,
    maxWidth: number,
    fontSize: number = 10,
    style: "normal" | "bold" | "italic" = "normal",
    color: string = DARK_TEXT,
  ): number {
    this.setFont(style, fontSize, color);
    const lines = this.doc.splitTextToSize(text, maxWidth) as string[];
    const lineH = fontSize * 0.4; // approximate mm per line
    const totalH = lines.length * lineH;

    this.ensureSpace(totalH);
    this.doc.text(lines, x, this.y);
    this.y += totalH;
    return totalH;
  }

  /** Draw a horizontal rule. */
  private drawHR(color: string = BORDER_COLOR) {
    const [r, g, b] = hexToRgb(color);
    this.doc.setDrawColor(r, g, b);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN, this.y, MARGIN + CONTENT_W, this.y);
    this.y += 2;
  }

  /** Draw a filled rectangle. */
  private drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    fillColor: string,
  ) {
    const [r, g, b] = hexToRgb(fillColor);
    this.doc.setFillColor(r, g, b);
    this.doc.rect(x, y, w, h, "F");
  }

  /** Section heading with amber accent bar. */
  private drawSectionHeading(title: string) {
    this.ensureSpace(14);
    this.y += SECTION_GAP;

    // Accent bar
    this.drawRect(MARGIN, this.y, 3, 6, AMBER);

    // Heading text
    this.setFont("bold", 12, DARK_TEXT);
    this.doc.text(title.toUpperCase(), MARGIN + 6, this.y + 4.5);
    this.y += 10;
  }

  // --- table helpers -----------------------------------------------------

  /**
   * Draw a simple key-value table (2 columns).
   * rows: [label, value][]
   */
  private drawKeyValueTable(rows: [string, string][]) {
    const labelW = 40;
    const valueW = CONTENT_W - labelW;
    const rowH = 6;

    for (let i = 0; i < rows.length; i++) {
      const [label, value] = rows[i];
      if (!value) continue;

      this.ensureSpace(rowH + 2);

      // Alternating row background
      if (i % 2 === 0) {
        this.drawRect(MARGIN, this.y - 1, CONTENT_W, rowH, LIGHT_BG);
      }

      this.setFont("bold", 9, MEDIUM_TEXT);
      this.doc.text(label, MARGIN + 2, this.y + 3);

      this.setFont("normal", 9, DARK_TEXT);
      const wrappedValue = this.doc.splitTextToSize(value, valueW - 4) as string[];
      this.doc.text(wrappedValue, MARGIN + labelW + 2, this.y + 3);

      const lineCount = Math.max(wrappedValue.length, 1);
      this.y += Math.max(rowH, lineCount * 4);
    }
  }

  /**
   * Draw a multi-column table with header row.
   */
  private drawTable(
    headers: string[],
    colWidths: number[],
    rows: string[][],
  ) {
    const headerH = 7;
    const rowH = 6;

    // Header
    this.ensureSpace(headerH + rowH);
    this.drawRect(MARGIN, this.y, CONTENT_W, headerH, AMBER);
    this.setFont("bold", 8, WHITE);
    let xOff = MARGIN + 2;
    for (let c = 0; c < headers.length; c++) {
      this.doc.text(headers[c], xOff, this.y + 5);
      xOff += colWidths[c];
    }
    this.y += headerH;

    // Rows
    for (let r = 0; r < rows.length; r++) {
      // Estimate row height from wrapped text
      let maxLines = 1;
      const wrappedCells: string[][] = [];
      for (let c = 0; c < rows[r].length; c++) {
        this.setFont("normal", 8);
        const wrapped = this.doc.splitTextToSize(
          rows[r][c] || "",
          colWidths[c] - 4,
        ) as string[];
        wrappedCells.push(wrapped);
        maxLines = Math.max(maxLines, wrapped.length);
      }
      const cellH = Math.max(rowH, maxLines * 3.5);

      this.ensureSpace(cellH + 1);

      if (r % 2 === 0) {
        this.drawRect(MARGIN, this.y, CONTENT_W, cellH, LIGHT_BG);
      }

      xOff = MARGIN + 2;
      for (let c = 0; c < wrappedCells.length; c++) {
        this.setFont("normal", 8, DARK_TEXT);
        this.doc.text(wrappedCells[c], xOff, this.y + 3.5);
        xOff += colWidths[c];
      }
      this.y += cellH;
    }
  }

  // ======================================================================
  // PUBLIC: Build sections
  // ======================================================================

  /** 1. Header bar */
  drawHeader() {
    // Amber top bar
    this.drawRect(0, 0, PAGE_W, 2, AMBER);

    // Brand area
    this.drawRect(0, 2, PAGE_W, 14, "#fefce8"); // light yellow tint
    this.setFont("bold", 14, DARK_TEXT);
    this.doc.text("FADER & KNOB", MARGIN, 12);
    this.setFont("normal", 8, LIGHT_TEXT);
    this.doc.text("faderandknob.com", PAGE_W - MARGIN, 12, { align: "right" });

    // Bottom border
    this.drawRect(0, 16, PAGE_W, 0.5, AMBER);

    this.y = 22;
  }

  /** 2. Title section */
  drawTitle(
    recipeTitle: string,
    artistName: string,
    songTitle: string,
    genres: string[],
  ) {
    this.setFont("bold", 18, DARK_TEXT);
    const titleLines = this.doc.splitTextToSize(recipeTitle, CONTENT_W) as string[];
    this.doc.text(titleLines, MARGIN, this.y);
    this.y += titleLines.length * 7 + 2;

    // Artist — Song
    this.setFont("normal", 11, MEDIUM_TEXT);
    this.doc.text(`${artistName}  —  "${songTitle}"`, MARGIN, this.y);
    this.y += 6;

    // Genre badges
    if (genres.length > 0) {
      this.setFont("normal", 7, AMBER);
      let badgeX = MARGIN;
      for (const genre of genres) {
        const label = genre.replace(/-/g, " ").toUpperCase();
        const tw = this.doc.getTextWidth(label) + 6;
        if (badgeX + tw > MARGIN + CONTENT_W) {
          this.y += 6;
          badgeX = MARGIN;
        }
        // Badge background
        this.drawRect(badgeX, this.y - 3, tw, 5, "#fef3c7");
        this.setFont("bold", 7, "#92400e");
        this.doc.text(label, badgeX + 3, this.y);
        badgeX += tw + 2;
      }
      this.y += 5;
    }

    this.y += 2;
    this.drawHR(AMBER);
  }

  /** 3. Description */
  drawDescription(description: string) {
    if (!description) return;
    this.ensureSpace(12);
    this.drawWrappedText(description, MARGIN, CONTENT_W, 10, "italic", MEDIUM_TEXT);
    this.y += 4;
  }

  /** 4. Guitar Specs */
  drawGuitarSpecs(specs: ToneRecipe["guitar_specs"]) {
    this.drawSectionHeading("Guitar Specs");

    const rows: [string, string][] = [
      ["Model", specs.model_name],
      ["Body Type", specs.body_type?.replace(/_/g, " ")],
      ["Pickups", `${specs.pickup_config} — ${specs.pickup_position}`],
      ["Scale Length", specs.scale_length],
      [
        "Tuning",
        specs.tuning_custom
          ? `${specs.tuning} (${specs.tuning_custom})`
          : specs.tuning,
      ],
      ["String Gauge", specs.string_gauge],
      ["Strings", specs.string_count ? String(specs.string_count) : ""],
      ["Notable Mods", specs.notable_mods || ""],
    ];

    this.drawKeyValueTable(rows.filter(([, v]) => !!v));
  }

  /** 5. Signal Chain */
  drawSignalChain(chain: SignalChainNode[]) {
    if (!chain || chain.length === 0) return;
    this.drawSectionHeading("Signal Chain");

    for (const node of chain) {
      // Each node needs at least ~14mm
      this.ensureSpace(16);

      // Position badge
      this.drawRect(MARGIN, this.y, 8, 6, AMBER);
      this.setFont("bold", 9, WHITE);
      this.doc.text(String(node.position), MARGIN + 2.5, this.y + 4.3);

      // Gear name + category
      this.setFont("bold", 10, DARK_TEXT);
      this.doc.text(node.gear_name, MARGIN + 11, this.y + 4);

      const categoryLabel =
        node.category.replace(/_/g, " ") +
        (node.subcategory ? ` / ${node.subcategory}` : "");
      this.setFont("normal", 8, LIGHT_TEXT);
      this.doc.text(categoryLabel, MARGIN + 11 + this.doc.getTextWidth(node.gear_name) + 3, this.y + 4);

      this.y += 8;

      // Settings
      const settingEntries = Object.entries(node.settings || {});
      if (settingEntries.length > 0) {
        this.ensureSpace(5);
        const settingsStr = settingEntries
          .map(([k, v]) => `${k}: ${v}`)
          .join("  |  ");
        this.setFont("normal", 8, MEDIUM_TEXT);
        const wrapped = this.doc.splitTextToSize(settingsStr, CONTENT_W - 11) as string[];
        this.doc.text(wrapped, MARGIN + 11, this.y);
        this.y += wrapped.length * 3.5;
      }

      // Notes
      if (node.notes) {
        this.ensureSpace(5);
        this.setFont("italic", 8, LIGHT_TEXT);
        const noteLines = this.doc.splitTextToSize(node.notes, CONTENT_W - 11) as string[];
        this.doc.text(noteLines, MARGIN + 11, this.y);
        this.y += noteLines.length * 3.5;
      }

      this.y += 3;
    }
  }

  /** 6. Original Gear */
  drawOriginalGear(gear: ToneRecipe["original_gear"]) {
    this.drawSectionHeading("Original Gear");

    const rows: [string, string][] = [
      ["Guitar", gear.guitar],
      ["Amp", gear.amp],
      ["Effects", gear.effects?.join(", ") || ""],
      ["Cabinet", gear.cabinet],
      ["Microphone", gear.microphone],
      ["Other Notes", gear.other_notes || ""],
    ];

    this.drawKeyValueTable(rows.filter(([, v]) => !!v));
  }

  /** 7. Platform Translations */
  drawPlatformTranslations(
    translations: ToneRecipe["platform_translations"],
  ) {
    const platforms = Object.entries(translations || {}).filter(
      ([, t]) => t && t.chain_blocks && t.chain_blocks.length > 0,
    ) as [Platform, { chain_blocks: PlatformBlock[]; notes: string }][];

    if (platforms.length === 0) return;

    for (const [platformKey, translation] of platforms) {
      const label = PLATFORM_LABELS[platformKey] || platformKey;
      this.drawSectionHeading(`${label} Translation`);

      // Platform-level notes
      if (translation.notes) {
        this.ensureSpace(6);
        this.setFont("italic", 8, LIGHT_TEXT);
        const noteLines = this.doc.splitTextToSize(translation.notes, CONTENT_W) as string[];
        this.doc.text(noteLines, MARGIN, this.y);
        this.y += noteLines.length * 3.5 + 2;
      }

      // Table: #, Block Name, Category, Original, Settings
      const headers = ["#", "Block Name", "Category", "Original Gear", "Settings"];
      const colWidths = [8, 35, 25, 35, CONTENT_W - 103];

      const rows: string[][] = translation.chain_blocks.map((block) => {
        const settingsStr = Object.entries(block.settings || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        return [
          String(block.position),
          block.block_name,
          block.block_category?.replace(/_/g, " ") || "",
          block.original_gear || "",
          settingsStr,
        ];
      });

      this.drawTable(headers, colWidths, rows);

      // Block-level notes
      for (const block of translation.chain_blocks) {
        if (block.notes) {
          this.ensureSpace(5);
          this.setFont("italic", 7, LIGHT_TEXT);
          const noteText = `${block.block_name}: ${block.notes}`;
          const lines = this.doc.splitTextToSize(noteText, CONTENT_W - 4) as string[];
          this.doc.text(lines, MARGIN + 2, this.y);
          this.y += lines.length * 3 + 1;
        }
      }
    }
  }

  /** 8. Footer */
  drawFooter(slug: string) {
    const totalPages = this.doc.getNumberOfPages();
    const today = new Date().toISOString().split("T")[0];

    for (let p = 1; p <= totalPages; p++) {
      this.doc.setPage(p);

      // Bottom border
      this.drawRect(0, PAGE_H - 12, PAGE_W, 0.5, BORDER_COLOR);

      // URL
      this.setFont("normal", 7, LIGHT_TEXT);
      this.doc.text(
        `Generated from faderandknob.com/recipe/${slug}`,
        MARGIN,
        PAGE_H - 6,
      );

      // Date + page number
      this.doc.text(
        `${today}  |  Page ${p} of ${totalPages}`,
        PAGE_W - MARGIN,
        PAGE_H - 6,
        { align: "right" },
      );
    }
  }

  /** Return final PDF as Buffer. */
  toBuffer(): Buffer {
    const arrayBuf = this.doc.output("arraybuffer");
    return Buffer.from(arrayBuf);
  }
}

// =========================================================================
// Public API
// =========================================================================

export function generateRecipePDF(params: {
  recipe: ToneRecipe;
  songTitle: string;
  artistName: string;
  artistGenres: string[];
}): Buffer {
  const { recipe, songTitle, artistName, artistGenres } = params;

  const builder = new RecipePDFBuilder();

  builder.drawHeader();
  builder.drawTitle(recipe.title, artistName, songTitle, artistGenres);
  builder.drawDescription(recipe.description);
  builder.drawGuitarSpecs(recipe.guitar_specs);
  builder.drawSignalChain(recipe.signal_chain);
  builder.drawOriginalGear(recipe.original_gear);
  builder.drawPlatformTranslations(recipe.platform_translations);
  builder.drawFooter(recipe.slug);

  return builder.toBuffer();
}
