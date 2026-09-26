import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactList, proseLink as link } from "../parts";

const THEMES = [
  ["Ecodesign decisions", "Whether products are designed for their whole life: recyclable materials, repairability, standards such as ISO 14006 and the EU's ecodesign regulation."],
  ["Environmental management", "Whether the organisation measures and manages its footprint — energy, water, waste, emissions — with policies and certifications behind it."],
  ["Manufacturing efficiency", "How production uses materials and energy, and what it does with what is left over."],
  ["Supply chain management", "Transparency toward suppliers, ethical practices, local sourcing."],
  ["Distribution and retail service", "How goods reach customers, and what happens after: returns, repair, take-back."],
  ["Social capital", "Trust, relationships and shared values inside the organisation."],
  ["Technology and business model innovation", "Adoption of new technology, ability to change, circular business models."],
  ["Business maturity and economic viability", "Performance, market position, the economic strain the organisation is under."],
];

const HOW = [
  ["Answers carry points", "Each option of a scored question is worth points, decided by whoever wrote the questionnaire. The score is the share of points earned out of those available — options marked as not applicable are taken out of the total, so an honest “does not apply” never lowers you."],
  ["The score is a position, not a grade", "It says where an organisation stands on that theme, against the practices the questionnaire describes. Nobody is expected to score full marks on all eight; a producer and a designer have different gaps."],
  ["The advice is the point", "Every scored answer carries its own paragraph: why the practice matters and what to do next. The panel sorts them by the points left on the table, so the first line is the most worthwhile move. That list is the product; the number is its summary."],
  ["Over time", "Answering again replaces the previous answers. There is no history of scores yet: the Compass is a snapshot, retaken when the organisation wants to see whether it moved."],
];

/** Explanation: what the Compass measures, why it asks what it asks, and how to read a score. */
export function TheImpactCompass() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        The Impact Compass is FABRIX's way of asking an organisation how circular it is — not to rank it,
        but to tell it what to work on. Eight themes, each a questionnaire written by the FABRIX project's
        researchers with the practices of the circular textile sector in mind, each ending in a score and
        a list of things to do.
      </p>

      <Eyebrow className="mt-10 mb-3">What it measures</Eyebrow>
      <FactList rows={THEMES} />
      <p className="mt-3 text-fx-body text-fx-ink2">
        Not every theme applies to every organisation; a questionnaire that does not says so in its
        description, and can simply be left unstarted.
      </p>

      <Eyebrow className="mt-12 mb-3">How to read a score</Eyebrow>
      <FactList rows={HOW} />

      <Eyebrow className="mt-12 mb-3">Why it is private</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        A score that partners could see would be answered for the partners. The Compass is only useful if
        it is answered for oneself, so nothing of it is shown on the profile, in the Directory or to other
        organisations. The one exception is the questionnaire on needs and opportunities, written for the
        facilitator of your network to read, because it is the organisation asking for help in its own
        words — it is not yet offered in the Compass list, and will be.
      </p>

      <Eyebrow className="mt-12 mb-3">Why it is on a networking platform</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        Because the answers are the same kind of thing as the map. Knowing what you lack — a recyclable
        material, a take-back partner, a certification — is what turns a directory into a next step: the
        advice under a low score often names the kind of organisation to look for, and the Directory is one
        click away. The Compass tells you what to look for; the rest of FABRIX is where you find it.
      </p>

      <Banner tone="info" className="mt-10">
        Answering one is in{" "}
        <Link to="/manual/$page" params={{ page: "complete-the-compass" }} className={link}>
          Complete the Compass
        </Link>
        ; the mechanics of scoring, in{" "}
        <Link to="/manual/$page" params={{ page: "compass-questionnaires" }} className={link}>
          Compass questionnaires
        </Link>
        .
      </Banner>
    </div>
  );
}
