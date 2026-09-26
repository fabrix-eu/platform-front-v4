import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/claim-your-organisation/";

const AFTER = [
  ["Approved", "You become the profile's owner and it is marked claimed. You get an email; any other pending claim on the same profile is cancelled. Everything the profile already had — address, connections, listings a partner declared toward it — is now yours to complete."],
  ["Rejected", "You get an email with the reason. You can claim again with a better explanation, or write to the FABRIX team."],
  ["Meanwhile", "If you already belong to another organisation, your home page lists the claim as “being reviewed by the FABRIX team”. Otherwise there is nothing to watch: the answer comes by email."],
  ["Someone else claimed it first", "Only one owner is chosen. If the profile turns Managed before your claim is reviewed, ask its owners to add you: see Join an organisation."],
];

/** A how-to for the moment an organisation that is already on FABRIX becomes yours. */
export function ClaimYourOrganisation() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Many organisations are on FABRIX before anyone from them signs up: a partner added them, or the
        FABRIX team did. Such a profile is <strong>unclaimed</strong>. Claiming it makes you its owner,
        after the FABRIX team has checked that you belong there.
      </p>

      <Banner tone="info" label="Invited?" className="mt-6">
        If a partner added your organisation and gave your email, you received an invitation to claim it.
        The path is the same as below: sign up or sign in, find the profile, claim it. Mention the partner
        in your message — it makes the review immediate.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Find the profile">
          <p>
            Three places show it. When you sign up, the first step searches organisations and marks yours{" "}
            <strong>Claimable</strong> — pick it and your account is created with the claim (see{" "}
            <Link to="/manual/$page" params={{ page: "create-an-account" }} className={link}>
              Create an account
            </Link>
            ). Signed in, use <strong>Add an organisation</strong> from the organisation switcher, or open the
            profile from the <strong>Directory</strong>: an unclaimed one carries an <strong>Unclaimed</strong>{" "}
            badge next to its type.
          </p>
          <Figure src={`${SHOT}01-unclaimed-profile.png`} alt="An unclaimed organisation's profile: the Unclaimed badge and the Claim this profile button" caption="On the profile, the claim is the main button." />
        </Step>

        <Step n={2} title="Say who you are there">
          <p>
            Press <strong>Claim this profile</strong>. One field, <strong>Your role there</strong>: your
            position, what you do for the organisation, and a way to reach you — at least 20 characters. A
            person from the FABRIX team reads it, so write it for them. Press{" "}
            <strong>Send the claim</strong>.
          </p>
          <Figure src={`${SHOT}02-claim-dialog.png`} alt="The claim dialog: Your role there, with an example message, and Send the claim" />
        </Step>

        <Step n={3} title="Wait for the review">
          <p>
            The button turns into <em>Claim sent — the FABRIX team reviews it</em>. There is nothing else
            to do on the platform; the decision arrives by email, usually within a few working days.
          </p>
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">What happens next</Eyebrow>
      <FactList rows={AFTER} />

      <Banner tone="info" className="mt-10">
        Once the profile is yours, its six essentials are probably not all there:{" "}
        <Link to="/manual/$page" params={{ page: "complete-your-profile" }} className={link}>
          Complete your profile
        </Link>{" "}
        is the next chapter. To understand the two states a profile can be in, read{" "}
        <Link to="/manual/$page" params={{ page: "claimed-and-unclaimed" }} className={link}>
          Claimed and unclaimed
        </Link>
        .
      </Banner>
    </div>
  );
}
