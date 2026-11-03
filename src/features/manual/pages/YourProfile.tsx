import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { stageName, VALUE_CHAIN_STAGES } from "@/features/organizations/position";

const PUBLIC_PARTS = [
  ["Identity", "Name, what you do, your logo and cover, your description."],
  ["Where you are", "Your address, and the point it puts you on the map."],
  ["What you do", "Where you sit in the value chain, and the materials you work with."],
  ["Offers and needs", "Your marketplace listings: what you have, what you look for."],
  ["Connections", "The organisations you work with, and how."],
  ["Photos", "Your site, your products, your team."],
];

const PRIVATE_PARTS = [
  ["Size and reach", "Number of people, turnover, development stage."],
  ["Registration details", "NACE codes, legal form, VAT number."],
  ["Facilities and processes", "The equipment and processes you declared."],
];

function List({ rows }: { rows: string[][] }) {
  return (
    <ul className="mt-3 flex flex-col">
      {rows.map(([label, detail]) => (
        <li key={label} className="border-t border-fx-line py-3 first:border-t-0">
          <p className="text-fx-body font-bold text-fx-ink">{label}</p>
          <p className="mt-0.5 text-fx-small text-fx-ink2">{detail}</p>
        </li>
      ))}
    </ul>
  );
}

export function YourProfile() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Your profile is how the ecosystem meets you. It is one page, edited section by section, and it is
        what a partner reads before deciding to get in touch.
      </p>

      <Eyebrow className="mt-10 mb-3">Where your organisation sits</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        Your organisation is shown by its place in the value chain — the first stage you work in, or how
        you support the chain — next to its name, on its card and on the map. You pick it at sign-up and
        change it under <em>What you do</em>: {VALUE_CHAIN_STAGES.map((s) => stageName(s.value)).join(", ")}.
      </p>

      <Card className="mt-10 p-5">
        <Eyebrow>What everyone sees</Eyebrow>
        <List rows={PUBLIC_PARTS} />
      </Card>

      <Card className="mt-4 p-5">
        <Eyebrow>What stays with your team</Eyebrow>
        <p className="mt-2 text-fx-small text-fx-ink2">
          Members of your organisation see these; visitors and other organisations do not.
        </p>
        <List rows={PRIVATE_PARTS} />
      </Card>

      <Eyebrow className="mt-12 mb-3">Who can edit it</Eyebrow>
      <Banner tone="info">
        Anyone who belongs to your organisation can edit the profile. Ownership matters for one thing only:
        an organisation always keeps at least one owner, so the last one cannot be removed or demoted.
      </Banner>

      <Eyebrow className="mt-10 mb-3">Why it is worth finishing</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        An organisation with an address appears on the map. One that says what it does appears in the
        filters. One with listings appears in the marketplace. Each section you complete is another way of
        being found — and being found is the whole point.
      </p>
    </div>
  );
}
