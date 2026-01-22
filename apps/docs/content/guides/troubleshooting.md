---
title: Troubleshooting
description: Common issues and solutions when working with this monorepo
---

Solutions to common problems you might encounter.

## Build Errors

### "Cannot find module" Error

```
Error: Cannot find module '@soundblue/core'
```

**Solution:** Run install from the root directory:

```bash
cd /path/to/public-monorepo
pnpm install
```

### TypeScript Errors After Package Changes

```
error TS2307: Cannot find module '@soundblue/ui/components'
```

**Solution:** Rebuild all packages:

```bash
pnpm build
```

### Vite Build Memory Error

```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
```

**Solution:** Increase Node.js memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=8192" pnpm build
```

## Runtime Issues

### Buttons Not Clickable After Load

This is the React Router v7 + React 19 SSG hydration bug.

**Check:**
1. `entry.client.tsx` has the orphan DOM cleanup code
2. No console errors during hydration

See [Hydration Workaround](/public-monorepo/guides/hydration-workaround/) for details.

### Search Not Working

**Check:**
1. Search index was built: `pnpm build` should generate search files
2. Browser console for errors
3. MiniSearch worker is loading correctly

### Styles Not Applying

**Check:**
1. Tailwind CSS is processing: look for `tailwind.config.ts`
2. CSS imports are correct
3. Run `pnpm dev` to trigger hot reload

## Development Setup

### Port Already in Use

```
Error: Port 3003 is already in use
```

**Solution:** Kill the process or use a different port:

```bash
# Find process using port
lsof -i :3003

# Kill it
kill -9 <PID>

# Or use different port
PORT=3010 pnpm dev:context
```

### pnpm Version Mismatch

```
ERR_PNPM_BAD_PM_VERSION
```

**Solution:** Install correct pnpm version:

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
```

### Node.js Version Too Low

```
error This package requires Node.js >= 20
```

**Solution:** Upgrade Node.js:

```bash
# Using nvm
nvm install 20
nvm use 20

# Or download from nodejs.org
```

## Layer Violation Errors

### Import Layer Rule Violation

```
ERROR: @soundblue/core cannot import from @soundblue/platform
```

**Rules:**
- L0 (core, config) → Cannot import from any other layer
- L1 (data, platform) → Can only import L0
- L2 (i18n, search, seo, pwa) → Can import L0, L1
- L3 (ui, features, apps) → Can import all layers

See [Layer System](/public-monorepo/guides/architecture/) for the full diagram.

## Data Issues

### JSON Schema Validation Failed

```
ZodError: Invalid entry data
```

**Check:**
1. JSON file matches the Zod schema
2. All required fields are present
3. Data types are correct

```bash
# Validate data
pnpm test:data
```

## Getting Help

If your issue isn't listed here:

1. Search [GitHub Issues](https://github.com/soundbluemusic/public-monorepo/issues)
2. Check if it's a known upstream issue (React Router, Vite, etc.)
3. Create a new issue with:
   - Error message (full stack trace)
   - Steps to reproduce
   - Environment (Node.js version, OS, etc.)
