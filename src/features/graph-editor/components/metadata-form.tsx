import { Input, Textarea, FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { useId, useState, type FormEvent } from "react";
import { type Metadata } from "@/domain/graph";

export function MetadataForm({
  data,
  onApply,
}: {
  data: Metadata;
  onApply: (data: Metadata) => void;
}) {
  const fieldId = useId();
  const [error, setError] = useState("");
  const { name, description, ...extra } = data;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const metadata = JSON.parse(String(form.get("extra")));
      if (!metadata || Array.isArray(metadata) || typeof metadata !== "object")
        throw new Error();
      const name = String(form.get("name")).trim();
      if (!name) {
        setError("Enter a name.");
        return;
      }
      onApply({
        ...metadata,
        name,
        description: String(form.get("description")).trim(),
      });
      setError("");
    } catch {
      setError(
        'Enter valid JSON metadata, for example {"owner": "Operations"}.',
      );
    }
  }
  return (
    <form onSubmit={submit}>
      <FormField id={`${fieldId}-name`} label="Name">
        <Input
          id={`${fieldId}-name`}
          name="name"
          required
          defaultValue={typeof name === "string" ? name : ""}
          placeholder="Give it a name"
        />
      </FormField>
      <FormField id={`${fieldId}-description`} label="Description">
        <Textarea
          id={`${fieldId}-description`}
          name="description"
          rows={3}
          defaultValue={typeof description === "string" ? description : ""}
          placeholder="What happens here?"
        />
      </FormField>
      <FormField id={`${fieldId}-extra`} label="Additional metadata">
        <Textarea
          id={`${fieldId}-extra`}
          variant="code"
          name="extra"
          rows={6}
          defaultValue={JSON.stringify(extra, null, 2)}
          spellCheck={false}
        />
      </FormField>
      <p className="-mt-[6px] mb-[15px] text-[9px] leading-[1.6] text-muted">
        Add attributes such as owner or status as JSON.
      </p>
      {error && (
        <p role="alert" className="text-[11px] text-danger">
          {error}
        </p>
      )}
      <Button variant="secondary" type="submit">
        Apply changes
      </Button>
    </form>
  );
}
