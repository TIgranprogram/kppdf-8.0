# TZ-NX-PROPOSALS-CREATE-REQUIRES-ORG

Status: DONE

## Result
- Reused shared `isOrganizationsEmpty` and `ORGANIZATION_REQUIRED_MESSAGE` before proposal Studio creation.
- Empty Organization lists block `studioApi.create`, show the warning banner, and offer «Создать фирму» to `/registries/organizations`.
- Populated Organization creation remains green and existing proposal behavior is unchanged.
- Added regression coverage for the empty-Organization path.

## Gates
- Focused proposals Jest: PASS, 32/32.
- Focused ESLint: PASS.
- App TypeScript check: PASS.
- `nx build kppdf-web`: PASS; existing Angular/bundle budget warnings only.

No Organization seed, backend, PDF/family rewrite, deploy, or unrelated WIP was included.

Closed: 2026-09-19
