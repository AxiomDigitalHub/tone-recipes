import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF preview (dev)",
  robots: { index: false, follow: false },
};

export default function DevPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
