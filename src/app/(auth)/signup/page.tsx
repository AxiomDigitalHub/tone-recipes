import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Sign up — Fader & Knob",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupClient />;
}
