import { Check, PenLine, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { OrganizationProfile } from "../types";
import { essentials } from "./completion";
import type { EditorSectionKey } from "./search";

function Ring({ done, total }: { done: number; total: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-16 shrink-0" role="img" aria-label={`${done} of ${total} essentials complete`}>
      <svg viewBox="0 0 60 60" className="size-16 -rotate-90">
        <circle cx="30" cy="30" r={radius} fill="none" strokeWidth="6" className="stroke-fx-line" />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - done / total)}
          className={cn("transition-[stroke-dashoffset]", done === total ? "stroke-fx-green" : "stroke-fx-emphasis")}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-fx-small font-bold text-fx-ink">
        {done} / {total}
      </span>
    </div>
  );
}

interface CompletionCardProps {
  org: OrganizationProfile;
  orgSlug: string;
  firstIncomplete?: EditorSectionKey;
}

export function CompletionCard({ org, orgSlug, firstIncomplete }: CompletionCardProps) {
  const items = essentials(org);
  const done = items.filter((i) => i.done).length;
  const left = items.length - done;
  const complete = left === 0;

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex flex-wrap items-start gap-5">
        <Ring done={done} total={items.length} />
        <div className="min-w-0 flex-1 basis-80">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-fx-heading text-fx-ink">{complete ? "Your profile is complete" : left <= 2 ? "Your profile is nearly complete" : "Let's finish your profile"}</h2>
            <Badge tone={complete ? "green" : "amber"}>{complete ? "Complete" : "Incomplete"}</Badge>
          </div>
          <p className="mt-1.5 text-fx-body text-fx-ink2">
            {complete
              ? "It appears properly in the Directory, counts in the local picture, and can post to the Marketplace."
              : `${left === 1 ? "One thing" : `${left === 2 ? "Two" : left} things`} left. A complete profile appears properly in the Directory, counts in the local picture, and can post to the Marketplace.`}
          </p>
          <p className="mt-1 text-fx-small text-fx-muted">
            The ring counts only the six essentials — finish those and it reaches 100%. Photos, extra detail and anything that doesn’t apply to you never count against it.
          </p>
        </div>
        {!complete && firstIncomplete && (
          <ButtonLink to="/$orgSlug/profile" params={{ orgSlug }} search={{ section: firstIncomplete }} resetScroll={false}>
            <PenLine className="size-4" />
            Finish your profile
          </ButtonLink>
        )}
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item.key}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-fx-small font-bold",
              item.done ? "bg-fx-green-soft text-fx-green" : "bg-fx-rose-soft text-fx-rose",
            )}
          >
            {item.done ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : <X aria-hidden className="size-3.5" strokeWidth={3} />}
            <span className="sr-only">{item.done ? "Done:" : "Missing:"}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </Card>
  );
}
