import { isGraph, type Graph } from "@/domain/graph";

type DraftStorage = Pick<Storage, "getItem" | "setItem">;
const draftKey = (id: string) => `polaris:draft:${id}`;

/** Storage access and malformed drafts must not prevent opening the server graph. */
export function readDraft(
  id: string,
  storage?: DraftStorage,
): Graph | undefined {
  try {
    const target = storage ?? window.localStorage;
    // Preserve drafts written before the Polaris rebrand.
    const raw =
      target.getItem(draftKey(id)) ?? target.getItem(`atlas:draft:${id}`);
    if (!raw) return;
    const value: unknown = JSON.parse(raw);
    return isGraph(value) && value.id === id ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Let callers report quota and permission errors rather than claiming a save succeeded. */
export function saveDraft(graph: Graph, storage?: DraftStorage) {
  (storage ?? window.localStorage).setItem(
    draftKey(graph.id),
    JSON.stringify(graph),
  );
}
