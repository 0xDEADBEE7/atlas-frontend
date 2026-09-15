import assert from "node:assert/strict";
import test from "node:test";
import { readDraft, saveDraft } from "@/services/draft-storage";

const graph = { id: "demo", metadata: { name: "Draft" }, nodes: [], edges: [] };
function memoryStorage(entries = []) {
  const values = new Map(entries);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("new saves use Polaris keys and take precedence over legacy drafts", () => {
  const storage = memoryStorage([["atlas:draft:demo", JSON.stringify(graph)]]);
  assert.deepEqual(readDraft("demo", storage), graph);
  const updated = { ...graph, metadata: { name: "Updated" } };
  saveDraft(updated, storage);
  assert.deepEqual(readDraft("demo", storage), updated);
});

test("invalid, mismatched, or inaccessible drafts are ignored", () => {
  for (const value of [
    "{broken",
    "null",
    JSON.stringify({ ...graph, id: "other" }),
    JSON.stringify({ ...graph, nodes: [{}] }),
    JSON.stringify({ ...graph, layout: { a: { x: "bad", y: 1 } } }),
  ]) {
    assert.equal(
      readDraft("demo", memoryStorage([["polaris:draft:demo", value]])),
      undefined,
    );
  }
  assert.equal(
    readDraft("demo", {
      getItem() {
        throw new Error("denied");
      },
    }),
    undefined,
  );
});

test("save failures propagate so the editor can report failure", () => {
  assert.throws(
    () =>
      saveDraft(graph, {
        setItem() {
          throw new Error("quota");
        },
      }),
    /quota/,
  );
});
