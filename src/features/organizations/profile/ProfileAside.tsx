import type { ReactNode } from "react";
import { AtSign, Globe, Link2, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { specialtyLabel } from "@/features/listings/taxonomy";
import type { OrganizationProfile } from "../types";

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

// Contact details, what it does, the networks that follow it — each card only when there is something to say.
export function ProfileAside({ org }: { org: OrganizationProfile }) {
  const specialties = org.specialties.map(specialtyLabel).filter((l): l is string => !!l);
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

      {specialties.length > 0 && (
        <Card>
          <Eyebrow>What they do</Eyebrow>
          <div className="mt-4 flex flex-wrap gap-2">
            {specialties.map((label) => (
              <span key={label} className="rounded-full bg-fx-slate-soft px-3 py-1 text-fx-small font-bold text-fx-ink2">
                {label}
              </span>
            ))}
          </div>
        </Card>
      )}

      {org.networks.length > 0 && (
        <Card>
          <Eyebrow>In the networks of</Eyebrow>
          <ul className="mt-4 space-y-2">
            {org.networks.map((network) => (
              <li key={network.id} className="text-fx-body font-bold text-fx-ink2">
                {network.name}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </aside>
  );
}
