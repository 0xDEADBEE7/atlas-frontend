import assert from "node:assert/strict";
import test from "node:test";
import { validConnection } from "@/domain/graph";

test("connection editing rejects self-links and duplicates, but allows a reverse flow", () => {
  const edges = [{ id: "e1", sourceNodeId: "a", targetNodeId: "b" }];
  assert.equal(validConnection("a", "a", edges), false);
  assert.equal(validConnection("a", "b", edges), false);
  assert.equal(validConnection("b", "a", edges), true);
  assert.equal(validConnection("a", "c", edges), true);
  assert.equal(validConnection("a", "b", edges, "e1"), true);
  assert.equal(
    validConnection(
      "a",
      "b",
      [...edges, { id: "e2", sourceNodeId: "a", targetNodeId: "b" }],
      "e1",
    ),
    false,
  );
});
