import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { IDLE_MUTATION } from "@/components/FieldError";
import { AuthShell, linkClass } from "@/features/auth/AuthShell";
import type { OrganizationDraft } from "../types";
import { OrgDetailsStep } from "../wizard/OrgDetailsStep";
import { OrgSearchStep } from "../wizard/OrgSearchStep";
import { StepProgress } from "../wizard/StepProgress";
import { AccountStep, type SignupChoice } from "./AccountStep";

type Step = "organisation" | "details" | "account";

const COPY: Record<Step, { title: string; lede: string; label: string }> = {
  organisation: {
    title: "Join FABRIX",
    lede: "Start with your organisation — it may already be on FABRIX, waiting for you to claim it.",
    label: "Your organisation",
  },
  details: { title: "Your organisation", lede: "What partners see when they find you.", label: "Its details" },
  account: { title: "Your account", lede: "The last step: how you sign in.", label: "Your account" },
};

// A wizard: its steps and the data collected along the way are local state until the
// last step sends everything in one request (the skill allows controlled state here).
export function RegisterPage() {
  const [step, setStep] = useState<Step>("organisation");
  const [choice, setChoice] = useState<SignupChoice>({ kind: "none" });
  const [draft, setDraft] = useState<Partial<OrganizationDraft>>({});

  const creating = step === "details" || choice.kind === "create";
  const total = creating ? 3 : 2;
  const current = step === "organisation" ? 1 : step === "details" ? 2 : total;

  const toAccount = (next: SignupChoice) => {
    setChoice(next);
    setStep("account");
  };

  return (
    <AuthShell
      wide
      title={COPY[step].title}
      lede={COPY[step].lede}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className={linkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <StepProgress step={current} total={total} label={COPY[step].label} />

      {step === "organisation" && (
        <OrgSearchStep
          onPick={(organization) => toAccount({ kind: organization.claimed ? "join" : "claim", organization })}
          onCreate={(name) => {
            setDraft((prev) => ({ ...prev, name }));
            setChoice({ kind: "none" });
            setStep("details");
          }}
          footer={
            <button type="button" onClick={() => toAccount({ kind: "none" })} className="text-fx-small font-bold text-fx-ink2 underline-offset-4 hover:text-fx-ink hover:underline">
              I'm not part of an organisation — just create my account
            </button>
          }
        />
      )}

      {step === "details" && (
        <OrgDetailsStep
          draft={draft}
          mutation={IDLE_MUTATION}
          submitLabel="Continue"
          onBack={() => setStep("organisation")}
          onSubmit={(next) => {
            setDraft(next);
            toAccount({ kind: "create", draft: next });
          }}
        />
      )}

      {step === "account" && <AccountStep choice={choice} onBack={() => setStep(choice.kind === "create" ? "details" : "organisation")} />}
    </AuthShell>
  );
}
