# TZ-NX-ORDER-CREATE-REQUIRES-ORG

Status: DONE

## Result
- Reused shared `isOrganizationsEmpty` and `ORGANIZATION_REQUIRED_MESSAGE` after loading organizations.
- Empty Organization lists show a warning banner and «Создать фирму» CTA to `/registries/organizations`.
- Empty Organization lists block effective order submission before site or order POST.
- Existing populated Organization order creation remains green.
- Added regression coverage for the empty-Organization path.

## Gates
- Focused order-create Jest: PASS, 9/9.
- Focused ESLint: PASS.
- App TypeScript check: PASS.
- `nx build kppdf-web`: PASS; existing Angular/bundle budget warnings only.

No backend/schema, Organization seed, deploy, or wipe was performed.

Closed: 2026-09-19
