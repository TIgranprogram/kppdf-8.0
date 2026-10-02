# Runbook: свежая ссылка `/enroll` (owner-invite), когда доступ потерян

> **Когда открывать:** у PO пропал доступ — «ссылка истекла», «не могу зарегистрировать
> компьютер», «нет доступа к моему проекту на Synology NAS / VM». Ответ — выпустить
> **новую** одноразовую ссылку через публичный API. Код/ nginx / БД / деплой не трогаются.
>
> Это ops-инструкция (ad-hoc работа без CLAIM): менять можно только docs, commit/push —
> только по явной просьбе PO (`docs/GIT-POLICY.md`).
>
> Проверено вживую: 2026-10-02 — owner-invite выпущен, `GET /enroll/<secret>` → 200.

## 0. TL;DR (четыре шага)

1. `GET https://kppdf-crm.ru/api/health/ready` → `200 {"status":"ok"}`.
2. `POST /api/auth/login` `{"username":"admin","password":"<ADMIN_PASSWORD>"}` → `{access,…}`.
3. `POST /api/admin/devices/owner-invite` с `Authorization: Bearer <access>` и телом
   `{"password":"<ADMIN_PASSWORD>"}` → `{"url":"https://kppdf-crm.ru/enroll/<secret>",…}`.
4. Smoke: `GET <url>` → 200 (страница открылась, invite **не** погашен) → отдать URL PO.

Ссылка **одноразовая**, живёт 48 ч. NAS/VM/SSH для этого не нужны.

## 1. Какие бывают ссылки и когда хватит другого пути

| Путь | Когда работает | Что даёт |
|------|----------------|----------|
| **API `owner-invite` (этот runbook)** | доступа нет вообще, браузер «чужой» | ссылка для самого PO → устройство становится owner-device |
| UI `/admin/devices` → «Добавить мой компьютер» | есть **уже подключённый** браузер | то же самое, без curl (step-up паролем) |
| UI `/admin/devices` → «Создать ссылку» (regular) | чужая машина/коллега | ссылка с **заранее выбранной ролью**, TTL 1/3/7 дней |

- `owner-device` — привязывается к единственному owner User, **роль не выбирается** и не
  меняется; второго owner не создаётся (`ownerUserId` immutable).
- `regular` — создаёт `User(accountType=device)` с ровно выбранной ролью.
- Подробно: `docs/pages/admin-devices.page.md`, `docs/pages/enroll.page.md`.

### Симптомы → что значает ответ UI

| Текст в UI | Код | Причина | Действие |
|------------|-----|---------|----------|
| «Эта ссылка уже была использована.» | 409 | invite уже consumed | выпустить новую |
| «Приглашение недействительно или истекло. Обратитесь к администратору.» | 400/404/410 | просрочен, отозван или битый секрет | выпустить новую |
| «Доступ этого компьютера отключён. Обратитесь к администратору.» | 401 на device session | grant **revoke** у устройства | `/admin/devices` → включить устройство, либо новая ссылка |
| «Не удалось подключить компьютер. Попробуйте ещё раз.» | сеть / 5xx / NG0957 | см. §4 п.6 | открыть консоль браузера (Network + pageerror) |
| HTTP Basic-окно (логин/пароль браузера) | 401 с `WWW-Authenticate` | вернули старый Basic (rollback) | см. `docs/ops/home-host-access.md` §4.1 |

## 2. Пошагово (PowerShell; секреты с машины не уходят)

**Шаг 0 — пререквизиты**

- `deploy/synology/config.env` — **gitignored** локальный файл; оттуда берётся
  `ADMIN_PASSWORD` (он же пароль owner step-up). Шаблон: `deploy/synology/config.env.example`.
- Человекочитаемая выписка (SSH/адреса/пароли) — `deploy/synology/CREDENTIALS.md`
  (**LOCAL, gitignored**; в GitHub его нет — не искать на чистом клоне).
- Публичный origin: `https://kppdf-crm.ru`.
- **Не нужны:** SSH, VPN, доступ к NAS/VM, деплой. (VPN отключать нужно только для
  LAN-SSH/деплоя — `CREDENTIALS.md`; на выпуск ссылки не влияет.)

