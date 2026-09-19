# TZ-NX-ORG-REQUIRED-SHARED

ARCHIVE_MARKER
outcome: DONE
closed_at: 2026-09-19
closed_by: freebuff
verification:
  - acceptance criteria: PASS
  - typecheck: PASS (`pnpm exec tsc -p apps/kppdf-web/tsconfig.app.json --noEmit`)
  - tests: PASS (focused organization-required spec, 3/3)
  - lint: PASS (focused ESLint)
  - nx build kppdf-web: PASS (exit 0; existing warnings only)
  - checklist: ADDED (`docs/agent-checklists/TZ-NX-ORG-REQUIRED-SHARED.md`)
  - progress.md: N/A — shared helper refactor; no progress log section for this S-sized TZ
  - status synchronization: PASS (`docs/agent-checklists/_NOW.md` updated)

Implemented:
- Shared `ORGANIZATION_REQUIRED_MESSAGE` and `isOrganizationsEmpty` in `@kppdf/data-access`.
- Studio create guard migrated to the shared helper with behavior preserved.
- No BE/schema/seed/deploy/wipe changes.
