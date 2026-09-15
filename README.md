# Polaris frontend

Next.js static export with a React Flow process canvas. From the parent workspace,
run `make dev` and open http://localhost:3000. Run `make` here for service targets.
Compose development uses Webpack with file polling for reliable reloads across
Docker VM mounts; production still uses the default Next.js static build.
Compose mounts `src/` at `/app/src`; it must not mount or create a root `app/`
directory, which would shadow `src/app`. Missing source mounts fail explicitly.
Restart `make dev` after config changes; dependency changes require its image rebuild.

## Try the canvas

- Drag activities to arrange them. Drag the background to pan, scroll to zoom,
  or use the zoom/fit controls and minimap.
- Connect an activity's right dot to another activity's left dot. Self-links and
  duplicate connections are rejected in this view.
- Connections use orthogonal smart routing around activities and update while
  activities move. While a route is pending, or if no route can be found (such
  as overlapping activities), the library displays a standard step edge.
- Select a connection to change its **From / To** endpoints in the inspector,
  or drag an endpoint to reconnect it. Existing edge IDs and metadata are retained.
- Select an activity or connection to edit its name, description, and JSON metadata.
  Click **Apply changes**, then **Save draft** to keep the graph in this browser.
- Add activities with the toolbar. Delete them from the inspector; their attached
  connections are also removed.
- Open **Prepare order** to explore its child process. Breadcrumbs return to the
  parent and preserve applied edits during navigation.
- Select **Process properties** (or click the background) to inspect the graph itself.

**Save draft** saves only the current graph to localStorage on this origin. Save
each edited process before reloading. Unapplied form edits are discarded when
changing selection. There is no backend persistence, undo history, or multi-user
editing yet. To restore the original examples, remove this site's `polaris:draft:*`
localStorage entries in browser developer tools and reload. Drafts from before
the rebrand remain readable through the legacy `atlas:draft:*` keys; remove those
as well when resetting old drafts. New saves use `polaris:draft:*`.

## Structure

```text
src/
  app/                       Next.js route entry points and global styles
  domain/graph.ts             Graph types, validation, and connection rules
  lib/geometry/              Pure path calculations, independent of React
  services/                  API requests and browser draft storage
  components/ui/             Shared buttons and accessible form controls
  features/
    workspace/               Process loading, navigation, and workspace shell
      hooks/                 Loading lifecycle and in-memory draft cache
      components/            Workspace navigation
    graph-editor/            Graph editor composition
      hooks/                 Editing state, selection, and commands
      components/            Canvas, metadata form, properties, header, status
      flow/                  React Flow adapter, node/edge renderers, routing
```

### Dependency boundaries

Use `@/` imports for application modules (for example `@/domain/graph`).
`tsconfig.json` maps `@/*` to `src/*`; Next.js, Playwright, and the unit-test
runner share this mapping. Unit tests use Node with the `tsx` loader.

- `src/app/` composes features. Keep business logic and reusable components out of route files.
- `domain/` and `lib/` are pure TypeScript. They do not import React, browser APIs,
  services, or feature components. Geometry belongs here, not in a `views` folder.
- `services/` owns I/O and validates incoming data. Components do not fetch graphs
  or access localStorage directly. Failed saves propagate to the editor's status.
- Feature hooks coordinate state and commands; components render it. The canvas
  owns its DOM ref and viewport; the editor hook accepts graph-space positions.
- `flow/graph-adapter.ts` converts between the domain model and React Flow.
  Snapshots preserve IDs and metadata while excluding transient selection,
  measurements, and routing state. Alternative graph renderers can use the same
  domain model without depending on React Flow's types.
- Shared UI has no feature dependencies. Extract controls when multiple callers
  share behavior or styling; keep one-off graph rendering within its feature.
- `GraphEditor` is the feature entry point. Its internal controller type stays
  within that feature; the workspace passes graphs and navigation callbacks.

### Styling

[Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
v4 runs through PostCSS. Component markup uses utilities; `src/app/globals.css`
defines shared theme colors, a 4px spacing scale, and base styles. Button variants
and form control styles live with their shared components.

`flow/react-flow.css` contains only overrides for DOM generated by React Flow.
Keep these vendor selectors separate from application styling. React Flow supplies
dragging, pan/zoom, selection, and connection handles; see its
[connection editing documentation](https://reactflow.dev/examples/edges/reconnect-edge).
[React Flow Smart Edge](https://github.com/tisoap/react-flow-smart-edge) supplies
node-aware routing with live node positions and measured sizes. Labels use the
halfway distance along the route, calculated by `lib/geometry/edge-midpoint.ts`.

## Checks

Run these commands from `frontend/` with Node 24 and dependencies installed:

- `npm test`: TypeScript plus domain, geometry, graph-adapter, and draft-storage tests.
- `npm run build`: production static export.
- `npm run format:check`: check consistent formatting; `npm run format` applies it.
- `npx playwright install chromium` once, then `npm run test:e2e`: browser checks for
  editing, saving/reloading, subprocess navigation, deletion, and responsive layout.
  Playwright starts a local Next.js server on port 3100 and intercepts API calls
  using the backend's sample JSON fixtures, so no backend service is required.

`make test` runs the TypeScript and unit checks in Docker; `make build` verifies
and packages the static export. Browser checks run separately with Playwright.