**Шаг 1 — health**

```powershell
(Invoke-WebRequest 'https://kppdf-crm.ru/api/health/ready' -UseBasicParsing -TimeoutSec 20).StatusCode   # 200
```

Не 200 → сайт/туннель лежит, это уже не этот runbook: `docs/ops/DEPLOY-NX-PROD.md`.

**Шаг 2 — login → Bearer** и **Шаг 3 — owner-invite** (одним скриптом; пароль читается
из config.env и в вывод не попадает):

```powershell
$ErrorActionPreference = 'Stop'
$cfg = @{}
Get-Content 'D:\kppdf-8.0\deploy\synology\config.env' | ForEach-Object {
  if ($_ -match '^\s*([A-Za-z0-9_]+)=(.*)$') { $cfg[$matches[1]] = $matches[2].Trim() }
}
$pw = $cfg['ADMIN_PASSWORD']
if (-not $pw) { throw 'ADMIN_PASSWORD пуст в deploy/synology/config.env' }

$loginBody = @{ username = 'admin'; password = $pw } | ConvertTo-Json -Compress
try   { $login = Invoke-RestMethod 'https://kppdf-crm.ru/api/auth/login' -Method Post `
                 -ContentType 'application/json' -Body $loginBody -TimeoutSec 25 }
catch { throw "LOGIN FAIL: $($_.Exception.Response.StatusCode.value__)" }
if ($login.user.isOwner -ne $true) { throw 'login дал НЕ owner — owner-invite вернёт 403' }

