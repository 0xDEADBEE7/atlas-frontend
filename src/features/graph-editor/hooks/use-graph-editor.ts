"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  type XYPosition,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import {
  label,
  validConnection,
  type Graph,
  type Metadata,
} from "@/domain/graph";
import { saveDraft } from "@/services/draft-storage";
import {
  edgeDefaults,
  toFlowNodes,
  toFlowEdges,
  fromFlow,
} from "@/features/graph-editor/flow/graph-adapter";
import type { Activity, FlowEdge } from "@/features/graph-editor/flow/types";

export function useGraphEditor(initial: Graph, initialDirty: boolean) {
  const initialNodes = useMemo(() => toFlowNodes(initial), [initial]);
  const initialEdges = useMemo(() => toFlowEdges(initial), [initial]);
  const [metadata, setMetadata] = useState(initial.metadata);
  const [nodes, setNodes, applyNodeChanges] =
    useNodesState<Activity>(initialNodes);
  const [edges, setEdges, applyEdgeChanges] =
    useEdgesState<FlowEdge>(initialEdges);
  const [selection, setSelection] = useState<{
    type: "node" | "edge";
    id: string;
  }>();
  const [status, setStatus] = useState(
    initialDirty ? "Unsaved changes" : "Changes stay in this browser",
  );
  const [dirty, setDirty] = useState(initialDirty);
  const onSelectionChange = useCallback(
    ({ nodes, edges }: { nodes: Activity[]; edges: FlowEdge[] }) => {
      setSelection(
        nodes[0]
          ? { type: "node", id: nodes[0].id }
          : edges[0]
            ? { type: "edge", id: edges[0].id }
            : undefined,
      );
    },
    [],
  );
  const selectedNode =
    selection?.type === "node"
      ? nodes.find((node) => node.id === selection.id)
      : undefined;
  const selectedEdge =
    selection?.type === "edge"
      ? edges.find((edge) => edge.id === selection.id)
      : undefined;
  const selectedData =
    selectedNode?.data.entity.data ??
    selectedEdge?.data?.entity.data ??
    metadata;

  function snapshot(): Graph {
    return fromFlow(initial, metadata, nodes, edges);
  }
  function changed() {
    setDirty(true);
    setStatus("Unsaved changes");
  }
  function save() {
    try {
      saveDraft(snapshot());
      setDirty(false);
      setStatus("Draft saved in this browser");
    } catch {
      setStatus("Could not save. Browser storage may be full or unavailable.");
    }
  }
  function applyMetadata(data: Metadata) {
    if (selectedNode)
      setNodes((items) =>
        items.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { entity: { ...node.data.entity, data } } }
            : node,
        ),
      );
    else if (selectedEdge)
      setEdges((items) =>
        items.map((edge) =>
          edge.id === selectedEdge.id
            ? {
                ...edge,
                label: label(data, ""),
                data: { entity: { ...edge.data.entity, data } },
              }
            : edge,
        ),
      );
    else setMetadata(data);
    changed();
  }
  function removeSelected() {
    if (selectedNode) {
      setNodes((items) => items.filter((node) => node.id !== selectedNode.id));
      setEdges((items) =>
        items.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id,
        ),
      );
    } else if (selectedEdge)
      setEdges((items) => items.filter((edge) => edge.id !== selectedEdge.id));
    setSelection(undefined);
    changed();
  }
  function addActivity(position: XYPosition) {
    const id = crypto.randomUUID();
    setNodes((items) => [
      ...items.map((node) => ({ ...node, selected: false })),
      {
        id,
        type: "activity",
        position,
        selected: true,
        data: {
          entity: { id, graphId: initial.id, data: { name: "New activity" } },
        },
      },
    ]);
    setEdges((items) => items.map((edge) => ({ ...edge, selected: false })));
    setSelection({ type: "node", id });
    changed();
  }
  function updateEndpoint(endpoint: "source" | "target", value: string) {
    if (!selectedEdge) return;
    const source = endpoint === "source" ? value : selectedEdge.source;
    const target = endpoint === "target" ? value : selectedEdge.target;
    if (!validConnection(source, target, snapshot().edges, selectedEdge.id)) {
      setStatus("Choose different activities without an existing connection.");
      return;
    }
    setEdges((items) =>
      items.map((edge) =>
        edge.id === selectedEdge.id ? { ...edge, source, target } : edge,
      ),
    );
    changed();
  }

  function clearSelection() {
    setSelection(undefined);
    setNodes((items) => items.map((node) => ({ ...node, selected: false })));
    setEdges((items) => items.map((edge) => ({ ...edge, selected: false })));
  }
  function onNodesChange(changes: NodeChange<Activity>[]) {
    applyNodeChanges(changes);
    if (
      changes.some(
        (change) => change.type === "position" || change.type === "remove",
      )
    )
      changed();
  }
  function onEdgesChange(changes: EdgeChange<FlowEdge>[]) {
    applyEdgeChanges(changes);
    if (changes.some((change) => change.type === "remove")) changed();
  }
  function isValidConnection(connection: Connection | FlowEdge) {
    return validConnection(
      connection.source,
      connection.target,
      snapshot().edges,
      "id" in connection ? connection.id : undefined,
    );
  }
  function connect(connection: Connection) {
    if (!isValidConnection(connection)) return;
    const id = crypto.randomUUID();
    setEdges((items) =>
      addEdge(
        {
          ...connection,
          id,
          ...edgeDefaults,
          data: {
            entity: {
              id,
              graphId: initial.id,
              sourceNodeId: connection.source,
              targetNodeId: connection.target,
              data: {},
            },
          },
        },
        items,
      ),
    );
    changed();
  }
  function reconnect(edge: FlowEdge, connection: Connection) {
    if (
      !validConnection(
        connection.source,
        connection.target,
        snapshot().edges,
        edge.id,
      )
    )
      return;
    setEdges((items) =>
      reconnectEdge(edge, connection, items, { shouldReplaceId: false }),
    );
    changed();
  }
  return {
    metadata,
    nodes,
    edges,
    selection,
    selectedNode,
    selectedEdge,
    selectedData,
    status,
    dirty,
    snapshot,
    save,
    applyMetadata,
    removeSelected,
    addActivity,
    updateEndpoint,
    clearSelection,
    onNodesChange,
    onEdgesChange,
    onSelectionChange,
    isValidConnection,
    connect,
    reconnect,
    selectNode: (id: string) => setSelection({ type: "node", id }),
    selectEdge: (id: string) => setSelection({ type: "edge", id }),
  };
}

export type GraphEditorController = ReturnType<typeof useGraphEditor>;
