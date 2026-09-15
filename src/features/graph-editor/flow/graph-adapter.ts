import { MarkerType } from "@xyflow/react";
import { label, type Graph, type Metadata } from "@/domain/graph";
import type { Activity, FlowEdge } from "@/features/graph-editor/flow/types";

export const edgeDefaults = {
  type: "smart",
  markerEnd: { type: MarkerType.ArrowClosed, color: "#85978e" },
  style: { strokeWidth: 1.6, stroke: "#85978e" },
};

export function toFlowNodes(graph: Graph): Activity[] {
  return graph.nodes.map((entity, index) => ({
    id: entity.id,
    type: "activity",
    position: graph.layout?.[entity.id] ?? { x: index * 320, y: 120 },
    data: { entity },
  }));
}

export function toFlowEdges(graph: Graph): FlowEdge[] {
  return graph.edges.map((entity) => ({
    ...edgeDefaults,
    id: entity.id,
    source: entity.sourceNodeId,
    target: entity.targetNodeId,
    label: label(entity.data, ""),
    data: { entity },
  }));
}

/** Persist domain data and layout without leaking React Flow's transient UI state. */
export function fromFlow(
  graph: Graph,
  metadata: Metadata,
  nodes: Activity[],
  edges: FlowEdge[],
): Graph {
  return {
    ...graph,
    metadata,
    nodes: nodes.map((node) => node.data.entity),
    edges: edges.map((edge) => ({
      ...edge.data.entity,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
    })),
    layout: Object.fromEntries(nodes.map((node) => [node.id, node.position])),
  };
}
