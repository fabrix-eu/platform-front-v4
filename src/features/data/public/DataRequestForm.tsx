import { useMutation } from "@tanstack/react-query";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { type DataRequestParams, submitDataRequest } from "./api";
import { DATASETS } from "./datasets";

const FIELDS = ["name", "email", "organisation", "dataset", "purpose"];
const OPTIONS = DATASETS.map((dataset) => ({ value: dataset.key, label: dataset.label }));

function read(fd: FormData): DataRequestParams {
  const text = (key: string) => String(fd.get(key) ?? "").trim();
  return { name: text("name"), email: text("email"), organisation: text("organisation"), dataset: text("dataset"), purpose: text("purpose") };
}

/** Ask the FABRIX team for a dataset. No account: the answer comes by email. */
export function DataRequestForm() {
  const mutation = useMutation({ mutationFn: submitDataRequest });

  if (mutation.isSuccess) {
    return (
      <Banner tone="success" label="Sent">
        Your request reached the FABRIX team. They answer by email, usually within a few days.
      </Banner>
    );
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(read(new FormData(e.currentTarget)));
      }}
    >
      <FormError mutation={mutation} fields={FIELDS} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" mutation={mutation} />
        <Field label="Email" name="email" type="email" required autoComplete="email" mutation={mutation} />
      </div>
      <Field label="Organisation" name="organisation" placeholder="University, city, agency…" hint="Optional" autoComplete="organization" mutation={mutation} />
      <SelectField label="Which dataset" name="dataset" required placeholder="Choose a dataset" options={OPTIONS} mutation={mutation} />
      <TextareaField
        label="What for"
        name="purpose"
        required
        rows={4}
        placeholder="The question you are working on, the territory, the years, the form you need it in."
        mutation={mutation}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending…" : "Send the request"}
        </Button>
      </div>
    </form>
  );
}
