import { Button } from "@/components/ui/button";
import { label, type Metadata } from "@/domain/graph";

export type Breadcrumb = { id: string; name: string };
export function EditorHeader({
  path,
  metadata,
  dirty,
  nodeCount,
  edgeCount,
  save,
  onNavigate,
}: {
  path: Breadcrumb[];
  metadata: Metadata;
  dirty: boolean;
  nodeCount: number;
  edgeCount: number;
  save: () => void;
  onNavigate: (index: number) => void;
}) {
  return (
    <>
      {" "}
      <header className="flex h-[62px] shrink-0 items-center justify-between border-b border-border px-[30px] max-[1100px]:px-5 max-[600px]:px-4">
        <nav
          className="flex flex-wrap items-center gap-3 text-[11px] text-muted"
          aria-label="Breadcrumb"
        >
          <span>Process library</span>
          {path.map((item, index) => (
            <span key={`${item.id}-${index}`}>
              /{" "}
              <button
                className="ml-2 border-0 bg-transparent text-[11px] text-ink"
                onClick={() => onNavigate(index)}
              >
                {index === path.length - 1 ? label(metadata) : item.name}
              </button>
            </span>
          ))}
        </nav>
        <span className="grid size-[29px] place-items-center rounded-full border border-[#d9e2d7] bg-[#e9eee7] text-[9px] font-semibold">
          PO
        </span>
      </header>
      <section className="flex items-center justify-between gap-6 px-[30px] pt-[27px] pb-6 max-[1100px]:px-5 max-[600px]:items-start max-[600px]:px-4 max-[600px]:py-5">
        <div>
          <div className="flex items-center gap-3 max-[600px]:flex-wrap">
            <h1>{label(metadata)}</h1>
            <span className="rounded-[5px] border border-[#ebe6d5] bg-[#f3f0e3] px-[7px] py-[3px] text-[10px] text-[#8a7333]">
              {typeof metadata.status === "string" ? metadata.status : "Draft"}
            </span>
          </div>
          <p className="mt-[9px] text-[11px] leading-[1.6] text-muted">
            {typeof metadata.description === "string"
              ? metadata.description
              : "Build a shared picture of how work happens."}
          </p>
        </div>
        <Button variant="primary" onClick={save}>
          Save draft{dirty ? " •" : ""}
        </Button>
      </section>
      <div className="flex h-11 shrink-0 items-stretch justify-between border-b border-border px-[30px] max-[600px]:px-4">
        <span className="flex items-center border-b-2 border-[#3c7256] text-[11px] font-semibold">
          ⌘ &nbsp; Process canvas
        </span>
        <span className="self-center text-[10px] text-muted [&_span]:mx-2">
          {nodeCount} activities <span>·</span> {edgeCount} connections
        </span>
      </div>
    </>
  );
}
