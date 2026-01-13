---
title: AI Assistant Guidelines
description: Guidelines for AI assistants contributing to this project
---

This guide helps AI assistants (Claude, GPT, Gemini, etc.) contribute effectively to this monorepo.

## Quick Reference

| Document | Description |
|----------|-------------|
| [Rules](/public-monorepo/ai-guidelines/rules/) | Critical do's and don'ts |
| [Layer System](/public-monorepo/ai-guidelines/layer-system/) | Package import rules |

## Core Principles

### 1. SSG Only — No Exceptions

This project uses **100% Static Site Generation**. Never:
- Set `ssr: true`
- Remove `prerender()` function
- Create SPA with empty `<div id="root"></div>`

### 2. No Downgrades

Never downgrade package versions to fix issues. Instead:
- Find upgrade paths
- Modify code for compatibility
- Use `pnpm.overrides` to isolate conflicts

### 3. Complete Code Only

Always provide complete, working code. Never:
- Use `// ... existing code ...`
- Leave TODO comments without implementation
- Use `@ts-ignore` without explanation

## Response Rules

| Rule | Description |
|------|-------------|
| **Korean responses** | All explanations and documents in Korean |
| **Verify before claiming** | Check code, don't assume |
| **Cite sources** | Reference `file:line` format |
| **Complete code** | No `// ...` placeholders |

## Quality Priority

When rules conflict, follow this order:

```
1. Accessibility > 2. Security > 3. Functionality > 4. Performance > 5. SEO > 6. Code Quality
```

## Before Making Changes

Ask yourself:

1. Did I understand the root cause (WHY)?
2. Will existing functionality be preserved?
3. Are there any hardcoded values?
4. Will this work for all similar cases?

## Token Efficiency

### Best Practices

| Task Type | Method | Why |
|----------|--------|-----|
| Codebase exploration | Task tool (Explore) | Subagent explores, returns summary |
| Simple file search | Task tool + haiku | Low-cost model for fast search |
| File editing | Direct Read + Edit | Process only exact files |
| Build/test logs | `head -50` summary | Prevent full log output |

### Don't Do

- Glob → Read loops for full exploration
- Output entire build logs
- Read same file multiple times

## Related

- [Rules](/public-monorepo/ai-guidelines/rules/) — Detailed prohibited/required actions
- [Layer System](/public-monorepo/ai-guidelines/layer-system/) — Import layer rules
