import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/reset-your-password/";

const TROUBLE = [
  ["No email", "Check the spam folder, and the address you typed: the page says “Check your inbox” whether or not an account exists with it, so a typo looks like success. Ask again with the right address."],
  ["Invalid link", "A reset link works once and for two hours. After that, the page says so and offers a new link."],
  ["Passwords do not match", "The form says which field is wrong, in place. Retype both."],
];

/** A how-to in two halves: locked out, or simply changing it while signed in. */
export function ResetYourPassword() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Two situations, two places. Locked out: ask for a reset link by email. Signed in and just wanting a
        new one: change it in your settings, with the old one.
      </p>

      <Eyebrow className="mt-10 mb-3">Locked out</Eyebrow>
      <ol className="flex flex-col gap-4">
        <Step n={1} title="Ask for a link">
          <p>
            On the sign-in page, follow <strong>Forgot password?</strong>. Type the email of your account and
            press <strong>Send reset link</strong>.
          </p>
          <Figure src={`${SHOT}01-forgot.png`} alt="The Forgot password page, with the email field filled" />
          <Figure src={`${SHOT}02-sent.png`} alt="Check your inbox: the page shown after asking for a link" caption="The same answer whether or not the address has an account — nobody can use this page to find out." />
        </Step>

        <Step n={2} title="Open the link and choose a new password">
          <p>
            The email carries a link to <em>Reset your password</em>. Type the new password twice and press{" "}
            <strong>Reset password</strong>. The link is good for two hours.
          </p>
          <Figure src={`${SHOT}03-reset.png`} alt="Reset your password: new password and confirmation" />
          <Figure src={`${SHOT}04-changed.png`} alt="Password changed: you can sign in with it now" caption="Done. Sign in with the new password." />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">Signed in</Eyebrow>
      <ol className="flex flex-col gap-4">
        <Step n={3} title="Change it from your settings">
          <p>
            Open the menu under your name, choose <strong>Settings</strong>, then in the <strong>Account</strong>{" "}
            tab find <strong>Password</strong>: current password, new password, twice. Press{" "}
            <strong>Change password</strong>.
          </p>
          <Figure src={`${SHOT}06-settings-password.png`} alt="The Password section of the account settings" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">If something goes wrong</Eyebrow>
      <FactList rows={TROUBLE} />
      <Figure src={`${SHOT}05-invalid.png`} alt="Invalid link: this password reset link is invalid or has expired, with a link to request a new one" />

      <Banner tone="info" className="mt-10">
        Your email address changes in the same place, next to the password — see{" "}
        <Link to="/manual/$page" params={{ page: "manage-notifications" }} className={link}>
          Manage notifications
        </Link>{" "}
        for the rest of the settings.
      </Banner>
    </div>
  );
}
