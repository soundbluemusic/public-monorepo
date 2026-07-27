#!/usr/bin/env bash

set -u

if [ "$#" -lt 8 ]; then
  echo "Usage: smoke-worker.sh <base-url> <home-pattern> <detail-path> <detail-pattern> <ko-path> <ko-pattern> <secondary-path> <secondary-pattern>"
  exit 2
fi

BASE_URL="$1"
HOME_PATTERN="$2"
DETAIL_PATH="$3"
DETAIL_PATTERN="$4"
KO_PATH="$5"
KO_PATTERN="$6"
SECONDARY_PATH="$7"
SECONDARY_PATTERN="$8"
FAILED=0

check_page() {
  local label="$1"
  local path="$2"
  local pattern="$3"
  local output_file
  output_file="$(mktemp)"

  for attempt in 1 2 3 4 5 6; do
    local status
    status="$(curl -sSL -o "$output_file" -w "%{http_code}" "${BASE_URL}${path}" || true)"
    if [ "$status" = "200" ] && grep -Eiq "$pattern" "$output_file"; then
      echo "PASS: ${label}"
      rm -f "$output_file"
      return 0
    fi
    if [ "$attempt" -lt 6 ]; then
      sleep 5
    fi
  done

  echo "FAIL: ${label} (${BASE_URL}${path}, HTTP ${status:-unknown})"
  rm -f "$output_file"
  FAILED=1
}

check_page "Homepage SSR" "/" "$HOME_PATTERN"
check_page "Detail page" "$DETAIL_PATH" "$DETAIL_PATTERN"
check_page "Korean page" "$KO_PATH" "$KO_PATTERN"
check_page "Secondary page" "$SECONDARY_PATH" "$SECONDARY_PATTERN"

if [ "$FAILED" -ne 0 ]; then
  echo "Worker smoke tests failed"
  exit 1
fi

echo "All worker smoke tests passed"
