import { Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/complete-your-profile/";

const ESSENTIALS = [
  ["Name", "Section A. The name partners search for."],
  ["Address", "Section A, picked from the suggestions — the point on the map."],
  ["A way to contact you", "Section A: a website, a general email or a phone number. One is enough."],
  ["Your part in the making process", "Section B: where you sit in the value chain, how you support it — or that you only support."],
  ["How many people work here", "Section C. The number stays private; only the EU size band it falls in is used."],
];

const STATUSES = [
  ["Complete", "Every field the ring watches in that section is filled."],
  ["Partially complete", "Some are. Open it to see which."],
  ["Not started", "Nothing yet."],
  ["Private", "Never public and never counted — the Assessment, which lives in the Compass."],
];

/** A how-to for the editor: what the ring counts, what each section holds, what stays private. */
export function CompleteYourProfile() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Your profile is edited in one place, section by section, and a ring at the top counts five
        essentials. Reach five and you appear properly in the Directory, count in the local picture, and
        can post to the Marketplace. Everything else is portrait: it sharpens who finds you, and never counts
        against you.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Open the editor">
          <p>
            In the sidebar, under your organisation's name, choose <strong>Profile</strong>. Three tabs:{" "}
            <strong>Edit profile</strong>, <strong>Team</strong>, <strong>Public view</strong>. The first
            opens on the ring and the list of what is done and what is missing.
          </p>
          <Figure src={`${SHOT}01-editor.png`} alt="The profile editor: three tabs, the completion ring, and the five essentials marked done or missing" caption="Finish your profile opens the first section that still has something missing." />
        </Step>

        <Step n={2} title="Do the required sections first">
          <p>
            Sections are grouped: <strong>Required to go live</strong> (A, B, C), then{" "}
            <strong>Build your portrait</strong> (D, E, photos), then <strong>Optional &amp; private</strong>{" "}
            (F). Each carries a status badge; open one by clicking its title, and the page remembers which
            one is open.
          </p>
          <Figure src={`${SHOT}02-sections.png`} alt="The full list of sections with their status badges, in three groups" />
        </Step>

        <Step n={3} title="A · Identity">
          <p>
            Name, a one-line summary and the longer story, the address picked from suggestions — with the
            site name if you are one site of a larger organisation — then contacts: website, general email,
            phone, LinkedIn, Instagram. Below, what kind of organisation you are (company, non-profit,
            cooperative…), the year it started, and your registration and VAT numbers — or that you have
            neither, which is an answer too. Press <strong>Save identity</strong> at the bottom.
          </p>
          <Figure src={`${SHOT}03-identity.png`} alt="The Identity section open: name, description, address, contacts, legal form and VAT number" />
        </Step>

        <Step n={4} title="B · What you do">
          <p>
            Where you sit in the value chain — from raw materials to collection and recovery — and how you
            support others who make things, then the materials you work with. The Directory filters on your
            place in the chain, and your badge shows it, so the more precise the better. All are public.
          </p>
          <Figure src={`${SHOT}06-what-you-do.png`} alt="The What you do section open: the stages of the value chain, the supporting roles, then the materials" />
        </Step>

        <Step n={5} title="C · Size &amp; reach">
          <p>
            How many people work here and in full-time equivalent, how long you have been going, a yearly
            turnover band, and how far your customers reach. These are
            private: the Directory only ever uses the size band, and the Compass uses them to compare you
            with organisations like yours.
          </p>
          <Figure src={`${SHOT}04-size-reach.png`} alt="The Size & reach section open: people, full-time equivalent, development stage, turnover band, customer reach" />
        </Step>

        <Step n={6} title="D · Offers &amp; needs">
          <p>
            Two lists: what you offer, and what you are looking for. <strong>Add an offer</strong> and{" "}
            <strong>Add a need</strong> open the listing form with the side already chosen; each one goes on
            the Marketplace as a listing, and can be edited or deleted from here. Nothing in this section is
            private: it holds only what you publish. The fields are in{" "}
            <Link to="/manual/$page" params={{ page: "listing-fields" }} className={link}>
              Listing fields
            </Link>
            .
          </p>
          <Figure src={`${SHOT}08-offers-needs.png`} alt="The Offers & needs section open: the offers with their activity badge, then the needs" />
        </Step>

        <Step n={7} title="E · Certifications">
          <p>
            The common certifications and standards as choices, and any other one typed in below.{" "}
            <strong>None</strong> is an answer too, and clears the others. Press{" "}
            <strong>Save certifications</strong>.
          </p>
          <Figure src={`${SHOT}09-certifications.png`} alt="The Certifications section open: the common certifications as choices, then Another one" />
        </Step>

        <Step n={8} title="Photos &amp; media">
          <p>
            A gallery of photos with a caption each — JPG, PNG or WebP — links to videos hosted elsewhere,
            a logo and a banner. Each part saves on its own. This section does not count in the ring, but it
            is the first thing a partner looks at. Make sure people shown in a photo agree to be there.
          </p>
          <Figure src={`${SHOT}05-photos.png`} alt="The Photos & media section open: gallery, videos, logo and banner" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The five essentials</Eyebrow>
      <FactList rows={ESSENTIALS} />

      <Eyebrow className="mt-12 mb-3">What the badges mean</Eyebrow>
      <FactList rows={STATUSES} />

      <p className="mt-10 text-fx-body text-fx-ink2">
        The vocabulary of section B is in{" "}
        <Link to="/manual/$page" params={{ page: "what-you-do" }} className={link}>
          What you do
        </Link>
        .
      </p>

      <Eyebrow className="mt-12 mb-3">Check the result</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        The <strong>Public view</strong> tab shows your profile as a visitor sees it, with the Connect and
        Message buttons disabled. What is listed as public and private, field by field, is in{" "}
        <Link to="/manual/$page" params={{ page: "your-profile" }} className={link}>
          Your profile
        </Link>
        .
      </p>
      <Figure src={`${SHOT}07-public-view.png`} alt="The Public view tab: the profile as a visitor sees it" />
    </div>
  );
}
