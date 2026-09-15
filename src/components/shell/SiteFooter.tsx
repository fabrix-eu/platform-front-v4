const SITE = "https://www.fabrixproject.eu";

const LINKS = [
  { label: "About", href: `${SITE}/about` },
  { label: "News", href: `${SITE}/news` },
  { label: "Learning Hub", href: "https://learn.fabrixproject.eu" },
  { label: "Contact", href: `${SITE}/contact` },
];

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/101634457/" },
  { label: "Instagram", href: "https://www.instagram.com/fabrixproject/" },
];

const linkClass = "hover:text-fx-emphasis";

/**
 * The public footer. The logos and the funding acknowledgement match fabrixproject.eu
 * and were reviewed by the project officer: the FABRIX mark, the EU emblem with
 * "Funded by the European Union", and the grant disclaimer IN FULL — do not shorten
 * the disclaimer or drop either logo.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-fx-line bg-fx-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div>
            <img src="/fabrix-logo.svg" alt="FABRIX" className="h-6" />
            <p className="mt-3 max-w-sm text-fx-small text-fx-ink2">Fostering sustainable urban manufacturing in textile and clothing ecosystems.</p>
          </div>
          <nav aria-label="FABRIX project" className="flex flex-wrap gap-x-5 gap-y-2 text-fx-small font-bold text-fx-ink2 md:ml-auto">
            {[...LINKS, ...SOCIAL].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-fx-line pt-6 sm:flex-row">
          <img src="/flag-of-europe.svg" alt="Flag of Europe" className="h-9 w-auto flex-none self-start rounded-[3px]" />
          <div className="max-w-3xl">
            <p className="text-fx-small font-bold text-fx-ink">Funded by the European Union</p>
            <p className="mt-1.5 text-fx-small text-fx-muted">
              FABRIX has received funding from the European Union’s Horizon Europe Programme, under grant agreement No. 101135638. Views and
              opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or HaDEA.
              Neither the European Union nor the granting authority can be held responsible for them.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-fx-line pt-5 text-fx-small text-fx-muted">
          <a href={`${SITE}/privacy-policy`} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Privacy policy
          </a>
          <a href={`${SITE}/privacy-policy/cookies`} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Cookies policy
          </a>
          <span className="ml-auto">© {new Date().getFullYear()} FABRIX</span>
        </div>
      </div>
    </footer>
  );
}
