"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { track, type EventName } from "@/lib/analytics";

type LinkProps = ComponentProps<typeof Link>;

interface TrackedLinkProps extends Omit<LinkProps, "onClick"> {
  event: EventName;
  eventParams?: Record<string, string | number | boolean | undefined>;
  children: ReactNode;
}

/**
 * Drop-in replacement for next/link that fires a conversion event on click.
 * Keeps the surrounding component server-renderable — only this leaf is
 * a client island.
 */
export default function TrackedLink({
  event,
  eventParams,
  children,
  ...rest
}: TrackedLinkProps) {
  return (
    <Link {...rest} onClick={() => track(event, eventParams)}>
      {children}
    </Link>
  );
}
