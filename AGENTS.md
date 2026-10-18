# AGENTS.md — вход для ИИ-агентов (kppdf-8.0)

Рабочий контракт уже описан — не дублируем:
- **Claude Code** → [`CLAUDE.md`](CLAUDE.md); **Gemini** и прочие исполнители → [`GEMINI.md`](GEMINI.md) (Definition of Done, claim-протокол, проверки).
- Порядок старта и «где правда» → [`docs/PROJECT-MEMORY.md`](docs/PROJECT-MEMORY.md).
- **База данных / деплой / бэкап** → [`docs/UNIFIED-DB.md`](docs/UNIFIED-DB.md): с 2026-10-18 kppdf работает с единой базой `datacore` проекта data-core (`D:\data-core`), своей Mongo нет.

Не читать без нужды (история, большой объём): `tasks/_archive/`, `docs/_archive_legacy/`, `docs/audits/`, `progress.md`, `STATUS.md`, `PO-DIARY.md`, `ARCHITECTURE.md` целиком.
Секреты (`.env`, `deploy/synology/config.env`, `deploy/synology/CREDENTIALS.md`) — не выводить и не коммитить. Хуки git требуют `pnpm`.
