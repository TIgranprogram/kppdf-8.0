# TZ-NX-PROPOSALS-CREATE-REQUIRES-ORG checklist

> Status: **DONE**
> Marker: `tasks/_active/TZ-NX-PROPOSALS-CREATE-REQUIRES-ORG.md`

## Claim slot
- agent_id: freebuff
- claimed_at: 2026-09-19T13:28:00+03:00
- workspace: D:\kppdf-8.0
- team_room_claim: unavailable (continuous executor; no team-room CLI)

## Preflight Check Output
- **Context read:** `tasks/_ready/2026-09-19-org-required-create/TZ-NX-PROPOSALS-CREATE-REQUIRES-ORG.md`, `frontend-nx/libs/features/src/lib/proposals/proposals-list.facade.ts`, `frontend-nx/apps/kppdf-web/src/app/pages/proposals/proposals-list.page.ts`, `docs/pages/kp-workspace.page.md`
- **Key Constraints:** guard only proposal create-in-studio; reuse shared helper/message; no PDF/family rewrite, BE, seed, deploy, or unrelated WIP
- **Planned Deliverable:** check organizations before studio POST; expose warning banner and registry CTA; add empty-org regression test; run focused gates and build
- **Validation Path:** focused proposals Jest/ESLint/tsc, `nx build kppdf-web`, Integrity slot

## Acceptance
- [x] Empty organizations block studio document POST.
- [x] Warning banner and «Создать фирму» CTA navigate to `/registries/organizations`.
- [x] Existing populated-org create flow remains green.
- [x] No BE/PDF/family/seed/deploy changes.

## Integrity slot
- [x] Type: page behavior.
- [x] FIC/page docs reviewed; no route/API contract changed, so page.md update N/A.
- [x] DOMAIN-MAP / SECTION-READINESS: N/A.
- [x] Foreign WIP excluded; shared helper reused.
- [x] Coupling map: N/A; no persisted field semantics changed.
- [x] `docs/DOCS-INTEGRITY.md` followed.

## Gates
- `cd frontend-nx && pnpm exec jest --config apps/kppdf-web/jest.config.ts --runInBand apps/kppdf-web/src/app/pages/proposals/proposals-list.page.spec.ts` — PASS, 32/32.
- `cd frontend-nx && pnpm exec eslint apps/kppdf-web/src/app/pages/proposals/proposals-list.page.ts apps/kppdf-web/src/app/pages/proposals/proposals-list.page.spec.ts libs/features/src/lib/proposals/proposals-list.facade.ts` — PASS.
- `cd frontend-nx && pnpm exec tsc -p apps/kppdf-web/tsconfig.app.json --noEmit` — PASS.
- `cd frontend-nx && pnpm exec nx build kppdf-web` — PASS; existing Angular/bundle budget warnings only.

## Executor report
- Reused shared `isOrganizationsEmpty` / `ORGANIZATION_REQUIRED_MESSAGE` before proposal Studio creation.
- Empty Organization list now prevents the Studio document POST, shows warning banner and «Создать фирму» CTA to `/registries/organizations`, and emits an explanatory toast.
- Populated Organization flow and existing proposal behavior remain covered by focused tests.
- No BE, PDF, seed, deploy, or unrelated WIP changes.

## Closeout
- [x] archive + lock + remove active marker
- [x] Status = DONE
- closed_at: 2026-09-19T13:35:00+03:00