$hdr  = @{ Authorization = "Bearer $($login.access)" }
$body = @{ password = $pw } | ConvertTo-Json -Compress
try   { $inv = Invoke-RestMethod 'https://kppdf-crm.ru/api/admin/devices/owner-invite' -Method Post `
                 -Headers $hdr -ContentType 'application/json' -Body $body -TimeoutSec 25 }
catch { throw "INVITE FAIL: $($_.Exception.Response.StatusCode.value__)" }

$inv | ConvertTo-Json -Depth 5     # { inviteId, url, secret, expiresAt, kind }
```

`$login.access` и `$pw` **не печатать** (не в чат, не в отчёт, не в лог-файл).

**Шаг 4 — smoke и выдача**

```powershell
(Invoke-WebRequest $inv.url -UseBasicParsing -TimeoutSec 25).StatusCode   # 200
```

- `200` → отдать `url` PO: открыть **в браузере того компьютера, который регистрируем** →
  «Как назвать этот компьютер?» → «Подключить».
- Если в `url` хост `http://localhost:4200` — известный баг `device.enrollBaseUrl`
  (фикс в TZ-AUTH-307): открыть вручную `https://kppdf-crm.ru/enroll/<secret>`.
- Дальше браузер помечен device-cookie (`__Host-kppdf-device`, grant до 365 дней) и
  заходит без ссылки. Повторное открытие той же ссылки → 409, это норма.

## 3. Факты (сверено с кодом 2026-10-02)

| Параметр | Значение | Источник |
|----------|----------|----------|
| TTL owner-invite | `DEVICE_OWNER_INVITE_TTL_MINUTES`, default **2880** = 48 ч (max 10080) | `backend/src/config/configuration.ts`, `env.validation.ts`, `docker-compose.prod.yml` |
| TTL regular invite | `DEVICE_INVITE_TTL_DAYS` / `ttlDays` ∈ {1,3,7}, default 3 | `backend/src/modules/device-enrollment/dto/create-invite.dto.ts` |
| TTL device grant | `device.grantTtlDays` default 365 | `device-enrollment.service.ts` |
| access JWT устройства | ≤ 300 s, refresh не хранится | `signDeviceJwt` |
| step-up | bcrypt-сравнение пароля owner; неверный → **401 «Неверный пароль»** | `issueOwnerInvite` |
| не owner | **403** `{code:'OWNER_ONLY'}` | `issueOwnerInvite`, `OwnerOnlyGuard` |
| GET страницы `/enroll/*` | invite **не** consume (link-scanner безопасен) | `docs/pages/enroll.page.md` |
| повторный POST | **409** | `consumeInvite` |
| секрет | 32 байта, хранится SHA-256 + display-prefix, plaintext не пишется | `randomSecret` / `sha256Hex` |
| публичность | `/enroll/*` и `POST /api/device/enroll` — без cookie и без Basic; `/api` — только JWT | `docs/ops/home-host-access.md` §4.1 |

Возможные изменения на проде: если включат backlog `TZ-COMP-402` (WAN-лок login),
шаг 2 отработает только с LAN — тогда выпускать ссылку с машины в домашней сети.

## 4. Частые ошибки агентов — так **нельзя**

1. **Не выдумывать** ссылку/секрет, не править старый URL «на полчаса» — только новый invite.
2. **Не создавать второго owner** через роль, seed или напрямую в Mongo: owner один,
   owner-only-поверхность специально не видна обычным админам (404/403).
3. **Не писать секреты** (пароли, JWT, секреты инвайтов) в чат, отчёт, checklist, лог,
   evidence-файлы и тем более в git. В docs — только плейсхолдер `<ADMIN_PASSWORD>`.
4. **Не коммитить саму ссылку** `/enroll/<secret>` — это одноразовый секрет, в репо не нужен.
5. **Не переиспользовать** URL из чата, старого TZ, evidence-файлов — они consumed/expired.
6. Если POST не ушёл / generic-ошибка — смотреть Network + console в браузере; для UI-багов
   канон: регресс-тест `enroll.page.spec.ts` + `withComponentInputBinding()`
   (`tasks/TZ-VERIFY-2026-09-13-ENROLL-DEPLOY-VM52.md` §2).
7. **Не лезть** в nginx, docker, Mongo, VM «чтобы починить ссылку», и не запускать деплой —
   ничего из этого не требуется (deploy требует отдельного слова PO: `docs/ops/DANGEROUS-OPS.md`).
8. **Не `git add -A`:** в рабочем дереве постоянно чужой WIP/untracked (`tasks/QUEUE-LIVE.md`,
   `data/*`, `docs/prompts/`, worktrees в `.worktrees/*`) — stage только свои файлы поимённо.

## 5. Секреты и git (жёсткое правило перед push)

- В GitHub **не должны** попадать: `deploy/synology/config.env`, `deploy/synology/CREDENTIALS.md`,
  `.env*`, ключи/дампы/`ruvector.db` (см. `docs/GIT-POLICY.md`).
- Скан staged-диффа значениями из config.env — **до** коммита:

```powershell
$vals = Get-Content 'deploy/synology/config.env' -ErrorAction SilentlyContinue |
        Where-Object { $_ -match '^[A-Za-z0-9_]+=(.+)$' } |
        ForEach-Object { $matches[1] } | Where-Object { $_.Length -ge 8 }
$leak = (git diff --cached | Select-String -SimpleMatch -Pattern $vals | Measure-Object).Count
if ($leak -gt 0) { throw 'staged diff содержит значения из config.env — откатить и вычистить' }
```

- Коммит: `git add <только свои файлы>` → message в формате проекта → `git push`.
  pre-commit/pre-push хуки требуют `pnpm`/`node`; на машине без тулчейна — `--no-verify`
  с обязательной самопроверкой после (правило «экстренного push» из `docs/GIT-POLICY.md`).

## 6. Related

- `docs/pages/enroll.page.md` — поведение страницы `/enroll/:token`, коды ошибок
- `docs/pages/admin-devices.page.md` — админка устройств, кнопки «Создать ссылку»/«Добавить мой компьютер»
- `docs/ops/home-host-access.md` — как устроен внешний барьер (device cookie вместо Basic)
- `deploy/synology/CREDENTIALS.md` (LOCAL, gitignored) — SSH/адреса/пароли
- `tasks/TZ-VERIFY-2026-09-13-ENROLL-DEPLOY-VM52.md` §5.1 — предыдущий прогон этой же процедуры
- `docs/GIT-POLICY.md` — что можно коммитить/пушить и как

---

_Создано: 2026-10-02 (ad-hoc runbook по запросу PO; продукт-код не менялся)._
