#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  if [ -n "${SUPERSET_ROOT_PATH:-}" ] && [ -f "$SUPERSET_ROOT_PATH/.env" ]; then
    cp "$SUPERSET_ROOT_PATH/.env" .env
  else
    cp .env.example .env
    sed -i.bak "s/^ADMIN_TOKEN=$/ADMIN_TOKEN=$(openssl rand -hex 32)/" .env && rm .env.bak
  fi
fi

# Postgres and Redis bind fixed host ports, so every worktree shares the main
# checkout's compose project instead of starting its own containers.
docker compose -p agent-desk up -d --wait postgres redis
