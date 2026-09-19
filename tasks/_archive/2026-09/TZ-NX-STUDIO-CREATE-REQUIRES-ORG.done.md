# TZ-NX-STUDIO-CREATE-REQUIRES-ORG

ARCHIVE_MARKER
outcome: DONE
closed_at: 2026-09-19
closed_by: freebuff
verification:
  - acceptance criteria: PASS
  - typecheck: PASS
  - focused tests: PASS (13/13)
  - lint: PASS (0 errors)
  - nx build kppdf-web: PASS (exit 0)
  - checklist: ADDED
  - progress.md: N/A (no progress.md in active contract surface; checklist and _NOW updated)
  - status synchronization: PASS

Summary: Studio document creation now checks the existing Organization registry. With zero organizations it shows the canonical Russian error and an actionable “Создать фирму” CTA to `/registries/organizations`, without sending the document create request or opening the doc-type dialog. No seed organization, backend/schema change, deploy, or wipe was performed.
