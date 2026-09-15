/** Find the halfway point by distance, rather than by waypoint count. */
export function edgeMidpoint(points: readonly (readonly number[])[]) {
  const lengths = points
    .slice(1)
    .map((point, index) =>
      Math.hypot(point[0] - points[index][0], point[1] - points[index][1]),
    );
  let remaining = lengths.reduce((sum, length) => sum + length, 0) / 2;
  for (let index = 0; index < lengths.length; index++) {
    const length = lengths[index];
    if (length > 0 && remaining <= length) {
      const ratio = remaining / length;
      return {
        x: points[index][0] + (points[index + 1][0] - points[index][0]) * ratio,
        y: points[index][1] + (points[index + 1][1] - points[index][1]) * ratio,
      };
    }
    remaining -= length;
  }
  return { x: points[0]?.[0] ?? 0, y: points[0]?.[1] ?? 0 };
}
