import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactList, proseLink as link } from "../parts";

const WHO = [
  ["A facilitator", "A person whose job is a territory's circular textile ecosystem: a city officer, a cluster manager, a programme lead. They are not in the chain; they help the ones who are — find a partner, a subsidy, a regulation's meaning — and they report on the whole."],
  ["A network", "A facilitator's working view of that territory: a centre and a radius, the organisations they follow, and what they keep on each. One territory, one network; several facilitators can share it."],
  ["The organisations followed", "Ordinary FABRIX profiles, claimed or not, that the network keeps a record on. Being followed changes nothing for them: no badge, no notification, no obligation."],
];

const DIFFERENCE = [
  ["It is not a community", "An earlier FABRIX had communities: organisations joined them, posted in them, applied to their challenges. Members did not want a place to animate; facilitators did want a place to work. The network keeps the second and drops the first. Nothing in a network is seen by the organisations in it."],
  ["It is a CRM", "Health ratings, notes, needs, business figures, tasks, a log of calls and visits: the tools of someone whose job is to follow twenty organisations and know where each one stands. Private to the facilitation team, shared within it."],
  ["It reads the same map", "A network's organisations are the platform's organisations; the table, map and graph of the dashboard are views on the public profiles and connections, enriched with what the team knows. When an organisation completes its profile or declares a partner, the facilitator's view improves with it."],
];

const WHY = [
  ["Why the platform has facilitators at all", "FABRIX exists because cities want their textile ecosystems to close loops, and cities work through people. A platform where members only meet each other would leave those people without a view. The network is that view."],
  ["Why the record is private", "A facilitator's honest note — “struggling since the subsidy ended” — is only useful if it can be honest. Showing it to the organisation would turn it into diplomacy. The organisation has its own profile for what it wants to say about itself."],
  ["Why the self-assessment is the exception", "The Compass questionnaire on needs and opportunities is the organisation telling the facilitator what it needs, in its own words. It is read on the record because that is precisely whom it is for."],
  ["Why the FABRIX team sets networks up", "A network stands for a territory and a mandate. Creating it is a decision about who facilitates what, not a button; adding an organisation to it, for now, goes through the same team."],
];

/** Explanation: what a facilitator is, what a network is for, and why it is not a community. */
export function FacilitatorsAndNetworks() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Most people on FABRIX are in the chain: they make, sort, recycle, design, sell. A few are around
        it, paid by a city or a programme to make the chain work better. FABRIX gives them a place of their
        own — the network — that the rest of the platform never sees.
      </p>

      <Eyebrow className="mt-10 mb-3">Three words</Eyebrow>
      <FactList rows={WHO} />

      <Eyebrow className="mt-12 mb-3">What a network is, and is not</Eyebrow>
      <FactList rows={DIFFERENCE} />

      <Eyebrow className="mt-12 mb-3">Why</Eyebrow>
      <FactList rows={WHY} />

      <Eyebrow className="mt-12 mb-3">What it means for a member</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        If your city has a facilitation team on FABRIX, it may be following your organisation, and it can
        read your members' names and your answers on needs and opportunities. That is the whole of it. A
        complete profile and an honest needs questionnaire are how you get help from them; the rest of what
        they keep is their notebook, and stays in it.
      </p>

      <Banner tone="info" className="mt-10">
        Running a network is in{" "}
        <Link to="/manual/$page" params={{ page: "run-your-network" }} className={link}>
          Run your network
        </Link>
        ; what a record holds, in{" "}
        <Link to="/manual/$page" params={{ page: "network-records" }} className={link}>
          Network records
        </Link>
        .
      </Banner>
    </div>
  );
}
