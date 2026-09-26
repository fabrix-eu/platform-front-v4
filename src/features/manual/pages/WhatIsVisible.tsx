import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactList, proseLink as link } from "../parts";

const CIRCLES = [
  ["Everyone, including visitors", "Your profile's public part: name, type, address on the map, description, what you do, contacts, photos, logo, listings, connections. The marketplace and the events, with their organisers' names."],
  ["Everyone signed in", "The Directory, with the same profiles searchable and mapped. Who answered an event, and its online link. The name of the person behind each thing an organisation did — who posted a listing, who wrote a message — where that thing is shown."],
  ["Your organisation's team", "The private part of the profile: how many people, turnover, development stage, registration details. Your Compass answers and scores. Your mailbox. Your team list, invitations and join requests. The essentials ring."],
  ["The facilitators of a network you are in", "What everyone sees, plus your members' names and emails, and your answers to the Compass questionnaire on needs and opportunities. Their own record on you — health, notes, needs, interactions — is theirs, not yours: you never see it."],
  ["The FABRIX team", "Everything above across the platform, the claims and who made them, the feedback and who sent it. Not your messages."],
];

const RULES = [
  ["The profile is the boundary", "What the editor marks Public is on your page for everyone; what it marks Not public or Never public never leaves your team. There is no per-field switch: the boundary is the same for every organisation, so a partner knows what to expect of yours."],
  ["Messages are between two organisations", "Nobody else reads them — not facilitators, not the FABRIX team. Both teams do, whole."],
  ["Your name travels with your actions", "Signing in as a person means a listing has a poster and a message a signature. Partners see the organisation first; the person is there for those who look, so that a conversation can find its way to the right desk."],
  ["Public means public", "Anyone with the link, signed in or not, reads the public part of a profile, a listing or an event. Put on a profile the general contacts you would print on a flyer, not a colleague's direct line."],
  ["Deleting takes it back", "A closed listing hides; a deleted one is gone. A given-back profile keeps its public part and loses the private one. A deleted account leaves the organisation intact and the person gone."],
];

/** Explanation: the circles of visibility, and the principle behind them. */
export function WhatIsVisible() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        FABRIX is a public map with private rooms. Most of what you put on it is meant to be found —
        that is what it is for. Some of it is meant for your team alone, and a little for the people who
        facilitate your territory. This page draws the circles.
      </p>

      <Eyebrow className="mt-10 mb-3">Five circles, from the outside in</Eyebrow>
      <FactList rows={CIRCLES} />

      <Eyebrow className="mt-12 mb-3">Why the line is where it is</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        A partner deciding whether to call you needs what you make, where you are, and how to reach you —
        so those are public, and being complete on them is what puts you in front of the right people.
        A partner does not need your turnover to call you, and you would not tell it to a stranger — so
        it stays in, and serves only the Compass, which compares you with organisations of your size, and
        the statistics facilitators build for their city. The facilitator's circle exists because a city's
        facilitation team is meant to help the organisations it follows; knowing whom to call and what
        they said they need is the minimum for that.
      </p>

      <Eyebrow className="mt-12 mb-3">Rules that hold everywhere</Eyebrow>
      <FactList rows={RULES} />

      <Banner tone="info" className="mt-10">
        The field-by-field list for a profile is in{" "}
        <Link to="/manual/$page" params={{ page: "your-profile" }} className={link}>
          Your profile
        </Link>
        ; who may change what, in{" "}
        <Link to="/manual/$page" params={{ page: "roles-and-permissions" }} className={link}>
          Roles and permissions
        </Link>
        .
      </Banner>
    </div>
  );
}
