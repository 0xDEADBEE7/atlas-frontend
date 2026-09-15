import { label, type Metadata } from "@/domain/graph";

export function InspectorHeader({
  kind,
  data,
  id,
}: {
  kind: string;
  data: Metadata;
  id: string;
}) {
  return (
    <>
      <div className="flex items-center justify-between text-[9px] tracking-[1.25px] text-muted">
        <span>PROPERTIES</span>
        <span className="rounded bg-[#eef3ed] px-[6px] py-[3px] text-[9px] tracking-normal text-[#6d856f]">
          {kind}
        </span>
      </div>
      <h2 className="mt-[22px] mb-1 text-[16px] font-semibold wrap-anywhere">
        {label(data, kind)}
      </h2>
      <p className="mt-0 mb-[22px] text-[9px] wrap-anywhere text-muted">{id}</p>
    </>
  );
}
