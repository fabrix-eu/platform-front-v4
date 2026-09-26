import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NEED_OPTIONS } from "@/features/facilitator/record/needs";
import { CONTACT_KINDS, HEALTH_LABELS, HEALTH_TONES } from "@/features/facilitator/types";
import { FactList, proseLink as link } from "../parts";

const FIELDS = [
  ["Economic health, Environmental score", "Two ratings, one value each from the scale below. Set from the record's header; they colour the table and the map of the network."],
  ["Notes", "Free text, saved as you type. Whatever the facilitation team should know."],
  ["Needs", "Which of the ten needs below apply, each with a note. Set in Assess mode."],
  ["Specialisation", "Free text: what the organisation is for, in the network's own words."],
  ["Turnover, Employees, Growth", "Yearly turnover in euros, number of employees, growth in percent. The network's own figures — the organisation's declared size lives on its profile and is not changed here."],
  ["Status", "Active, inactive or pending. Set when the organisation is added; not editable from the record yet."],
  ["Added by, added on", "Who followed the organisation into the network, and when."],
];

const ATTACHED = [
  ["Tasks", "A title, a due date, done or not. Created from the record or from the network's Tasks tab; those about this organisation show in both places."],
  ["Interactions", "A kind, a date, a summary, and who logged it. Newest first. Deleted one by one."],
  ["Self-assessment", "Not yours: the organisation's own answers to the Compass questionnaire on needs and opportunities, read-only, when they filled it in."],
  ["People", "Not yours either: the organisation's members on FABRIX, with their email and who owns the profile."],
];

const RULES = [
  ["One record per organisation per network", "The same organisation followed by two networks has two records, each private to its network's facilitators."],
  ["Private to the facilitation team", "Nothing on the record is shown to the organisation or anywhere else on FABRIX."],
  ["Unfollow deletes it", "Notes, needs, business data, tasks and interactions go with the record; the organisation and its profile stay."],
];

/** Reference: the fields a network keeps on one organisation, from the modules the record uses. */
export function NetworkRecords() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        For each organisation a network follows, it keeps a record. This page lists its fields and their
        values, what is attached to it, and the rules — with the labels the record page uses.
      </p>

      <Eyebrow className="mt-10 mb-3">The fields</Eyebrow>
      <FactList rows={FIELDS} />

      <Eyebrow className="mt-12 mb-3">The health scale</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {Object.entries(HEALTH_LABELS).map(([value, label]) => (
          <Badge key={value} tone={HEALTH_TONES[value as keyof typeof HEALTH_TONES]}>
            {label}
          </Badge>
        ))}
      </div>
      <p className="mt-3 text-fx-body text-fx-ink2">
        The same five values for both ratings. Unknown is the default, and what the map and the table show
        until a facilitator decides.
      </p>

      <Eyebrow className="mt-12 mb-3">The {NEED_OPTIONS.length} needs</Eyebrow>
      <FactList rows={NEED_OPTIONS.map((need) => [need.label, need.description])} />

      <Eyebrow className="mt-12 mb-3">Attached to the record</Eyebrow>
      <FactList rows={ATTACHED} />
      <p className="mt-3 text-fx-body text-fx-ink2">
        Interaction kinds: {Object.values(CONTACT_KINDS).join(", ")}.
      </p>

      <Eyebrow className="mt-12 mb-3">Rules</Eyebrow>
      <FactList rows={RULES} />

      <Banner tone="info" className="mt-10">
        Working the record is in{" "}
        <Link to="/manual/$page" params={{ page: "follow-an-organisation" }} className={link}>
          Follow an organisation
        </Link>
        ; the dashboard around it, in{" "}
        <Link to="/manual/$page" params={{ page: "run-your-network" }} className={link}>
          Run your network
        </Link>
        .
      </Banner>
    </div>
  );
}
