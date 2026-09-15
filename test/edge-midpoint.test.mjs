import assert from "node:assert/strict";
import test from "node:test";
import { edgeMidpoint } from "@/lib/geometry/edge-midpoint";

test("labels sit halfway along uneven routed segments, not at the middle waypoint", () => {
  const points = [
    [0, 0],
    [10, 0],
    [10, 20],
    [210, 20],
  ];
  for (const path of [points, [...points].reverse()]) {
    const center = edgeMidpoint(path);
    assert.ok(Math.abs(center.x - 95) < 1e-9);
    assert.equal(center.y, 20);
  }
});

test("straight paths include handle segments and tolerate repeated waypoints", () => {
  assert.deepEqual(
    edgeMidpoint([
      [0, 0],
      [10, 0],
      [10, 0],
      [90, 0],
      [100, 0],
    ]),
    { x: 50, y: 0 },
  );
  assert.deepEqual(
    edgeMidpoint([
      [5, 8],
      [5, 8],
    ]),
    { x: 5, y: 8 },
  );
});
