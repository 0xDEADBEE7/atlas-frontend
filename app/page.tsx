"use client";

import { useEffect, useState } from "react";

type Graph = {
  id: string;
  metadata: { name: string };
  nodes: { id: string; graphId: string; childGraphId?: string; data: { name: string } }[];
  edges: { id: string; sourceNodeId: string; targetNodeId: string }[];
};

export default function Home() {
  const [graph, setGraph] = useState<Graph>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/graphs/demo", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Unable to load process");
        return response.json();
      })
      .then(setGraph)
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, []);

  return <main>
    <header><strong>Atlas</strong><span>Process library</span></header>
    <p className="eyebrow">Sample process</p>
    <h1>{graph?.metadata.name ?? "Process overview"}</h1>
    {error ? <p role="alert">Unable to load this process. <button onClick={() => location.reload()}>Try again</button></p>
      : !graph ? <p role="status">Loading process…</p>
      : <>
        <section aria-label="Activities" className="activities">
          {graph.nodes.map(node => <article key={node.id}><h2>{node.data.name}</h2></article>)}
        </section>
        <h2>Sequence</h2>
        <ul>{graph.edges.map(edge => <li key={edge.id}>
          {graph.nodes.find(node => node.id === edge.sourceNodeId)?.data.name}
          {" → "}
          {graph.nodes.find(node => node.id === edge.targetNodeId)?.data.name}
        </li>)}</ul>
      </>}
  </main>;
}
