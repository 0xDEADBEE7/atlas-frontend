"use client";

import type { Graph } from "@/domain/graph";
import { useGraphEditor } from "@/features/graph-editor/hooks/use-graph-editor";
import { GraphCanvas } from "@/features/graph-editor/components/graph-canvas";
import { PropertiesPanel } from "@/features/graph-editor/components/properties-panel";
import {
  EditorHeader,
  type Breadcrumb,
} from "@/features/graph-editor/components/editor-header";
import { EditorStatus } from "@/features/graph-editor/components/editor-status";

export function GraphEditor({
  initial,
  initialDirty,
  path,
  onNavigate,
  onOpen,
}: {
  initial: Graph;
  initialDirty: boolean;
  path: Breadcrumb[];
  onNavigate: (index: number, graph: Graph, dirty: boolean) => void;
  onOpen: (id: string, name: string, graph: Graph, dirty: boolean) => void;
}) {
  const editor = useGraphEditor(initial, initialDirty);
  const openGraph = (id: string, name: string) =>
    onOpen(id, name, editor.snapshot(), editor.dirty);
  return (
    <>
      <EditorHeader
        path={path}
        metadata={editor.metadata}
        dirty={editor.dirty}
        nodeCount={editor.nodes.length}
        edgeCount={editor.edges.length}
        save={editor.save}
        onNavigate={(index) =>
          onNavigate(index, editor.snapshot(), editor.dirty)
        }
      />
      <div className="flex min-h-0 flex-1 max-[600px]:flex-col">
        <GraphCanvas editor={editor} onOpen={openGraph} />
        <PropertiesPanel
          editor={editor}
          graphId={initial.id}
          onOpen={openGraph}
        />
      </div>
      <EditorStatus dirty={editor.dirty} status={editor.status} />
    </>
  );
}
