import { Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CatalogControls } from "./CatalogControls";
import { CatalogSurfaces } from "./CatalogSurfaces";
import { Radii, Swatches, TypeScale } from "./Foundations";
import { Section } from "./Section";
import { SpacingRules } from "./SpacingRules";

const CHIPS = ["Plus Jakarta Sans 800", "Violet #6c4cf1", "Panel #faf9fc", "14px cards", "Fills, not tints"];

/**
 * /design — the design system rendered from the live tokens and the real
 * components. Nothing here is drawn twice: every example below is the component
 * a page imports, so the catalog cannot drift from the app.
 */
export function DesignPage() {
  return (
    <div className="min-h-screen bg-fx-ground text-fx-ink">
      <header className="border-b border-fx-line px-6 py-14 sm:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <Link to="/login" aria-label="FABRIX">
              <img src="/fabrix-logo.svg" alt="FABRIX" className="h-8" />
            </Link>
            <Eyebrow>Design system · platform v4</Eyebrow>
          </div>
          <h1 className="mt-12 max-w-4xl text-fx-hero text-fx-ink">This is the system.</h1>
          <p className="mt-6 max-w-2xl text-fx-lead text-fx-ink2">
            White page, #faf9fc panel, Plus Jakarta Sans, violet as the one brand colour, 14px cards — with the volume
            turned up: headings at weight 800, solid fills where the prototype used tints. Every component below is the
            one the app imports.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <span key={c} className="rounded-full bg-fx-emphasis-soft px-4 py-2 text-fx-small font-bold text-fx-ink">
                {c}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="bg-fx-panel">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-16">
          <Section n="01" title="Colour" lede="One name does one job. `emphasis` carries the structural work — every selected state, primary button and hero block reads from it, and no component names violet directly.">
            <Swatches />
          </Section>

          <Section n="02" title="Type" lede="Real size and weight 800 on the display scale; the body scale is the prototype's, because it was never the problem.">
            <TypeScale />
          </Section>

          <Section n="03" title="Radius" lede="Cards keep 14. Larger steps are for hero surfaces, and actions get their own token, so a button's shape moves without touching a button.">
            <Radii />
          </Section>

          <Section n="04" title="Spacing" lede="Type sizes without spacing rules are half a system. Each rule is shown as the before/after it actually was.">
            <SpacingRules />
          </Section>

          <Section n="05" title="Components" lede="The pieces every page is assembled from, each with its import path. Pills, tabs and nav entries here are live: their state is in the URL, exactly as on a real page.">
            <div className="rounded-fx-lg border border-fx-line bg-fx-paper px-8 py-2">
              <CatalogControls />
              <CatalogSurfaces />
            </div>
          </Section>

          <footer className="mt-24 border-t border-fx-line pt-8">
            <p className="max-w-3xl text-fx-small text-fx-muted">
              Tokens live in <code className="font-mono text-fx-ink">src/index.css</code> as one set of{" "}
              <code className="font-mono text-fx-ink">fx-*</code> names; components in{" "}
              <code className="font-mono text-fx-ink">src/components/ui</code>. Move a value in the CSS and every page
              follows. Plus Jakarta Sans is self-hosted — no third-party font call.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
