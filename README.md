# playwright-in-docker-poc

Playwright end-to-end tests run inside the official Microsoft Playwright Docker image. Local runs and CI both use **Docker Compose** so screenshot golden images match Linux rendering.

## Prerequisites

**Local functional tests** (screenshot tests skipped):

- Node.js 18+
- npm

**Full suite and golden images** (required for screenshot comparison):

- [Docker](https://docs.docker.com/get-docker/)
- Docker Compose v2 (`docker compose`)

## Installation

```shell
npm install
```

Optional — run Playwright on the host without Docker:

```shell
npm run install:browsers
```

Pull the Playwright Docker image:

```shell
docker pull mcr.microsoft.com/playwright:v1.60.0
```

## Running tests

Local `npm test` runs functional checks only. Golden-image screenshot tests are skipped so OS rendering differences do not fail on your machine.

```shell
# Full suite in Docker (including screenshot tests) — same as CI
npm run test:docker

# Or directly
docker compose run --rm playwright

# Local (screenshot tests skipped)
npm test
```

### Headed mode, UI, debugger

```shell
npm run test:headed
npm run test:ui
npm run test:debug
```

To run screenshot comparison on the host (optional; may differ from CI):

```shell
SCREENSHOT_TESTS=true npm run test:ci
```

## Golden images

Expected screenshots live in `golden_images/`. Screenshot tests run when `SCREENSHOT_TESTS=true` (set automatically in Docker Compose and CI).

Regenerate golden images inside the Playwright container:

```shell
npm run test:docker:update-snapshots

# Or
docker compose run --rm playwright-update-snapshots
```

`golden_images/` is bind-mounted into the container at the same path as on the host.

On failure, Playwright writes actual screenshots and diffs under `test-results/`.

## CI

GitHub Actions runs the same Compose service as local:

```shell
docker compose run --rm playwright
```

See [.github/workflows/playwright-e2e.yml](.github/workflows/playwright-e2e.yml).

## Test targets

| Target | Role |
|--------|------|
| `fixtures/static-site/index.html` | Primary fixture; golden image baseline |
| `fixtures/static-site/variant.html` | Second fixture; distinct layout for a second baseline |
| Screenshot comparison test | Asserts the primary fixture does **not** match the variant golden image |

Pages are served from the repo via Playwright `webServer` (no external sites). Google/Cresta were removed because their homepages change frequently and break snapshot tests.

## Layout

```
docker-compose.yml
scripts/docker-playwright.sh
scripts/npm-install.sh
playwright.config.ts
fixtures/static-site/   # Deterministic HTML for local tests
golden_images/          # Expected screenshots (*.png)
tests/                  # Spec files (*.spec.ts)
```
