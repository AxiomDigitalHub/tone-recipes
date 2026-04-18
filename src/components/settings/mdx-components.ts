import Knob from "./Knob";
import Fader from "./Fader";
import SettingsGrid from "./SettingsGrid";
import EQCurve from "./EQCurve";

/**
 * Components exposed to MDX. Pass this object into MDXRemote's `components`
 * prop so blog + news posts can use the Fader & Knob visual language:
 *
 *   <SettingsGrid title="Pre-amp" subtitle="Fortin NTS">
 *     <Knob name="Gain" value={5} />
 *     <Knob name="Bass" value={4.5} />
 *     <Knob name="Mid" value={6} />
 *     <Knob name="Treble" value={5} />
 *     <Knob name="Presence" value={4.5} />
 *   </SettingsGrid>
 *
 *   <EQCurve
 *     title="Mid scoop"
 *     bands={[
 *       { freq: 100, gain: +2 },
 *       { freq: 800, gain: -6 },
 *       { freq: 4000, gain: +3 },
 *     ]}
 *   />
 */
export const settingsMdxComponents = {
  Knob,
  Fader,
  SettingsGrid,
  EQCurve,
};
