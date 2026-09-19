# TZ-NX-STUDIO-CREATE-REQUIRES-ORG checklist

> Status: **DONE**
> Marker: archived at `tasks/_archive/2026-09/TZ-NX-STUDIO-CREATE-REQUIRES-ORG.done.md`

## Claim slot
- agent_id: freebuff
- claimed_at: 2026-09-19T10:25:00+03:00
- workspace: D:\kppdf-8.0
- team_room_claim: unavailable (local executor)

## Preflight
- [x] `_NOW.md` + `tasks/_active/` checked; no conflicting claim.
- [x] TZ, Studio facade/page/spec, Organization API, toast API, and integrity contract read.
- [x] Claim slot filled before product code.

### Preflight Check Output
- Context: Studio list facade/page/spec, Organization service/types, toast service, required executor contracts.
- Constraints: no seed org, no BE/schema, no deploy/wipe; reuse `/registries/organizations`.
- Deliverable: empty-org guard, canonical RU message, actionable CTA, regression spec.
- Validation: focused Jest/ESLint/typecheck, then `nx build kppdf-web` last.

## Acceptance
- [x] Empty organizations prevents create POST/dialog and exposes CTA.
- [x] CTA navigates to `/registries/organizations`.
- [x] Existing non-empty organizations preserve the create flow.
- [x] No seed/backend/deploy/wipe.

## Integrity slot
- [x] Type = page/UI behavior.
- [x] Existing routes only; page/domain/readiness docs N/A.
- [x] Coupling map N/A.
- [x] Foreign WIP excluded.
- [x] `docs/DOCS-INTEGRITY.md` followed.

## Build integrity
- [x] No conflicting active kppdf-web task.
- [x] Closing `nx build kppdf-web` was the last gate.

## Gates
- [x] `pnpm exec jest --config apps/kppdf-web/jest.config.ts --runInBand apps/kppdf-web/src/app/pages/studio/studio-list.page.spec.ts` — PASS, 13/13.
- [x] `pnpm exec eslint apps/kppdf-web/src/app/pages/studio/studio-list.page.ts apps/kppdf-web/src/app/pages/studio/studio-list.page.spec.ts libs/features/src/lib/doc-studio/studio-list.facade.ts` — PASS, 0 errors.
- [x] `pnpm exec tsc -p apps/kppdf-web/tsconfig.app.json --noEmit` — PASS.
- [x] `pnpm exec nx build kppdf-web` — PASS, exit 0; existing Angular/bundle budget warnings only.
- [x] `git diff --check` — PASS.

## Executor report
- `StudioListFacade.create()` checks the existing Organization list before loading document types. Empty organizations produce the canonical RU toast and no document POST/dialog.
- Studio list renders a warning CTA “Создать фирму” routing to `/registries/organizations`.
- Existing non-empty flow remains unchanged.
- Product changes: `studio-list.facade.ts`, `studio-list.page.ts`, `studio-list.page.spec.ts`.
- Conflict disclosure: pre-existing dirty `_NOW.md`, `tasks/QUEUE-LIVE.md`, and untracked data/docs artifacts were not staged.

## Closeout
- [x] Archive + lock + `_NOW` update + remove active marker.
- closed_at: 2026-09-19T10:35:00+03:00
