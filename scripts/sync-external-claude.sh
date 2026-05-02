#!/usr/bin/env bash
# Sync the external CLAUDE.md (forrestchang/andrej-karpathy-skills) into the
# embedded block delimited by <!-- BEGIN-EXTERNAL-CLAUDE-MD --> and
# <!-- END-EXTERNAL-CLAUDE-MD --> in the target file.
#
# Idempotent. Prints "no-change" or "updated". Non-zero exit on any error.
#
# Usage:
#   scripts/sync-external-claude.sh [target-file]
#   (target-file defaults to CLAUDE.md in repo root)

set -euo pipefail

UPSTREAM_URL="https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md"
TARGET_FILE="${1:-CLAUDE.md}"
BEGIN_MARKER="<!-- BEGIN-EXTERNAL-CLAUDE-MD -->"
END_MARKER="<!-- END-EXTERNAL-CLAUDE-MD -->"

if [[ ! -f "$TARGET_FILE" ]]; then
  echo "::error::Target file not found: $TARGET_FILE" >&2
  exit 1
fi

if ! grep -qF "$BEGIN_MARKER" "$TARGET_FILE"; then
  echo "::error::BEGIN sentinel not found in $TARGET_FILE" >&2
  exit 1
fi
if ! grep -qF "$END_MARKER" "$TARGET_FILE"; then
  echo "::error::END sentinel not found in $TARGET_FILE" >&2
  exit 1
fi

TMP_UPSTREAM=$(mktemp)
TMP_EMBEDDED=$(mktemp)
TMP_OUT=$(mktemp)
cleanup() { rm -f "$TMP_UPSTREAM" "$TMP_EMBEDDED" "$TMP_OUT"; }
trap cleanup EXIT

# 1. Fetch upstream (fail loudly on HTTP error or empty body).
if ! curl --fail --silent --show-error --location \
      --max-time 30 --retry 3 --retry-delay 2 \
      "$UPSTREAM_URL" -o "$TMP_UPSTREAM"; then
  echo "::error::Failed to fetch upstream from $UPSTREAM_URL" >&2
  exit 1
fi

if [[ ! -s "$TMP_UPSTREAM" ]]; then
  echo "::error::Upstream returned empty file" >&2
  exit 1
fi

# Sanity guard: refuse to mirror if upstream no longer looks like a CLAUDE.md.
# This catches accidental 404 HTML pages, repo deletion, or content type mismatch.
if ! head -1 "$TMP_UPSTREAM" | grep -q "^# CLAUDE.md"; then
  echo "::error::Upstream first line is not '# CLAUDE.md'. Refusing to sync." >&2
  echo "First 5 lines of upstream:" >&2
  head -5 "$TMP_UPSTREAM" >&2
  exit 1
fi

# 2. Extract currently-embedded content (between sentinels, exclusive).
awk -v begin="$BEGIN_MARKER" -v end="$END_MARKER" '
  $0 == begin { inblock = 1; next }
  $0 == end   { inblock = 0 }
  inblock     { print }
' "$TARGET_FILE" > "$TMP_EMBEDDED"

UPSTREAM_SHA=$(sha256sum "$TMP_UPSTREAM" | awk '{print $1}')
EMBEDDED_SHA=$(sha256sum "$TMP_EMBEDDED" | awk '{print $1}')

echo "upstream sha256: $UPSTREAM_SHA"
echo "embedded sha256: $EMBEDDED_SHA"

if [[ "$UPSTREAM_SHA" == "$EMBEDDED_SHA" ]]; then
  echo "no-change"
  exit 0
fi

# 3. Replace the block contents (markers preserved verbatim).
awk -v begin="$BEGIN_MARKER" -v end="$END_MARKER" -v file="$TMP_UPSTREAM" '
  $0 == begin {
    print
    while ((getline line < file) > 0) print line
    close(file)
    skip = 1
    next
  }
  $0 == end {
    skip = 0
    print
    next
  }
  !skip { print }
' "$TARGET_FILE" > "$TMP_OUT"

# 4. Post-write sanity: markers must still exist exactly once each.
if [[ "$(grep -cF "$BEGIN_MARKER" "$TMP_OUT")" != "1" ]] \
   || [[ "$(grep -cF "$END_MARKER" "$TMP_OUT")" != "1" ]]; then
  echo "::error::Sentinel count changed after rewrite. Refusing to write." >&2
  exit 1
fi

# 5. Post-write sanity: re-extracted block must equal upstream byte-for-byte.
awk -v begin="$BEGIN_MARKER" -v end="$END_MARKER" '
  $0 == begin { inblock = 1; next }
  $0 == end   { inblock = 0 }
  inblock     { print }
' "$TMP_OUT" > "$TMP_EMBEDDED"

NEW_EMBEDDED_SHA=$(sha256sum "$TMP_EMBEDDED" | awk '{print $1}')
if [[ "$NEW_EMBEDDED_SHA" != "$UPSTREAM_SHA" ]]; then
  echo "::error::Post-rewrite SHA mismatch (got $NEW_EMBEDDED_SHA, expected $UPSTREAM_SHA)" >&2
  exit 1
fi

mv "$TMP_OUT" "$TARGET_FILE"
echo "updated $TARGET_FILE (sha256=$UPSTREAM_SHA)"
