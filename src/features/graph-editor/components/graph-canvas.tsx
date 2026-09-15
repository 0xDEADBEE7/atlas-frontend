import { edgeDefaults } from "@/features/graph-editor/flow/graph-adapter";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
} from "@xyflow/react";
import { SmartEdgeProvider } from "@tisoap/react-flow-smart-edge";
import { label } from "@/domain/graph";
import { OpenGraph } from "@/features/graph-editor/flow/activity-node";
import {
  nodeTypes,
  edgeTypes,
  routingOptions,
} from "@/features/graph-editor/flow/config";
import type { Activity, FlowEdge } from "@/features/graph-editor/flow/types";
import type { GraphEditorController } from "@/features/graph-editor/hooks/use-graph-editor";

const proOptions = { hideAttribution: true };
export function GraphCanvas({
  editor,
  onOpen,
}: {
  editor: GraphEditorController;
  onOpen: (id: string, name: string) => void;
}) {
  const { nodes, edges, onSelectionChange } = editor;
  const canvasRef = useRef<HTMLElement>(null);
  const [flow, setFlow] = useState<ReactFlowInstance<Activity, FlowEdge>>();
  function addAtCenter() {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds || !flow) return;
    editor.addActivity(
      flow.screenToFlowPosition({
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2,
      }),
    );
  }
  return (
    <section
      ref={canvasRef}
      className="relative min-w-0 flex-1 bg-surface max-[600px]:h-[480px] max-[600px]:flex-none"
      aria-label="Process canvas"
    >
      <div className="absolute top-5 left-[22px] z-5 flex items-center rounded-[7px] border border-border bg-white p-1 shadow-sm [&>button]:border-transparent">
        <Button onClick={addAtCenter}>＋ Add activity</Button>
        <span className="h-[18px] border-l border-border" />
        <Button variant="quiet" onClick={editor.clearSelection}>
          Process properties
        </Button>
      </div>
      <OpenGraph.Provider value={onOpen}>
        <SmartEdgeProvider nodes={nodes} options={routingOptions}>
          <ReactFlow
            proOptions={proOptions}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={edgeDefaults}
            onInit={setFlow}
            fitView
            fitViewOptions={{ padding: 0.22 }}
            minZoom={0.25}
            maxZoom={1.6}
            onSelectionChange={onSelectionChange}
            multiSelectionKeyCode={null}
            onNodesChange={editor.onNodesChange}
            onEdgesChange={editor.onEdgesChange}
            onNodeClick={(_, node) => editor.selectNode(node.id)}
            onEdgeClick={(_, edge) => editor.selectEdge(edge.id)}
            onPaneClick={editor.clearSelection}
            onNodeDoubleClick={(_, node) => {
              if (node.data.entity.childGraphId)
                onOpen(
                  node.data.entity.childGraphId,
                  label(node.data.entity.data),
                );
            }}
            isValidConnection={editor.isValidConnection}
            onConnect={editor.connect}
            onReconnect={editor.reconnect}
            deleteKeyCode={null}
          >
            <Background color="#d4ddd6" gap={22} size={1.2} />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              style={{ width: 126, height: 80 }}
              nodeColor="#dcebe3"
              maskColor="rgba(247,249,247,.7)"
            />
          </ReactFlow>
        </SmartEdgeProvider>
      </OpenGraph.Provider>
      {!nodes.length && (
        <div className="pointer-events-none absolute top-[40%] w-full text-center text-muted">
          <h2>A fresh canvas</h2>
          <p>Add an activity to start shaping this process.</p>
        </div>
      )}
      <div className="pointer-events-none absolute bottom-[19px] left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap text-muted max-[850px]:hidden [&_span]:mx-[9px]">
        Drag to arrange <span>·</span> Connect the dots <span>·</span> Scroll to
        zoom
      </div>
    </section>
  );
}
