"use client";

import { BaseEdge, StepEdge, type EdgeProps } from "@xyflow/react";
import { useSmartEdgePath } from "@tisoap/react-flow-smart-edge";
import { edgeMidpoint } from "@/lib/geometry/edge-midpoint";

export function SmartEdge(props: EdgeProps) {
  const { route } = useSmartEdgePath({ ...props, preset: "step" });
  if (!route || route.kind === "clear") return <StepEdge {...props} />;

  const center = edgeMidpoint([
    [props.sourceX, props.sourceY],
    ...route.points,
    [props.targetX, props.targetY],
  ]);
  return (
    <BaseEdge
      id={props.id}
      path={route.svgPathString}
      labelX={center.x}
      labelY={center.y}
      label={props.label}
      labelStyle={props.labelStyle}
      labelShowBg={props.labelShowBg}
      labelBgStyle={props.labelBgStyle}
      labelBgPadding={props.labelBgPadding}
      labelBgBorderRadius={props.labelBgBorderRadius}
      style={props.style}
      markerStart={props.markerStart}
      markerEnd={props.markerEnd}
      interactionWidth={props.interactionWidth}
    />
  );
}
