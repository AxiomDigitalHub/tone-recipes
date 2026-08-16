import Link from "next/link";
import {
  verifyRecipe,
  platformLabel,
  ATTRIBUTION_LABELS,
  type PresetBuildResult,
} from "@/lib/recipe-verification";
import type { ToneRecipe } from "@/types/recipe";

/**
 * The verification band.
 *
 * Every claim here was computed by a program at build time against the same
 * chain plan the downloadable file is emitted from. Nothing here says a person
 * listened to anything, because no person did — and the "what we didn't check"
 * column is load-bearing, not a disclaimer. In a market where every competitor
 * asserts unfalsifiable quality, a checkable list of our own defects is the
 * only signal that costs anything to produce.
 *
 * Placed directly under the chain, above the editorial voice: the reader has
 * just seen the settings and the next question is "can I trust these?".
 */

function statusOf(p: PresetBuildResult): "clean" | "degraded" | "failed" {
  if (!p.built) return "failed";
  if (p.droppedBlocks.length || p.substitutedBlocks.length) return "degraded";
  return "clean";
}

function PresetRow({ result }: { result: PresetBuildResult }) {
  const status = statusOf(result);
  const { droppedBlocks: dropped, substitutedBlocks: substituted } = result;

  return (
    <li className={`rv-preset rv-preset-${status}`}>
      <span className="rv-preset-platform">{platformLabel(result.platform)}</span>{" "}
      <span className="rv-preset-verdict">
        {status === "failed" && "did not build"}
        {status === "clean" && "builds complete — every block in the recipe is in the file"}
        {status === "degraded" && (
          <>
            {dropped.length > 0 && (
              <>
                {dropped.length} block{dropped.length === 1 ? "" : "s"} missing from the file
              </>
            )}
            {dropped.length > 0 && substituted.length > 0 && "; "}
            {substituted.length > 0 && (
              <>
                {substituted.length} block{substituted.length === 1 ? "" : "s"} replaced with a
                stand-in model
              </>
            )}
          </>
        )}
      </span>
      {(dropped.length > 0 || substituted.length > 0) && (
        <details className="rv-preset-detail">
          <summary>Which ones</summary>
          {dropped.length > 0 && (
            <p>
              <strong>Not in the file:</strong> {dropped.join(", ")}. The recipe calls for{" "}
              {dropped.length === 1 ? "this block" : "these blocks"}, but we have no verified model
              ID for {dropped.length === 1 ? "it" : "them"} on this platform, so the preset is
              written without {dropped.length === 1 ? "it" : "them"}. Add{" "}
              {dropped.length === 1 ? "it" : "them"} by hand using the settings above.
            </p>
          )}
          {substituted.length > 0 && (
            <p>
              <strong>Replaced with a stand-in:</strong> {substituted.join(", ")}. These load
              cleanly but are <em>not</em> the model named above — the file will sound wrong here
              until we map {substituted.length === 1 ? "it" : "them"}. Set{" "}
              {substituted.length === 1 ? "this block" : "these blocks"} by hand.
            </p>
          )}
          {result.omittedByDesign.length > 0 && (
            <p>
              <strong>Not applicable to this hardware:</strong>{" "}
              {result.omittedByDesign.join(", ")}. Omitted on purpose — the target has no
              equivalent slot.
            </p>
          )}
        </details>
      )}
    </li>
  );
}

export default function RecipeVerification({ recipe }: { recipe: ToneRecipe }) {
  const v = verifyRecipe(recipe);
  if (v.presets.length === 0) return null;

  const attribution = ATTRIBUTION_LABELS[v.attribution];
  const cleanCount = v.presets.filter((p) => statusOf(p) === "clean").length;

  return (
    <section className="rv" aria-labelledby="rv-heading">
      <div className="rv-head">
        <h4 id="rv-heading">What we checked</h4>
        <p className="rv-sub">
          Computed by a program, on this recipe, every time this page is built.
          {" "}
          <Link href="/experiment">How this works</Link>
        </p>
      </div>

      <div className="rv-body">
        <div className="rv-group">
          <h5 className="rv-group-label">
            Preset files — {cleanCount} of {v.presets.length} complete
          </h5>
          <ul className="rv-presets">
            {v.presets.map((p) => (
              <PresetRow key={p.platform} result={p} />
            ))}
          </ul>
        </div>

        <div className="rv-facts">
          {v.dsp && (
            <div className="rv-fact">
              <dt>Helix DSP</dt>
              <dd>
                {v.dsp.worstPathPercent}% of one chip
                {v.dsp.fits ? " — fits" : " — over budget"}
                {v.dsp.unknownModels.length > 0 && (
                  <span className="rv-fact-caveat">
                    {" "}
                    ({v.dsp.unknownModels.length} block
                    {v.dsp.unknownModels.length === 1 ? " has" : "s have"} no published cost and
                    {v.dsp.unknownModels.length === 1 ? " is" : " are"} counted as zero)
                  </span>
                )}
              </dd>
            </div>
          )}

          <div className="rv-fact">
            <dt>Sources</dt>
            <dd>
              {v.sources.length} cited, {v.primarySourceCount} from publications that do original
              gear reporting
              {v.aggregatorOnly && (
                <span className="rv-fact-caveat">
                  {" "}
                  — every source here is an aggregator, tab site, video, or wiki. Treat the gear
                  list as less settled than usual.
                </span>
              )}
            </dd>
          </div>

          <div className="rv-fact">
            <dt>Attribution</dt>
            <dd>
              {attribution.label}
              <span className="rv-fact-caveat"> — {attribution.detail}</span>
            </dd>
          </div>
        </div>

        <div className="rv-group rv-unchecked">
          <h5 className="rv-group-label">What we didn&apos;t check</h5>
          <ul>
            {v.notChecked.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
