export type Metadata = Record<string, unknown>;
export type GraphNode = {
  id: string;
  graphId: string;
  childGraphId?: string;
  data: Metadata;
};
export type GraphEdge = {
  id: string;
  graphId: string;
  sourceNodeId: string;
  targetNodeId: string;
  data: Metadata;
};
export type Graph = {
  id: string;
  metadata: Metadata;
  nodes: GraphNode[];
  edges: GraphEdge[];
  // Presentation state stays separate from the structural model.
  layout?: Record<string, { x: number; y: number }>;
};

export function label(data: Metadata, fallback = "Untitled") {
  return typeof data.name === "string" && data.name ? data.name : fallback;
}

export function validConnection(
  source: string,
  target: string,
  edges: GraphEdge[],
  except?: string,
) {
  return (
    source !== target &&
    !edges.some(
      (edge) =>
        edge.id !== except &&
        edge.sourceNodeId === source &&
        edge.targetNodeId === target,
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validate data at API/storage boundaries before rendering or editing it. */
export function isGraph(value: unknown): value is Graph {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !isRecord(value.metadata)
  )
    return false;
  if (!Array.isArray(value.nodes) || !Array.isArray(value.edges)) return false;
  const nodesValid = value.nodes.every(
    (node) =>
      isRecord(node) &&
      typeof node.id === "string" &&
      typeof node.graphId === "string" &&
      isRecord(node.data) &&
      (node.childGraphId === undefined ||
        typeof node.childGraphId === "string"),
  );
  const edgesValid = value.edges.every(
    (edge) =>
      isRecord(edge) &&
      typeof edge.id === "string" &&
      typeof edge.graphId === "string" &&
      typeof edge.sourceNodeId === "string" &&
      typeof edge.targetNodeId === "string" &&
      isRecord(edge.data),
  );
  const layoutValid =
    value.layout === undefined ||
    (isRecord(value.layout) &&
      Object.values(value.layout).every(
        (position) =>
          isRecord(position) &&
          typeof position.x === "number" &&
          Number.isFinite(position.x) &&
          typeof position.y === "number" &&
          Number.isFinite(position.y),
      ));
  return nodesValid && edgesValid && layoutValid;
}
