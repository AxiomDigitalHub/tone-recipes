"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Platform } from "@/types/recipe";
import type { PreviewBlockData } from "@/components/v3/preview-helpers";
import Gear from "@/components/gear/Gear";
import { DialCell } from "@/components/gear/Dial";
import { dialBreak, dialsFor, gearForChain, gearTypeLabel, type GearPick } from "@/lib/gear/recipe-gear";
import type { BuyInfo } from "@/lib/gear/retail";
import { useRig } from "@/lib/gear/use-rig";
import { track } from "@/lib/analytics";
import { useRecipePlatform } from "./RecipePlatform";

/**
 * The signal chain and the per-block cards (redesign step 3).
 *
 * Modeler platforms: every block drawn with its knobs at the recipe's
 * settings, then every setting broken out as a dial.
 * Pedalboard: the real gear names, buy rows, and a shopping list.
 *
 * The server renders the default platform into static HTML; switching
 * platform happens here with no round-trip.
 */

interface Item {
  block: PreviewBlockData;
  pick: GearPick;
  /** Position in the platform's block list (stable id for anchors). */
  i: number;
}

function basedOn(block: PreviewBlockData): string {
  const s = (block.sub || "").trim();
  if (s.startsWith("←")) return `Based on ${s.replace(/^←\s*/, "")}`;
  return s;
}

function BuyLink({
  buy,
  slug,
  children,
  className,
}: {
  buy: BuyInfo;
  slug: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={buy.url}
      target="_blank"
      // Handoff: every affiliate link gets rel="sponsored nofollow".
      rel="sponsored nofollow noopener"
      className={className}
      onClick={() =>
        track("affiliate_click", {
          retailer: (buy.retailer || "").toLowerCase(),
          placement: "recipe_pedalboard",
          gear_slug: buy.product,
          page_slug: slug,
        })
      }
    >
      {children}
      <ExternalLink size={16} strokeWidth={1.75} aria-hidden />
    </a>
  );
}

