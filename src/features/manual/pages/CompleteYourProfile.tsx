import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/complete-your-profile/";

const ESSENTIALS = [
  ["Name", "Section A. The name partners search for."],
  ["Address", "Section A, picked from the suggestions — the point on the map."],
  ["A way to contact you", "Section A: a website, a general email or a phone number. One is enough."],
  ["Your part in the making process", "Your organisation's type: producer, recycler, designer… Set when it was created."],
  ["One sector", "Section B. Not editable from the profile yet: it is set when the organisation is created, so a claimed profile may show it missing."],
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
        Your profile is edited in one place, section by section, and a ring at the top counts six
        essentials. Reach six and you appear properly in the Directory, count in the local picture, and
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
          <Figure src={`${SHOT}01-editor.png`} alt="The profile editor: three tabs, the completion ring at 4 of 6, and the six essentials marked done or missing" caption="Finish your profile opens the first section that still has something missing." />
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
            Name and description, the address picked from suggestions, then contacts: website, general
            email, phone, LinkedIn, Instagram. Below, what kind of organisation you are (company, non-profit,
            cooperative…), its legal form and VAT number. The section is public; the legal form and the VAT
            number are not displayed on your page. Press <strong>Save identity</strong> at the bottom.
          </p>
          <Figure src={`${SHOT}03-identity.png`} alt="The Identity section open: name, description, address, contacts, kind, legal form and VAT number" />
        </Step>

        <Step n={4} title="C · Size &amp; reach">
          <p>
            How many people work here, how long you have been going, and a yearly turnover band. These are
            private: the Directory only ever uses the size band, and the Compass uses them to compare you
            with organisations like yours.
          </p>
          <Figure src={`${SHOT}04-size-reach.png`} alt="The Size & reach section open: number of people, development stage, turnover band" />
        </Step>

        <Step n={5} title="Photos &amp; media">
          <p>
            A logo, a banner, and a gallery of photos with a caption each — JPG, PNG or WebP. This section
            does not count in the ring, but it is the first thing a partner looks at. Make sure people shown
            in a photo agree to be there.
          </p>
          <Figure src={`${SHOT}05-photos.png`} alt="The Photos & media section open: logo, banner and gallery" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The six essentials</Eyebrow>
      <FactList rows={ESSENTIALS} />

      <Eyebrow className="mt-12 mb-3">What the badges mean</Eyebrow>
      <FactList rows={STATUSES} />

      <Banner tone="info" label="Not yet editable" className="mt-10">
        <strong>B · What you do</strong> and <strong>E · Certifications</strong> show what you set when the
        organisation was created and cannot be changed from the editor yet. If yours is wrong, write to the
        FABRIX team. The vocabulary itself is in{" "}
        <Link to="/manual/$page" params={{ page: "what-you-do" }} className={link}>
          What you do
        </Link>
        .
      </Banner>

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
