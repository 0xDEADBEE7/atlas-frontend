import { createContext, useContext } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { label } from "@/domain/graph";
import type { Activity } from "@/features/graph-editor/flow/types";

export const OpenGraph = createContext<(id: string, name: string) => void>(
  () => {},
);

export function ActivityNode({ data, selected }: NodeProps<Activity>) {
  const open = useContext(OpenGraph);
  const { entity } = data;
  return (
    <div
      className={`w-[244px] rounded-[9px] border bg-white ${selected ? "border-[#4a8565] shadow-[0_0_0_3px_#5a94651a,0_4px_9px_#304a3710]" : "border-[#d6dfd6] shadow-[0_3px_5px_#304a3710]"}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        aria-label={`Connect to ${label(entity.data)}`}
      />
      <div className="flex items-center gap-[7px] px-4 pt-4 text-[8px] tracking-[1.15px] text-muted">
        <span className="text-[14px] tracking-normal text-[#659079]">
          {entity.childGraphId ? "⊞" : "▤"}
        </span>
        {entity.childGraphId ? "SUBPROCESS" : "ACTIVITY"}
      </div>
      <div className="px-4 pt-3 text-[15px] font-semibold tracking-[-.25px] wrap-anywhere">
        {label(entity.data)}
      </div>
      <p className="mx-4 mt-[7px] mb-[17px] min-h-[33px] text-[10px] leading-[1.65] wrap-anywhere text-muted">
        {typeof entity.data.description === "string"
          ? entity.data.description
          : "Add a description in properties."}
      </p>
      <div className="border-t border-[#edf0ea] px-4 py-[10px] text-[9px] text-muted">
        {entity.childGraphId ? (
          <button
            className="nodrag nopan w-full border-0 bg-transparent p-0 text-left text-[10px] text-[#477459]"
            onClick={() => open(entity.childGraphId!, label(entity.data))}
          >
            Open subprocess <span className="float-right">↗</span>
          </button>
        ) : (
          <span>
            {typeof entity.data.owner === "string"
              ? entity.data.owner
              : "Process activity"}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        aria-label={`Connect from ${label(entity.data)}`}
      />
    </div>
  );
}
