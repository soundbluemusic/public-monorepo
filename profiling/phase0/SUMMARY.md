# Phase 0 - Baseline Summary

## Environment

| Item | Value |
| --- | --- |
| Node | v22.22.2 |
| pnpm | 10.11.0 |
| OS | Linux vm 6.18.5 x86_64 |
| Date (UTC) | 2026-05-13T06:32:16Z |
| Git commit | fa849c65bb1cb39ff9af54946afacd45a829300b |
| Branch | claude/add-profiling-docs-qWoeh |

## Install (cold, frozen-lockfile)

| Metric | Value |
| --- | --- |
| Wall time | 27.141s (`profiling/phase0/install.log`) |
| User CPU | 39.488s |
| Sys CPU | 21.670s |
| node_modules size | 1.3 GB |

## Notes

- `postinstall` 단계에서 모든 앱의 `prebuild`가 자동 실행됨 (`package.json:53`).
- 따라서 install 27s에는 prebuild 시간이 **포함**되어 있음.
- prebuild 산출물 확인됨: `apps/context/app/data/generated`, `apps/*/app/paraglide`, `apps/*/public/search-index.json`.
