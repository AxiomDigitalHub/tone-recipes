import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Tone Recipe",
  description:
    "Request a specific song tone and we'll build a recipe for your rig. Vote on requests from other players.",
};

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
