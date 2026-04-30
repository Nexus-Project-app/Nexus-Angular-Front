Dockerfile — multi-stage build:

Stage builder: node:24-alpine, full npm ci, ng build
Stage runtime: fresh node:24-alpine, prod deps only (--omit=dev --ignore-scripts), copies dist/ with correct ownership, runs as non-root user nexus
Final image: ~200 MB instead of 1+ GB
.dockerignore — excludes node_modules, dist, .git, .claude, .env* → smaller build context, no secrets leaked

.github/workflows/ci.yml — 2 jobs:

Job	Trigger	What it does
build-and-test	Every push + PR	npm ci → ng build → ng test
docker	Push to main only	Login ghcr.io with GITHUB_TOKEN → build image → push latest + sha-<short> tags
Key security decisions:

GITHUB_TOKEN only (no PAT), scoped to packages: write
cancel-in-progress: true prevents stale runs piling up
GHA layer cache (type=gha) for fast rebuilds
Non-root container user at runtime
One thing to check: your test command uses Karma by default. If you switched to Vitest (I see it in devDependencies), update line run: npm test -- --watch=false --browsers=ChromeHeadless to run: npm test with the correct Vitest args.