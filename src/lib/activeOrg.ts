import { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { meQueryOptions, type MeOrganization, type User } from "./auth";

const KEY = "active_org_slug";

// A per-browser convenience (which org the sidebar shows outside an org page),
// not state that must be shared or trusted — so localStorage, and it may be missing.
function remembered(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function remember(slug: string): void {
  try {
    localStorage.setItem(KEY, slug);
  } catch {
    // storage unavailable (private mode): the first organization is used instead
  }
}

/** The org the shell is about: the URL's $orgSlug, else the last one visited, else the first. */
export function resolveCurrentOrg(user: User, urlSlug?: string): MeOrganization | undefined {
  const slug = urlSlug ?? remembered();
  return user.organizations.find((o) => o.organization_slug === slug) ?? user.organizations[0];
}

export function useCurrentOrg() {
  const { data: me } = useSuspenseQuery(meQueryOptions);
  const { orgSlug } = useParams({ strict: false });

  useEffect(() => {
    if (orgSlug) remember(orgSlug);
  }, [orgSlug]);

  return { me, orgSlug, currentOrg: resolveCurrentOrg(me, orgSlug) };
}
