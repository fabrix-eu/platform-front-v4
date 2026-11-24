import type { ReactNode } from "react";
import { AtSign, Globe, Link2, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { OrganizationProfile } from "../types";
import { PositionCard } from "./PositionCard";

const withProtocol = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);
const hostOf = (url: string) => withProtocol(url).replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

function ContactLink({ href, icon, children, external }: { href: string; icon: ReactNode; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-2.5 text-fx-body text-fx-ink2 hover:text-fx-emphasis"
    >
      <span className="text-fx-muted">{icon}</span>
      <span className="min-w-0 truncate">{children}</span>
    </a>
  );
}

// Contact details and what it does — each card only when there is something to say. Never the networks
// that follow it: those are a facilitator's private CRM, the organisation is not told (FBX-123).
export function ProfileAside({ org }: { org: OrganizationProfile }) {
  const hasContact = org.website || org.email || org.phone || org.linkedin || org.instagram;
  const icon = "size-4";

  return (
    <aside className="space-y-4">
      {hasContact && (
        <Card>
          <Eyebrow>Contact</Eyebrow>
          <div className="mt-4 space-y-3">
            {org.website && <ContactLink href={withProtocol(org.website)} icon={<Globe className={icon} />} external>{hostOf(org.website)}</ContactLink>}
            {org.email && <ContactLink href={`mailto:${org.email}`} icon={<Mail className={icon} />}>{org.email}</ContactLink>}
            {org.phone && <ContactLink href={`tel:${org.phone}`} icon={<Phone className={icon} />}>{org.phone}</ContactLink>}
            {org.linkedin && <ContactLink href={withProtocol(org.linkedin)} icon={<Link2 className={icon} />} external>LinkedIn</ContactLink>}
            {org.instagram && <ContactLink href={withProtocol(org.instagram)} icon={<AtSign className={icon} />} external>Instagram</ContactLink>}
          </div>
        </Card>
      )}

      <PositionCard org={org} />
    </aside>
  );
}
