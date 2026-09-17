import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

const STEPS = [
  {
    title: "Look for your organisation first",
    body: "Many organisations are already on FABRIX, added by a partner who works with them. Search for yours before creating anything: if it is there, you claim it rather than start a second entry that splits your history in two.",
  },
  {
    title: "Claim it, or create it",
    body: "Claiming asks the FABRIX team to confirm you belong to the organisation. Creating one takes its name, what it does, and an address — the address is what places you on the map and lets partners nearby find you.",
  },
  {
    title: "Say what you do",
    body: "Pick the areas you work in, then refine them. This is how partners and facilitators find you, and it is the same vocabulary the marketplace uses, so a search for “sorting” finds both the listings and the organisations that do it.",
  },
  {
    title: "Bring the partners you already work with",
    body: "Add them as connections. Those not on FABRIX yet can be invited to claim their own entry — that is how the network grows, one real working relationship at a time.",
  },
];

export function GettingStarted() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        FABRIX connects the organisations of the European circular textile ecosystem: who makes what, who
        needs what, and who can help. Everything starts with your organisation being on it, and being
        findable.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <Card className="flex gap-4 p-5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fx-emphasis-soft font-fx-display text-fx-small font-extrabold text-fx-emphasis">
                {index + 1}
              </span>
              <div className="min-w-0">
                <h2 className="text-fx-heading text-fx-ink">{step.title}</h2>
                <p className="mt-1.5 text-fx-body text-fx-ink2">{step.body}</p>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <Eyebrow className="mt-12 mb-3">A note on accounts</Eyebrow>
      <Banner tone="info">
        You sign in as a person, and belong to one or more organisations. Everything you publish — a
        listing, a connection, a message — is published in the name of the organisation you are acting
        for, not in your own.
      </Banner>
    </div>
  );
}
