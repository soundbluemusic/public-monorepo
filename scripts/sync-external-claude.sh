#!/usr/bin/env bash
# Sync the external CLAUDE.md (forrestchang/andrej-karpathy-skills) verbatim
# into the area BEFORE the <!-- END-EXTERNAL-CLAUDE-MD --> sentinel.
#
# The external content always occupies the very top of the target file:
#   line 1 ... line N        = external upstream content (verbatim)
#   line N+1                 = <!-- END-EXTERNAL-CLAUDE-MD -->
#   line N+2 ... end-of-file = project content (preserved as-is)
#
# Idempotent. Prints "no-change" or "updated". Non-zero exit on any error.
#
# Usage:
#   scripts/sync-external-claude.sh [target-file]
#   (target-file defaults to CLAUDE.md in repo root)

set -euo pipefail

UPSTREAM_URL="https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md"
TARGET_FILE="${1:-CLAUDE.md}"
END_MARKER="<!-- END-EXTERNAL-CLAUDE-MD -->"

if [[ ! -f "$TARGET_FILE" ]]; then
  echo "::error::Target file not found: $TARGET_FILE" >&2
  exit 1
fi

end_count=$(grep -cF "$END_MARKER" "$TARGET_FILE" || true)
if [[ "$end_count" != "1" ]]; then
  echo "::error::END marker must appear exactly once in $TARGET_FILE (found $end_count)" >&2
  exit 1
fi

TMP_UPSTREAM=$(mktemp)
TMP_EMBEDDED=$(mktemp)
TMP_AFTER=$(mktemp)
TMP_OUT=$(mktemp)
cleanup() { rm -f "$TMP_UPSTREAM" "$TMP_EMBEDDED" "$TMP_AFTER" "$TMP_OUT"; }
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

# 2. Extract currently-embedded content: from file start up to (but not
#    including) the END marker line.
awk -v end="$END_MARKER" '
  $0 == end { exit }
  { print }
' "$TARGET_FILE" > "$TMP_EMBEDDED"

# 3. Extract the END-marker-and-after block, preserved verbatim.
awk -v end="$END_MARKER" '
  found     { print; next }
  $0 == end { found = 1; print }
' "$TARGET_FILE" > "$TMP_AFTER"

# 4. Compare upstream vs currently embedded.
UPSTREAM_SHA=$(sha256sum "$TMP_UPSTREAM" | awk '{print $1}')
EMBEDDED_SHA=$(sha256sum "$TMP_EMBEDDED" | awk '{print $1}')

echo "upstream sha256: $UPSTREAM_SHA"
echo "embedded sha256: $EMBEDDED_SHA"

if [[ "$UPSTREAM_SHA" == "$EMBEDDED_SHA" ]]; then
  echo "no-change"
  exit 0
fi

# 5. Reassemble: upstream content + END marker + everything after it.
cat "$TMP_UPSTREAM" "$TMP_AFTER" > "$TMP_OUT"

# 6. Post-write sanity: END marker still present exactly once.
new_end_count=$(grep -cF "$END_MARKER" "$TMP_OUT" || true)
if [[ "$new_end_count" != "1" ]]; then
  echo "::error::END marker count is $new_end_count after rewrite. Refusing to write." >&2
  exit 1
fi

# 7. Post-write sanity: re-extracted block must equal upstream byte-for-byte.
awk -v end="$END_MARKER" '
  $0 == end { exit }
  { print }
' "$TMP_OUT" > "$TMP_EMBEDDED"

NEW_EMBEDDED_SHA=$(sha256sum "$TMP_EMBEDDED" | awk '{print $1}')
if [[ "$NEW_EMBEDDED_SHA" != "$UPSTREAM_SHA" ]]; then
  echo "::error::Post-rewrite SHA mismatch (got $NEW_EMBEDDED_SHA, expected $UPSTREAM_SHA)" >&2
  exit 1
fi

mv "$TMP_OUT" "$TARGET_FILE"
echo "updated $TARGET_FILE (sha256=$UPSTREAM_SHA)"
