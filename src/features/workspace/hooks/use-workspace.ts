"use client";

import { useEffect, useRef, useState } from "react";
import type { Graph } from "@/domain/graph";
import { fetchGraph } from "@/services/graph-api";
import { readDraft } from "@/services/draft-storage";

const initialPath = [{ id: "demo", name: "Order fulfilment" }];
export function useWorkspace() {
  const [path, setPath] = useState(initialPath);
  const [attempt, setAttempt] = useState(0);
  const [graph, setGraph] = useState<Graph>();
  const [error, setError] = useState("");
  const [initialDirty, setInitialDirty] = useState(false);
  const drafts = useRef(new Map<string, { graph: Graph; dirty: boolean }>());
  const current = path[path.length - 1];

  useEffect(() => {
    const controller = new AbortController();
    setGraph(undefined);
    setError("");
    async function load() {
      try {
        const cached = drafts.current.get(current.id);
        if (cached) {
          setGraph(cached.graph);
          setInitialDirty(cached.dirty);
          return;
        }
        const original = await fetchGraph(current.id, controller.signal);
        const saved = readDraft(current.id);
        if (!controller.signal.aborted) {
          setGraph(saved ?? original);
          setInitialDirty(false);
        }
      } catch (cause) {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error ? cause.message : "Unable to load process.",
          );
      }
    }
    void load();
    return () => controller.abort();
  }, [current.id, attempt]);

  function navigate(nextPath: typeof path, draft: Graph, dirty: boolean) {
    drafts.current.set(draft.id, { graph: draft, dirty });
    setPath(nextPath);
  }

  return {
    path,
    graph,
    error,
    initialDirty,
    navigateTo: (index: number, graph: Graph, dirty: boolean) =>
      navigate(path.slice(0, index + 1), graph, dirty),
    openGraph: (id: string, name: string, graph: Graph, dirty: boolean) =>
      navigate([...path, { id, name }], graph, dirty),
    retry: () => setAttempt((value) => value + 1),
    goHome: () => {
      setPath(initialPath);
      setAttempt((value) => value + 1);
    },
  };
}
