import type { SmartEdgeProviderOptions } from "@tisoap/react-flow-smart-edge";
import { ActivityNode } from "@/features/graph-editor/flow/activity-node";
import { SmartEdge } from "@/features/graph-editor/flow/smart-edge";

export const nodeTypes = { activity: ActivityNode };
export const edgeTypes = { smart: SmartEdge };
export const routingOptions: SmartEdgeProviderOptions = {
  // Always route: a clear straight line does not guarantee a clear step path.
  routeOnlyWhenBlocked: false,
  routeWhileDragging: true,
  nodePadding: 12,
  gridRatio: 10,
};