function Dials({ block }: { block: PreviewBlockData }) {
  const dials = dialsFor(block);
  if (dials.length === 0) return null;
  const brk = dialBreak(block, dials);
  const rows = brk ? [dials.slice(0, brk), dials.slice(brk)] : [dials];
  return (
    <div className="fk-blockcard-dials">
      {rows.map((row, r) => (
        <div key={r} className="fk-blockcard-dialrow">
          {row.map((d) => (
            <DialCell key={d.key} label={d.label} display={d.display} value={d.frac} min={0} max={1} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function RecipeChain({
  slug,
  blocksByPlatform,
  pedalBuy,
}: {
  slug: string;
  blocksByPlatform: Partial<Record<Platform, PreviewBlockData[]>>;
  /** Buy info per pedalboard block, same order as blocksByPlatform.pedalboard. */
  pedalBuy: (BuyInfo | null)[];
}) {
  const { platform, platforms, defaultPlatform, active, select } = useRecipePlatform();
  const rig = useRig();
  const PB = platform === "pedalboard";

  const blocks = blocksByPlatform[platform] ?? [];
  const picks = gearForChain(blocks);
  const items: Item[] = blocks
    .map((block, i) => ({ block, pick: picks[i], i }))
    .filter((x): x is Item => x.pick !== null);
  const platformName = active?.short ?? "This platform";

  // Pedalboard: what is for sale, and what the viewer already owns.
  const shop = PB
    ? items
        .map((it) => ({ it, buy: pedalBuy[it.i] }))
        .filter((x): x is { it: Item; buy: BuyInfo } => !!x.buy && x.buy.status !== "none" && x.buy.status !== "builtin")
    : [];
  const ownedCount = shop.filter((x) => rig.owned(x.it.block.name)).length;
  const toBuy = shop.filter((x) => x.buy.status === "shop" && !rig.owned(x.it.block.name));
  const firstModeler = platforms.find((p) => p.id !== "pedalboard")?.id;

  return (
    <>
      <section className="fk-recipe-section">
        <div className="fk-recipe-sectionhead">
          <h2 className="fk-t2">The signal chain</h2>
          {/* Buttons, not links: as <a href="?platform="> these made seven
              crawlable duplicates of every recipe. Deep links still work. */}
          <div className="fk-chips" role="group" aria-label="Settings for">
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                className="fk-chip"
                aria-pressed={platform === p.id}
                onClick={() => select(p.id)}
              >
                {p.short}
              </button>
            ))}
          </div>
        </div>
        <div className="fk-chain r-lg">
          <ol className="fk-chain-row">
            {items.map(({ block, pick, i }) => (
              <li key={`${block.name}-${i}`}>
                <a href={`#block-${i + 1}`} className="fk-chain-item">
                  <Gear kind={pick.kind} height={146} vals={pick.vals} title={pick.title} disp={pick.disp} color={pick.color} label="" />
                  <span className="fk-caption">{gearTypeLabel(block, pick)}</span>
                  <span className="fk-chain-name">{block.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <p className="fk-caption">
          Signal runs left to right, guitar to output. Every knob is drawn at the recipe&apos;s setting.
        </p>
      </section>

      <section className="fk-recipe-section fk-recipe-section-lg">
        {PB ? (
          <div className="fk-recipe-sectionhead is-end">
            <div className="fk-recipe-sectionintro">
              <h2 className="fk-t2">The real gear, and where to set it</h2>
              <p className="fk-body fk-muted">
                {shop.length} {shop.length === 1 ? "piece" : "pieces"}.{" "}
                {rig.items !== null && <>You own {ownedCount} of them. </>}
                <Link href="/dashboard/my-gear" className="fk-link">Set up your rig</Link> to tick off what you have.
              </p>
            </div>
            {/* Disclosure sits above the first affiliate link. */}
            <p className="fk-disclosure r-md">
              Some links on this page are affiliate links. If you buy through one, Fader &amp; Knob may
              earn a commission at no extra cost to you. As an Amazon Associate we earn from qualifying
              purchases.
            </p>
          </div>
        ) : (
          <div className="fk-recipe-sectionintro">
            <h2 className="fk-t2">Every knob, broken out</h2>
            <p className="fk-body fk-muted">
              {platformName} values for all {items.length} blocks, in signal order.
            </p>
          </div>
        )}

        <div className="fk-blockcards">
          {items.map(({ block, pick, i }) => {
            const buy = PB ? pedalBuy[i] : null;
            const owned = buy ? rig.owned(block.name) : null;
            // Pedalboard cards carry the real gear's name; the note below says the rest.
            const sub = PB ? "" : basedOn(block);
            return (
              <article
                key={`${block.name}-${i}`}
                id={`block-${i + 1}`}
                className={`fk-blockcard r-lg${block.variant === "amp" ? " is-wide" : ""}`}
              >
                <div className="fk-blockcard-main">
                  <div className="fk-blockcard-art r-md">
                    <Gear
                      kind={pick.kind}
                      height={block.variant === "amp" ? 190 : 150}
                      vals={pick.vals}
                      title={pick.title}
                      disp={pick.disp}
                      color={pick.color}
                      label={`${block.name}, drawn at the recipe's settings`}
                    />
                  </div>
                  <div className="fk-blockcard-body">
                    <div className="fk-blockcard-head">
                      <div className="fk-blockcard-title">
                        <h3 className="fk-t3">{block.name}</h3>
                        <span className="fk-caption">{gearTypeLabel(block, pick)}</span>
                      </div>
                      {sub && <p className="fk-body-sm">{sub}</p>}
                    </div>
                    <Dials block={block} />
                    {block.notes && <p className="fk-body-sm fk-blockcard-notes">{block.notes}</p>}
                  </div>
                </div>

                {buy && buy.status === "shop" && (
                  <div className="fk-blockcard-foot">
                    {buy.note ? <p className="fk-body-sm">{buy.note}</p> : <span />}
                    <div className="fk-blockcard-buy">
                      <button
                        type="button"
                        className="fk-chip"
                        aria-pressed={!!owned}
                        onClick={() => rig.toggle(block.name, buy.rigType)}
                      >
                        {owned ? "You own this" : "I own this"}
                      </button>
                      <BuyLink buy={buy} slug={slug} className="fk-btn fk-btn-sm">
                        Check price at {buy.retailer}
                      </BuyLink>
                    </div>
                  </div>
                )}
                {buy && (buy.status === "builtin" || buy.status === "pending") && (
                  <div className="fk-blockcard-foot">
                    <p className="fk-body-sm">{buy.note}</p>
                    {buy.status === "pending" && (
                      <button
                        type="button"
                        className="fk-chip"
                        aria-pressed={!!owned}
                        onClick={() => rig.toggle(block.name, buy.rigType)}
                      >
                        {owned ? "You own this" : "I own this"}
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {PB && (
        <section className="fk-recipe-section fk-recipe-section-md">
          <div className="fk-shoplist r-lg">
            <div className="fk-shoplist-head">
              <h2 className="fk-t2">Shopping list</h2>
              <p className="fk-caption">
                Affiliate links. Fader &amp; Knob may earn a commission at no extra cost to you.
              </p>
            </div>
            {toBuy.length === 0 ? (
              <p className="fk-body fk-shoplist-empty">
                {shop.length > 0 && ownedCount > 0
                  ? "Nothing left to buy. You own every piece we can link."
                  : "Nothing on this chain is linked for sale yet."}
              </p>
            ) : (
              <ul className="fk-shoplist-rows">
                {toBuy.map(({ it, buy }) => (
                  <li key={`${it.block.name}-${it.i}`}>
                    <span className="fk-shoplist-name">{buy.product}</span>
                    <BuyLink buy={buy} slug={slug} className="fk-link fk-label fk-shoplist-link">
                      Check price
                    </BuyLink>
                  </li>
                ))}
              </ul>
            )}
            {firstModeler && (
              <p className="fk-body-sm fk-shoplist-foot">
                Not buying an amp for one song?{" "}
                <button type="button" className="fk-link fk-linkbtn" onClick={() => select(firstModeler ?? defaultPlatform)}>
                  Switch to a modeler version
                </button>{" "}
                of this recipe.
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}

