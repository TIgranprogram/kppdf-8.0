# TZ-NX-ORG-REQUIRED-SHARED checklist

> Status: **DONE**
> Marker: archived at `tasks/_archive/2026-09/TZ-NX-ORG-REQUIRED-SHARED.done.md`

## Claim slot
- agent_id: freebuff
- claimed_at: 2026-09-19T13:00:00+03:00
- workspace: D:\kppdf-8.0
- team_room_claim: unavailable (continuous executor; no team-room CLI)

## Preflight Check Output
- **Context read:** `tasks/_ready/2026-09-19-org-required-create/TZ-NX-ORG-REQUIRED-SHARED.md`, `frontend-nx/libs/data-access/src/lib/organization/pi-organizations.service.ts`, `frontend-nx/libs/features/src/lib/doc-studio/studio-list.facade.ts`, `.agents/skills/kppdf-context-preflight/SKILL.md`
- **Key Constraints:** shared frontend helper; preserve Studio behavior; no BE/schema/seed/deploy; unrelated WIP excluded
- **Planned Deliverable:** add one exported Organization-empty message/check helper; migrate Studio facade; add focused helper regression coverage; run focused gates and build
- **Validation Path:** focused Jest, TypeScript, ESLint, `nx build kppdf-web`, Integrity slot

## Acceptance
- [x] One shared Organization-required message/check source of truth.
- [x] Studio create behavior remains unchanged and covered by regression tests.
- [x] No Organization seed, backend change, deploy, or unrelated WIP.

## Integrity slot (до READY / archive)
- [x] Тип изменения определён: other/shared frontend utility.
- [x] FIC: N/A beyond focused frontend helper; no new route/API/permission.
- [x] page.md / PAGE-TZ-INDEX: N/A; no route or page contract change.
- [x] DOMAIN-MAP / SECTION-READINESS: N/A; no domain route/module/status change.
- [x] Чужой WIP не в коммите; conflict keys соблюдены.
- [x] Coupling map: N/A; no persisted field semantics changed.
- [x] Канон: `docs/DOCS-INTEGRITY.md`.

## Build integrity
- [x] Baseline context checked; existing `a28a2423` Studio guard is green.
- [x] Closing `nx build kppdf-web` was the last gate, exit 0.

## Gates (fact)
- `cd frontend-nx && pnpm exec jest --config libs/data-access/jest.config.ts --runInBand libs/data-access/src/lib/organization/organization-required.spec.ts` — PASS, 3/3.
- `cd frontend-nx && pnpm exec eslint libs/data-access/src/lib/organization/organization-required.ts libs/data-access/src/lib/organization/organization-required.spec.ts libs/data-access/src/lib/organization/index.ts libs/features/src/lib/doc-studio/studio-list.facade.ts` — PASS, exit 0.
- `cd frontend-nx && pnpm exec tsc -p apps/kppdf-web/tsconfig.app.json --noEmit` — PASS, exit 0.
- `cd frontend-nx && pnpm exec nx build kppdf-web` — PASS, exit 0; pre-existing Angular/bundle budget warnings only.

## Executor report
- Added `ORGANIZATION_REQUIRED_MESSAGE` and `isOrganizationsEmpty` to `@kppdf/data-access`.
- Studio facade now consumes the shared helper/message without changing its UX.
- Focused helper tests cover empty, populated, incomplete, and missing fixtures.
- No BE, seed, deploy, wipe, or foreign dirty files changed.

## Closeout
- [x] archive + lock + remove active marker
- [x] Status = DONE
- closed_at: 2026-09-19T13:24:00+03:00
