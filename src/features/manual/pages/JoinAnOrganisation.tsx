import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/join-an-organisation/";

const WAYS = [
  ["You ask", "From the organisation's public profile: Request to join, with a message. Its owners accept or decline; you are told either way."],
  ["They invite you", "An owner adds your email from their Team tab. With an account already, you are in at once, as a manager; otherwise you get an email and sign up."],
  ["At sign-up", "Picking a Managed organisation in the first step of Join FABRIX does not put you in it — it tells you to ask from the profile once signed in."],
];

/** A how-to for joining a team you did not create, and for living with several. */
export function JoinAnOrganisation() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        An organisation that is already managed has owners, and only they can add you. You ask from its
        profile; they answer from their Team tab. Once in, you act for it like any other member, and you can
        belong to as many organisations as you work for.
      </p>

      <Eyebrow className="mt-10 mb-3">Three ways in</Eyebrow>
      <FactList rows={WAYS} />

      <ol className="mt-10 flex flex-col gap-4">
        <Step n={1} title="Find the organisation and ask">
          <p>
            Open its profile from the <strong>Directory</strong> or a search. A managed profile shows{" "}
            <strong>Request to join</strong> next to Connect and Message. Write who you are and your role
            there — at least ten characters, and the owners read it before deciding. Press{" "}
            <strong>Send request</strong>.
          </p>
          <Figure src={`${SHOT}01-request.png`} alt="The Join dialog on a managed organisation's profile, with the message field" />
        </Step>

        <Step n={2} title="Wait for the owners">
          <p>
            The profile now shows <em>Join request pending</em>, and your own home page lists the request as
            waiting for its owners. The owners get a notification and an email. There is no way to withdraw
            a request; an ignored one simply stays pending.
          </p>
          <Figure src={`${SHOT}02-pending.png`} alt="The profile header with the Join request pending badge" />
          <Figure src={`${SHOT}03-banner.png`} alt="The home page banner listing the request as waiting for its owners" />
        </Step>

        <Step n={3} title="Once accepted, switch between your organisations">
          <p>
            Accepted, you get a notification and the organisation appears in the switcher at the top of the
            sidebar. Everything under the switcher — Profile, Compass, Connections, Messages, the home page —
            is about the organisation shown there. Pick another to act for it; the platform remembers your
            last choice.
          </p>
          <Figure src={`${SHOT}04-switcher.png`} alt="The organisation switcher open, listing two organisations and Add an organisation" caption="Listings, messages and events are posted in the name of the organisation selected here." />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">If it goes the other way</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        A declined request comes with the owners' reason, in the notification and by email. You can ask
        again with a better message, or write to the owners through <strong>Message</strong> on the profile
        — as one of your organisations, since messages travel between organisations.
      </p>

      <Banner tone="info" className="mt-10">
        Not on FABRIX yet, or unclaimed? Then nobody can add you: create it or claim it instead — see{" "}
        <Link to="/manual/$page" params={{ page: "claim-your-organisation" }} className={link}>
          Claim your organisation
        </Link>
        . And to leave a team you joined, use the ⋯ menu on your own row in its Team tab.
      </Banner>
    </div>
  );
}
