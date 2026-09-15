import { Select, FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { label } from "@/domain/graph";
import { MetadataForm } from "@/features/graph-editor/components/metadata-form";
import { InspectorHeader } from "@/features/graph-editor/components/inspector-header";
import type { GraphEditorController } from "@/features/graph-editor/hooks/use-graph-editor";

export function PropertiesPanel({
  editor,
  graphId,
  onOpen,
}: {
  editor: GraphEditorController;
  graphId: string;
  onOpen: (id: string, name: string) => void;
}) {
  const {
    selectedNode,
    selectedEdge,
    selectedData,
    selection,
    nodes,
    updateEndpoint,
    applyMetadata,
    removeSelected,
  } = editor;
  return (
    <aside
      className="w-[280px] shrink-0 overflow-auto border-l border-border bg-white px-[21px] py-[23px] min-[1550px]:w-[310px] min-[1550px]:p-[26px] max-[1100px]:w-[245px] max-[1100px]:p-[18px] max-[850px]:w-[235px] max-[600px]:w-full max-[600px]:border-t max-[600px]:border-l-0"
      aria-label="Properties inspector"
    >
      <InspectorHeader
        kind={
          selectedNode ? "Activity" : selectedEdge ? "Connection" : "Process"
        }
        data={selectedData}
        id={selectedNode?.id ?? selectedEdge?.id ?? graphId}
      />
      {selectedEdge && (
        <div>
          {(["source", "target"] as const).map((endpoint) => (
            <FormField
              key={endpoint}
              id={endpoint}
              label={endpoint === "source" ? "From" : "To"}
            >
              <Select
                id={endpoint}
                value={selectedEdge[endpoint]}
                onChange={(event) =>
                  updateEndpoint(endpoint, event.target.value)
                }
              >
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {label(node.data.entity.data)}
                  </option>
                ))}
              </Select>
            </FormField>
          ))}
        </div>
      )}
      <MetadataForm
        key={`${selection?.id ?? graphId}:${JSON.stringify(selectedData)}`}
        data={selectedData}
        onApply={applyMetadata}
      />
      {selectedNode?.data.entity.childGraphId && (
        <div className="mt-[23px] border-t border-border pt-[21px]">
          <span className="text-[9px] tracking-[1.1px] text-muted">
            DECOMPOSITION
          </span>
          <p className="my-[10px] text-[10px] leading-[1.65] text-muted">
            This activity contains a reusable subprocess.
          </p>
          <Button
            variant="secondary"
            onClick={() =>
              onOpen(
                selectedNode.data.entity.childGraphId!,
                label(selectedData),
              )
            }
          >
            Open subprocess ↗
          </Button>
        </div>
      )}
      {(selectedNode || selectedEdge) && (
        <div className="mt-[23px] border-t border-border pt-[21px]">
          <button
            className="mb-[13px] border-0 bg-transparent p-0 text-[11px] text-danger"
            onClick={removeSelected}
          >
            Delete {selectedNode ? "activity" : "connection"}
          </button>
          {selectedNode && (
            <p className="-mt-[6px] mb-[15px] text-[9px] leading-[1.6] text-muted">
              Also removes its incoming and outgoing connections.
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
