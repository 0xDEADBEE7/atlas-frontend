import assert from "node:assert/strict";
import test from "node:test";
import {
  toFlowNodes,
  toFlowEdges,
  fromFlow,
} from "@/features/graph-editor/flow/graph-adapter";

const graph = {
  id: "demo",
  metadata: { name: "Example" },
  nodes: ["a", "b", "c"].map((id) => ({
    id,
    graphId: "demo",
    data: { name: id },
  })),
  edges: [
    {
      id: "edge",
      graphId: "demo",
      sourceNodeId: "a",
      targetNodeId: "b",
      data: { name: "Approved", owner: "Ops" },
    },
  ],
  layout: { a: { x: 25, y: 30 } },
};

test("conversion preserves layout and smart edge labels", () => {
  assert.deepEqual(toFlowNodes(graph)[0].position, graph.layout.a);
  assert.deepEqual(toFlowNodes(graph)[1].position, { x: 320, y: 120 });
  assert.equal(toFlowEdges(graph)[0].type, "smart");
  assert.equal(toFlowEdges(graph)[0].label, "Approved");
});

test("snapshots persist edited endpoints and positions without transient UI state", () => {
  const nodes = toFlowNodes(graph);
  nodes[0] = {
    ...nodes[0],
    selected: true,
    dragging: true,
    position: { x: 88, y: 99 },
  };
  const edges = toFlowEdges(graph);
  edges[0] = { ...edges[0], target: "c", selected: true };
  const snapshot = fromFlow(graph, graph.metadata, nodes, edges);
  assert.deepEqual(snapshot.edges[0], { ...graph.edges[0], targetNodeId: "c" });
  assert.deepEqual(snapshot.layout.a, { x: 88, y: 99 });
  assert.deepEqual(snapshot.nodes, graph.nodes);
  assert.equal("selected" in snapshot.edges[0], false);
});
