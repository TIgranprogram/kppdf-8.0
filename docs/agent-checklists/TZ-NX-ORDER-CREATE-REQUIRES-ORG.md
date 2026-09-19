# TZ-NX-ORDER-CREATE-REQUIRES-ORG checklist

> Status: **DONE**
> Marker: `tasks/_active/TZ-NX-ORDER-CREATE-REQUIRES-ORG.md`

## Claim slot
- agent_id: freebuff
- claimed_at: 2026-09-19T13:40:00+03:00
- workspace: D:\kppdf-8.0

## Preflight
- Ready TZ, order create page/spec, shared Organization helper, and orders page docs reviewed.
- Empty organizations must block order creation; no backend schema, seed, deploy, or wipe changes.

## Acceptance
- [x] Empty organizations prevent order creation POST.
- [x] Warning banner and «Создать фирму» CTA navigate to `/registries/organizations`.
- [x] Existing populated-org flow remains green.
- [x] No BE/schema/seed/deploy changes.

## Gates
- Focused order-create Jest: PASS, 9/9.
- Focused ESLint: PASS.
- App TypeScript check: PASS.
- `nx build kppdf-web`: PASS; existing Angular/bundle budget warnings only.

## Executor report
- Reused shared Organization helper/message after organization loading.
- Empty Organization lists show the warning banner, block effective submission, and provide the registry CTA.
- Existing populated-org flow remains green; no backend/schema/seed/deploy changes.

## Closeout
- [x] archive + lock + remove active marker
- [x] Status = DONE
- closed_at: 2026-09-19T13:45:00+03:00
