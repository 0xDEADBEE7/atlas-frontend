import type { Node, Edge } from "@xyflow/react";
import type { GraphNode, GraphEdge } from "@/domain/graph";

export type Activity = Node<{ entity: GraphNode }, "activity">;
export type FlowEdge = Edge<{ entity: GraphEdge }> & {
  data: { entity: GraphEdge };
};
