import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/create-an-account/";

const PATHS = [
  ["Claimable", "The organisation is on FABRIX, added by a partner or by the FABRIX team, and nobody manages it. Your account asks to claim it; the FABRIX team reviews the request."],
  ["Managed", "Someone already manages it. You get a plain account. Once signed in, open the organisation's profile and use Request to join — its owners accept you."],
  ["Create “…”", "It is not on FABRIX. You enter its details, and you are its owner from the start."],
  ["Just my account", "You are not part of an organisation: a researcher, a student, a city officer. You get a viewer account, which can read the platform and its Data page but not post."],
];

/** A how-to: the one form, its three paths, and what each one leads to. */
export function CreateAnAccount() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Sign-up starts with your organisation, not with you. The first step decides which of four paths you
        are on; the last step is always the same account form. It takes two or three minutes.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Open Join FABRIX">
          <p>
            Press <strong>Get started</strong> on any public page, or open <em>/register</em>. Type your
            organisation's name — two letters are enough for results to appear.
          </p>
          <Figure src={`${SHOT}01-organisation.png`} alt="Join FABRIX, step 1 of 2: the organisation search with a Claimable result, a Create row and the just-my-account link" caption="Step 1. Every result carries a badge; the dashed row creates; the link at the bottom skips the organisation." />
        </Step>

        <Step n={2} title="Pick your path">
          <FactList rows={PATHS} />
          <p>
            Choosing an organisation that is <strong>Managed</strong> does not put you in it. The form says so
            and lets you carry on; the joining happens later, from its profile.
          </p>
          <Figure src={`${SHOT}03-managed.png`} alt="The summary shown after picking a managed organisation: someone already manages this profile" />
        </Step>

        <Step n={3} title="If you create it: its details">
          <p>
            The wizard grows to three steps. <strong>Organisation name</strong>, its <strong>Type</strong>,
            and its <strong>Address</strong> picked from the suggestions — the address is required, because
            it is what puts you on the map. <strong>What you do</strong> can wait; it is editable later.
          </p>
          <Figure src={`${SHOT}04-details.png`} alt="Step 2 of 3, Its details: organisation name, type and address" />
        </Step>

        <Step n={4} title="Your account">
          <p>
            <strong>Your name</strong>, your <strong>Email</strong>, a <strong>Password</strong> twice. The
            card above the fields repeats which path you are on. Press <strong>Create account</strong>.
          </p>
          <Figure src={`${SHOT}02-account-claim.png`} alt="The account step, with the claimed organisation summarised above the name, email and password fields" caption="Here, the claim path: the banner says the FABRIX team will check the request." />
        </Step>

        <Step n={5} title="Confirm your email">
          <p>
            Creating the account does not sign you in. We send a verification email; open the link inside to
            confirm the address is yours, then sign in with the email and password you chose.
          </p>
          <Figure src={`${SHOT}06-check-inbox.png`} alt="Check your inbox: the page shown after creating the account" />
          <Figure src={`${SHOT}07-verified.png`} alt="Email verified: your account is active, you can sign in now" caption="After the link. Sign in with the email and password you chose." />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">If something goes wrong</Eyebrow>
      <FactList
        rows={[
          ["The email never came", "Check the spam folder first. There is no button to send it again yet — write to the FABRIX team, who can confirm the address for you."],
          ["The link says Invalid", "Verification links expire. Ask the FABRIX team for a new one."],
          ["Wrong organisation", "A claim on the wrong profile can be left to be rejected; a created organisation can be given back later from its Team tab."],
        ]}
      />

      <Banner tone="info" className="mt-10">
        Created your organisation? The next thing to do is{" "}
        <Link to="/manual/$page" params={{ page: "complete-your-profile" }} className={link}>
          complete its profile
        </Link>
        . Claimed one? The FABRIX team writes to you when it is approved — meanwhile, read{" "}
        <Link to="/manual/$page" params={{ page: "claimed-and-unclaimed" }} className={link}>
          Claimed and unclaimed
        </Link>
        .
      </Banner>
    </div>
  );
}
