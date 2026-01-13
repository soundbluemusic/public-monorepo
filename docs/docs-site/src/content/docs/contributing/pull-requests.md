---
title: Pull Request Guide
description: How to create and submit pull requests
sidebar:
  order: 3
---

# Pull Request Guide

This guide explains how to create effective pull requests for the monorepo.

## Before You Start

1. **Check existing issues** — Your change might already be in progress
2. **Open an issue first** for new features or major changes
3. **Fork the repository** if you're an external contributor

## Creating a Pull Request

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/your-feature
```

### 2. Make Your Changes

- Follow the [Code Style Guide](/public-monorepo/contributing/code-style/)
- Keep commits focused and atomic
- Write clear commit messages

### 3. Run Quality Checks

All checks must pass before submitting:

```bash
# Lint check
pnpm lint

# Type check
pnpm typecheck

# Unit tests
pnpm test

# Build all apps
pnpm build
```

### 4. Push and Create PR

```bash
git push origin feat/your-feature
```

Then open a Pull Request on GitHub.

## PR Title Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Build, dependencies, etc. |

### Examples

```
feat(context): add romanization search support
fix(search): resolve empty results on special characters
docs(readme): update installation instructions
refactor(ui): extract Button component
perf(search): optimize index loading
test(i18n): add locale routing tests
chore(deps): update react-router to v7.12
```

### Scope (Optional)

| Scope | Description |
|-------|-------------|
| `context` | Context app |
| `permissive` | Permissive app |
| `roots` | Roots app |
| `ui` | @soundblue/ui package |
| `search` | @soundblue/search package |
| `i18n` | @soundblue/i18n package |
| `core` | @soundblue/core package |
| `deps` | Dependencies |
| `docs` | Documentation |

## PR Description Template

```markdown
## Summary
<!-- Brief description of changes -->

## Changes
<!-- List of specific changes -->
- Added X feature
- Fixed Y bug
- Updated Z component

## Testing
<!-- How was this tested? -->
- [ ] Unit tests pass
- [ ] Manual testing in browser
- [ ] Tested in both EN and KO

## Screenshots (if UI change)
<!-- Add screenshots or GIFs -->

## Related Issues
<!-- Link related issues -->
Fixes #123
Closes #456
```

## Review Process

### What Reviewers Check

1. **Code Quality**
   - Follows code style guide
   - No TypeScript errors
   - No linting issues

2. **Correctness**
   - Solves the stated problem
   - No regressions
   - Handles edge cases

3. **Architecture**
   - Follows layer rules
   - No circular dependencies
   - Proper abstraction level

4. **Testing**
   - Tests added/updated if needed
   - All tests pass

5. **Documentation**
   - Code is self-documenting
   - Complex logic has comments
   - Public APIs have JSDoc

### Responding to Feedback

- Address all comments
- Mark conversations as resolved
- Request re-review when ready

## Merge Requirements

PRs can be merged when:

- [ ] All CI checks pass
- [ ] At least one approval from maintainer
- [ ] No unresolved conversations
- [ ] Branch is up to date with main

## After Merge

1. Delete your feature branch
2. Pull the updated main branch
3. Celebrate your contribution! 🎉

## Troubleshooting

### CI Failures

```bash
# Check what CI runs locally
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Merge Conflicts

```bash
# Update your branch with main
git checkout main
git pull origin main
git checkout feat/your-feature
git rebase main

# Resolve conflicts and continue
git add .
git rebase --continue

# Force push (only to your branch!)
git push --force-with-lease
```

### Large PRs

If your PR is getting large:

1. Consider splitting into smaller PRs
2. Use a tracking issue to link related PRs
3. Discuss with maintainers first

## Quick Checklist

Before submitting your PR:

- [ ] Branch is based on latest `main`
- [ ] Commits follow conventional format
- [ ] Code follows style guide
- [ ] All tests pass locally
- [ ] Build completes successfully
- [ ] UI changes verified in browser
- [ ] PR description is complete
