"use client";

import { GraphEditor } from "@/features/graph-editor/graph-editor";
import { WorkspaceNavigation } from "@/features/workspace/components/workspace-navigation";
import { useWorkspace } from "@/features/workspace/hooks/use-workspace";
import { Button } from "@/components/ui/button";

export function Workspace() {
  const workspace = useWorkspace();
  return (
    <div className="flex h-dvh min-h-[600px] max-[600px]:h-auto max-[600px]:min-h-dvh">
      <WorkspaceNavigation />
      <main className="flex min-w-0 flex-1 flex-col max-[600px]:w-full">
        {workspace.graph ? (
          <GraphEditor
            key={workspace.graph.id}
            initial={workspace.graph}
            initialDirty={workspace.initialDirty}
            path={workspace.path}
            onNavigate={workspace.navigateTo}
            onOpen={workspace.openGraph}
          />
        ) : (
          <div className="m-auto p-10 text-center">
            {workspace.error ? (
              <>
                <h1>Process unavailable</h1>
                <p role="alert">{workspace.error}</p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button onClick={workspace.goHome}>Back to library</Button>
                  <Button onClick={workspace.retry}>Retry</Button>
                </div>
              </>
            ) : (
              <p role="status">Opening process…</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
