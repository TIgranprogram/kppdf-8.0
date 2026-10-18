# UNIFIED-DB — kppdf работает с единой базой data-core (с 2026-10-18)

> Единственный источник фактов о базе kppdf. Если другой документ говорит иначе (`kppdf-mongo`, `/var/lib/kppdf80/mongodb`, «своя Mongo») — он устарел, верь этому файлу.

## Схема

```
CRM kppdf (https://kppdf-crm.ru, VM :3000, /opt/kppdf-8.0) ──напрямую──┐
                                                                     ├──> MongoDB `datacore` (контейнер datacore-mongo, mongo 4.4 rs0, --auth)
data-core API (https://kppdf-crm.ru/db/api, VM :3001, /opt/data-core) ┘        контур и репозиторий data-core: D:\data-core, github TIgranprogram/data-core
   ↑ таблицы, скрипты, новые приложения, ИИ-агенты (ключ kppd_)
```

- **Своей MongoDB у kppdf нет.** Контейнер `kppdf-mongo` и `/var/lib/kppdf80/mongodb` удалены 2026-10-18 (бэкап до слияния: `/var/lib/datacore/backups/kppdf-premerge-2026-10-18_090145`).
- Подключение: `MONGO_URI=mongodb://kppdf:<pw>@datacore-mongo:27017/datacore?directConnection=true&authSource=datacore`, `MONGO_DB=datacore` — в `/opt/kppdf-8.0/.env` (пишет `deploy.py` из gitignored `deploy/synology/config.env`; пароль Mongo-пользователя `kppdf` также в `/opt/kppdf-8.0/.kppdf-mongo-pw` на VM). Без `MONGO_URI` `deploy.py` останавливается.
- `docker-compose.prod.yml`: только сервис `backend`, сети `default` + внешняя `data-core_default`.
- Загрузки (фото): общие `/var/lib/datacore/uploads` (`SHARED_UPLOADS_DIR`).
- Бэкап делает data-core: cron 03:00 на VM → `/var/lib/datacore/backups` (14 дней) + копия на Windows-ПК `D:\datacore-backups` (30 дней). `deploy/synology/backup.sh` kppdf просто вызывает бэкап data-core.

## Правила для агентов (обязательно)

1. **Схемы общих коллекций** (`users`, `roles`, `permissions`, `settings`, `organizations`, `counterparties`, `persons`, `categories`, `units`, `currencies`, `materials`, `products`, `productmodules`, `photos`, `worktypes`, `desktop_pairing_keys`, `browserdevicegrants`, …) читают **оба** кода. Менять поля/индексы/смысл — только синхронно с data-core (`D:\data-core\backend\src\modules\...`). Добавлять новые поля — можно (оба кода терпимы к лишним полям).
2. **Коллекции CRM** (заказы, КП, склад, производство, документы, импорты) — только kppdf; data-core их не трогает (в его админке они `kind:'crm'`, удалить нельзя).
3. **Не останавливай и не пересоздавай `datacore-mongo`**, не делай `compose down` в `/opt/data-core` — упадут оба приложения. Порядок старта: сначала data-core, потом kppdf.
4. `--wipe` kppdf больше **не удаляет базу** (её у kppdf нет): стирает только `/opt/kppdf-8.0` и старые `/var/lib/kppdf80/{uploads,mongodb}`. Общие данные — только через контур data-core и только по решению пользователя.
5. Пользователи общие: один логин/пароль в kppdf и data-core (JWT-секреты разные — сессии раздельные). Ключи `kppd_`: полный (`full`) работает в обоих API; ключ data-core с ограниченным scope (`read`/`write`) kppdf отклоняет (401) — `backend/src/modules/desktop/desktop-pairing-key.service.ts`.
6. Миграции/сиды kppdf работают по общей базе: сиды только добавляют недостающее (права, роли) — не пиши сиды/миграции, которые удаляют или переименовывают общие данные.

7. **Склад и снабжение — общие с data-core** (с 2026-10-18): `materials`, `storageitems`, `stockmovements`, `reservations`, `warehouses`, `supplyrequests`, `organizations` пишет ещё и data-core (приложение «Склад · Снабжение» `/db/app/`, синхронизация Google-таблиц). Схемы — общие: копии в `D:\data-core\backend\src\modules\stock\schemas\` и `supply\supply-request.schema.ts`; меняй синхронно. Новые общие поля: `clientUid`, `sheetSource`/`sheetKey`/`syncHash` (+ `notes` у движения, `num`/`requestDate`/`sheetExtra` у заявки). Склад по умолчанию — `warehouses.isDefault`. Подробно — `D:\data-core\docs\UNIFY-SUPPLY-WAREHOUSE.md`.

## Откат на собственную базу (аварийно)

На VM: вернуть `/opt/kppdf-8.0/.env.bak-premerge` и `docker-compose.prod.yml.bak-premerge`, восстановить дамп `kppdf-premerge-2026-10-18_090145` в новый `kppdf-mongo`, `docker compose -f docker-compose.prod.yml up -d`. Данные, внесённые после 2026-10-18, останутся только в `datacore`.

## Репозиторий

`origin` = `git@github.com:TIgranprogram/kppdf-8.0.git` (приватный, с 2026-10-18). Старый `gostreetogle-create/kppdf-8.0` недоступен — remote `old-origin`; ссылки на него в истории/архивах не обновляются.
