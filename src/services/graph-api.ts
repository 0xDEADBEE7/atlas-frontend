import { isGraph } from "@/domain/graph";

export async function fetchGraph(id: string, signal?: AbortSignal) {
  const response = await fetch(`/api/graphs/${encodeURIComponent(id)}`, {
    signal,
  });
  if (!response.ok)
    throw new Error("This process could not be opened. Please try again.");
  const graph: unknown = await response.json();
  if (!isGraph(graph) || graph.id !== id)
    throw new Error("The server returned an invalid process.");
  return graph;
}
