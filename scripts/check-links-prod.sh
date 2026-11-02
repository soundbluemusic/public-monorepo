#!/usr/bin/env bash
set -euo pipefail
exec pnpm exec tsx scripts/check-links-prod.ts "$@"
