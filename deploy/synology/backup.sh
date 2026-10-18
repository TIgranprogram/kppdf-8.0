#!/bin/bash
# backup.sh — KPPDF 8.0
#
# ЕДИНАЯ БАЗА (с 2026-10-18): у kppdf больше нет своей MongoDB — данные живут в базе
# `datacore` контура data-core (/opt/data-core). Бэкап делает data-core:
#   cron /etc/cron.d/datacore, 03:00 → /opt/data-core/deploy/synology/backup.sh
#   (mongodump БД datacore + /var/lib/datacore/uploads → /var/lib/datacore/backups, 14 дней).
# Этот скрипт оставлен как указатель и просто запускает бэкап data-core.
set -euo pipefail

DATACORE_BACKUP="${DATACORE_BACKUP:-/opt/data-core/deploy/synology/backup.sh}"
if [[ ! -f "$DATACORE_BACKUP" ]]; then
  echo "ERROR: не найден $DATACORE_BACKUP — бэкап единой базы делает контур data-core" >&2
  exit 1
fi
echo "=== KPPDF: единая база — запускаю бэкап data-core ==="
exec bash "$DATACORE_BACKUP"
