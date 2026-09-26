import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactList, proseLink as link } from "../parts";

const LOOP = [
  ["You add the partners you already work with", "Each one becomes a profile on the map, connected to yours. The map fills with the real chain, not with whoever happened to sign up."],
  ["The platform invites them", "Give the email of the person you know there, and they receive an invitation to claim the profile that is already waiting for them — with your name on it, which is why they open it."],
  ["They claim it, and add their own partners", "A claimed profile has a team, listings, a Compass. And its team has partners you do not know. The loop turns once more, one real relationship at a time."],
  ["Listings pull the rest in", "An offer or a need is the reason a stranger comes to FABRIX: they searched for what you have. Listings are how the network reaches beyond the people its members already know."],
];

const WHY = [
  ["Why the map is the product", "A circular chain is local: what you can collect, sort, recycle and remake depends on who is within a lorry's reach. A directory of everyone in Europe is not useful; the twenty organisations around you are."],
  ["Why profiles exist before their owners", "If only sign-ups were on the map, the map would be empty where it matters most — around a member who just joined. Unclaimed profiles let one member draw their whole neighbourhood, and let each neighbour find a place already made for them."],
  ["Why connections are declared, not requested", "A supplier is a supplier whether or not they have clicked a button. Declaring the relationship is a statement of fact by someone who knows it; either side can correct it. Approval would only slow the map down."],
  ["Why nothing is done in your own name", "Partners work with organisations. A listing, a connection, a message from “Northwave Textiles” means something to a recycler; the same from a person does not. People come and go; the organisation's history stays."],
];

const ASK = [
  ["Your address, and what you do", "So that you are on the map and in the filters — the six essentials of your profile."],
  ["Two or three partners", "The ones you already work with. Ten minutes, once."],
  ["One listing", "What you have too much of, or what you are short of. It is the thing most likely to bring someone new."],
];

/** Explanation: the idea the platform is built on, and why its choices follow from it. */
export function HowTheNetworkGrows() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        FABRIX has no sales team and no advertising. It grows the way a supply chain does: one organisation
        brings the ones it already works with, and each of those brings its own. Everything in the platform
        is shaped to make that one movement easy.
      </p>

      <Eyebrow className="mt-10 mb-3">The loop</Eyebrow>
      <FactList rows={LOOP} />

      <Eyebrow className="mt-12 mb-3">Why it is built this way</Eyebrow>
      <FactList rows={WHY} />

      <Eyebrow className="mt-12 mb-3">What it asks of you</Eyebrow>
      <FactList rows={ASK} />
      <p className="mt-3 text-fx-body text-fx-ink2">
        That is all. A member who did those three things has done more for the network than a hundred
        sign-ups who did nothing; the platform's home page is built around them, and its manual starts with
        them.
      </p>

      <Eyebrow className="mt-12 mb-3">What it is not</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        FABRIX is not a social network. There are no feeds to keep up with, no likes, no groups to animate:
        an earlier version had communities and challenges, and its members did not want them. What remains
        is the map, the marketplace, the events and the messages — the parts that end in a lorry, a
        contract or a meeting.
      </p>

      <Banner tone="info" className="mt-10">
        The walk that does it is{" "}
        <Link to="/manual/$page" params={{ page: "bring-your-partners" }} className={link}>
          Bring your partners
        </Link>
        ; the two states a profile passes through are in{" "}
        <Link to="/manual/$page" params={{ page: "claimed-and-unclaimed" }} className={link}>
          Claimed and unclaimed
        </Link>
        .
      </Banner>
    </div>
  );
}
