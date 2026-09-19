import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useCurrentOrg } from "@/lib/activeOrg";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { compassFormQueryOptions, createAnswer, latestAnswerQueryOptions, updateAnswer, COMPASS_KEY } from "./api";
import { QuestionField } from "./QuestionField";
import { ResultPanel } from "./ResultPanel";
import { isVisible, type Responses } from "./visibility";

const answered = (value: unknown): boolean => {
  if (value == null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return true;
};

export function CompassFormPage() {
  const { orgSlug, formKey } = useParams({ from: "/_auth/$orgSlug/assessments/$formKey" });
  const { me } = useCurrentOrg();
  const membership = me.organizations.find((o) => o.organization_slug === orgSlug);
  const organizationId = membership?.organization_id ?? "";
  const queryClient = useQueryClient();

  const { data: form } = useSuspenseQuery(compassFormQueryOptions(formKey));
  const existing = useQuery({ ...latestAnswerQueryOptions(form.id, organizationId), enabled: !!organizationId });

  // The questionnaire is stateful by nature: answers drive which questions show, and
  // what is typed is saved on its own. The server stays the authority on status.
  const [responses, setResponses] = useState<Responses>({});
  const [loaded, setLoaded] = useState(false);
  const answerId = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastSaved = useRef<string | null>(null);

  useEffect(() => {
    if (loaded || existing.isPending) return;
    const known = existing.data?.responses ?? {};
    setResponses(known);
    answerId.current = existing.data?.id ?? null;
    // What the server already holds: opening a questionnaire must not re-save it.
    lastSaved.current = JSON.stringify(known);
    setLoaded(true);
  }, [existing.isPending, existing.data, loaded]);

  const save = useMutation({
    mutationFn: async (next: Responses) => {
      if (answerId.current) return updateAnswer(answerId.current, next);
      const created = await createAnswer({ form_id: form.id, organization_id: organizationId, responses: next });
      answerId.current = created.id;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPASS_KEY }),
  });

  // The mutation object changes identity on every render — including the ones a save
  // itself causes. Kept in a ref, it cannot make the effect below re-arm and save twice.
  const saveRef = useRef(save);
  saveRef.current = save;

  // Saved on its own, shortly after the last change, and only when something changed.
  useEffect(() => {
    if (!loaded) return;
    const payload = JSON.stringify(responses);
    if (payload === lastSaved.current) return;

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      lastSaved.current = payload;
      saveRef.current.mutate(responses);
    }, 900);
    return () => clearTimeout(timer.current);
  }, [responses, loaded]);

  const sections = useMemo(() => [...(form.sections ?? [])].sort((a, b) => a.position - b.position), [form.sections]);
  const visible = useMemo(
    () => sections.map((section) => ({ section, questions: [...section.questions].sort((a, b) => a.position - b.position).filter((q) => isVisible(q, responses)) })),
    [sections, responses],
  );
  const total = visible.reduce((sum, { questions }) => sum + questions.length, 0);
  const done = visible.reduce((sum, { questions }) => sum + questions.filter((q) => answered(responses[q.key])).length, 0);
  const complete = total > 0 && done === total;

  return (
    <>
      <Link to="/$orgSlug/assessments" params={{ orgSlug }} className="inline-flex items-center gap-1.5 text-fx-small font-bold text-fx-ink2 hover:text-fx-emphasis">
        <ArrowLeft aria-hidden className="size-4" />
        All questionnaires
      </Link>

      <PageHeader className="mt-4" eyebrow={membership?.organization_name} title={form.title} lede={form.description ?? undefined} />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge tone={complete ? "green" : "amber"}>
          {done} of {total} answered
        </Badge>
        <span className="text-fx-small text-fx-muted" aria-live="polite">
          {save.isPending ? "Saving…" : save.isError ? "Could not save — your answers stay on this page." : loaded && answerId.current ? "Saved" : "Nothing to save yet"}
        </span>
      </div>

      {save.isError && <Banner tone="danger" className="mt-4">The last change could not be saved. Check your connection and change something to try again.</Banner>}

      {/* The result sits beside the questions on a wide screen, and above them on a narrow
          one — where it is still the first thing read, which is the point. */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="order-2 space-y-8 lg:order-1">
        {visible.map(({ section, questions }) => (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <Eyebrow id={`section-${section.id}`}>{section.title}</Eyebrow>
            {section.description && <p className="mt-2 text-fx-small text-fx-muted">{section.description}</p>}

            <div className="mt-4 space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="p-5">
                  <p className="text-fx-body font-bold text-fx-ink">
                    {question.text}
                    {question.required && <span className="text-fx-rose"> *</span>}
                  </p>
                  {question.description && <p className="mt-1 text-fx-small text-fx-ink2">{question.description}</p>}
                  <div className="mt-4">
                    <QuestionField
                      question={question}
                      value={responses[question.key]}
                      onChange={(value) => setResponses((prev) => ({ ...prev, [question.key]: value }))}
                    />
                  </div>
                  {question.hint && <p className="mt-2 text-fx-small text-fx-muted">{question.hint}</p>}
                </Card>
              ))}
            </div>
          </section>
        ))}
        </div>

        <div className="order-1 lg:order-2">
          <ResultPanel answer={existing.data ?? null} done={done} total={total} complete={complete} />
        </div>
      </div>
    </>
  );
}
