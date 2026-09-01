# Backend handoff

AppBlocks Web version 0.1 generates static browser software. The bundled showcase includes deterministic local interaction fixtures; it does not call a server, persist domain records or claim production authentication.

## Showcase boundary

The dashboard's `Create build` flow is intentionally local:

```text
Submit form
→ native client validation
→ short deterministic loading state
→ prepend a local table row
→ close dialog
→ expose Undo
```

Request shape:

```ts
type CreateBuildRequest = {
  project: string;
  target: "website" | "webapp" | "docs";
  notes?: string;
};
```

Expected real-service result:

```ts
type BuildRecord = {
  id: string;
  project: string;
  target: string;
  blocks: number;
  expansionRatio: number;
  status: "queued" | "building" | "passed" | "failed";
  createdAt: string;
};
```

## Production integration contract

A real adapter must provide:

- server-side validation of every submitted field;
- authenticated identity and authorization where records are private;
- idempotency or duplicate-submit protection;
- structured validation, permission, conflict and service errors;
- a durable create result;
- a documented undo/delete policy rather than assuming local row removal reverses the server operation;
- loading, error, retry and stale-data behavior visible in the generated surface.

## Recommended event sequence

```text
Trigger
→ client validation
→ disable duplicate submit
→ authenticated server request
→ server validation and authorization
→ durable mutation
→ replace optimistic/local record with returned record
→ announce success

Failure
→ preserve every entered field
→ map field errors next to controls
→ announce summary
→ expose retry or edit path
```

## Compiler integration point

Do not embed credentials or arbitrary request code in `.appblocks` files. A future backend adapter should be a reviewed, versioned block with declared permissions, request schema, response schema and error taxonomy. Until then, add conventional application code after compilation and record which compiler-owned files must not overwrite it.
