import type { ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { dataSummaryQueryOptions } from "./api";
import { AudienceColumns } from "./AudienceColumns";
import { DataHero } from "./DataHero";
import { DataRequestForm } from "./DataRequestForm";
import { DatasetCards } from "./DatasetCards";
import { ExploreActions } from "./ExploreActions";
import { NetworkFigures } from "./NetworkFigures";
import { SourcesAndLimits } from "./SourcesAndLimits";

function Section({ id, eyebrow, title, lede, children }: { id: string; eyebrow: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`} className="mt-16 sm:mt-20">
      <Eyebrow className="text-fx-emphasis">{eyebrow}</Eyebrow>
      <h2 id={`${id}-title`} className="mt-2 max-w-[24ch] font-fx-display text-fx-display text-fx-ink">
        {title}
      </h2>
      {lede && <p className="mt-3 max-w-prose text-fx-body text-fx-ink2">{lede}</p>}
      {children}
    </section>
  );
}

/**
 * The public face of the data: what FABRIX holds, where it comes from, what it answers,
 * and the way in. Visitors are invited to create an account; the map itself stays for
 * members who study the ecosystem. Figures come from the summary endpoint, so they never
 * go stale.
 */
export function PublicDataPage() {
  const { data: summary } = useSuspenseQuery(dataSummaryQueryOptions);
  const me = useOptionalMe();

  return (
    <div className="pb-8">
      <DataHero summary={summary} me={me} />

      <Section id="datasets" eyebrow="What we have" title="Five datasets, from two registers to the network itself" lede="Counted live. Two are on the map for members, two are loaded and on their way back, and the fifth is the platform.">
        <DatasetCards summary={summary} />
      </Section>

      <Section id="audiences" eyebrow="What it tells" title="One question per line, answered from the data we hold">
        <AudienceColumns />
        <div className="mt-8">
          <ExploreActions me={me} />
        </div>
      </Section>

      <Section id="network" eyebrow="The network" title="What FABRIX adds to the registers" lede="The platform's own data, in aggregates. No organisation is named here; the Directory is where members meet them.">
        <NetworkFigures network={summary.network} />
      </Section>

      <Section id="sources" eyebrow="Sources" title="Where it comes from, and what to keep in mind">
        <SourcesAndLimits />
      </Section>

      <Section id="access" eyebrow="Get the data" title="Two ways in">
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-fx-lg bg-fx-emphasis p-6 text-fx-emphasis-ink">
            <h3 className="font-fx-display text-fx-heading">Explore it</h3>
            <p className="mt-2 text-fx-small opacity-90">
              The map, the Directory and the Marketplace are inside the platform. An account takes a minute; researchers,
              planners and administrators sign up without an organisation.
            </p>
            <div className="mt-5 [&_a]:bg-fx-emphasis-ink [&_a]:text-fx-emphasis [&_p]:text-fx-emphasis-ink">
              <ExploreActions me={me} size="sm" />
            </div>
          </div>
          <div className="rounded-fx-lg border border-fx-line bg-fx-paper p-6">
            <h3 className="font-fx-display text-fx-heading text-fx-ink">Ask for a dataset</h3>
            <p className="mt-2 text-fx-small text-fx-ink2">
              Extracts and aggregates are shared on request, under the terms of each source. Say what you need and what for;
              the FABRIX team answers by email. When you publish, cite the FABRIX platform and the register the data comes from.
            </p>
            <div className="mt-5">
              <DataRequestForm />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
