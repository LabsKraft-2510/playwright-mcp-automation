# Playwright MCP Automation

A small Playwright-based test automation framework pre-configured for Model Context Protocol (MCP) servers and AI-assisted test generation.

Quick summary
- Tests: Playwright + TypeScript
- AI: optional Anthropic integration (requires `ANTHROPIC_API_KEY`)
- Example site tests included: `saucedemo` (login tests)

Table of contents
- Quick start
- Troubleshooting
- Helper scripts


Prerequisites
- Node.js 20+
- npm (or yarn)
- Playwright browsers installed (run `npx playwright install`)

Quick start
1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Run all tests:

```bash
npm test
```

Run just the Sauce Demo login tests:

```bash
npx playwright test tests/sauce-login.spec.ts -j 1
```

Run headed (visible) mode and show report

```bash
# Run headed (open browser window)
npx playwright test --headed

# Open the last HTML report
npx playwright show-report
```

Generate sample Excel test data:

```bash
npm run generate:data
```

AI test generation (optional)
- Add your Anthropic API key to `.env`:

```bash
cp .env.example .env
# then edit .env and add:
ANTHROPIC_API_KEY=sk-ant-...your-key...
```

Sauce Demo credentials (public test accounts)

```
URL: https://www.saucedemo.com/
Username: standard_user
Password: secret_sauce
```

Helper scripts
- `scripts/verify-config.py` — verify project and MCP config
- `scripts/mcp-helper.sh` — interactive helper menu
- `scripts/setup-claude-desktop.sh` — copy config to Claude Desktop (if using desktop app)

Slack integration

- **Reporter file**: this repo includes a custom Playwright reporter at `reporters/slack-reporter.ts` that aggregates test totals and top failures and posts a Slack notification (with retries) at the end of a run.

- **Playwright config**: the reporter is registered in `playwright.config.ts`. For this test repository the Slack webhook is currently hard-coded in that file (so the reporter can post without additional setup). If you prefer the safer approach, change the config to pass `process.env.SLACK_WEBHOOK` and set the secret in CI instead.

- **Local run (hard-coded webhook)**: because the webhook is hard-coded in `playwright.config.ts`, simply running tests will post to Slack. Example:

```bash
# install deps (once)
npm ci

# run tests (will post to the configured webhook)
npx playwright test
```

- **Manual webhook test (curl)**: you can still test a webhook directly with curl (replace the URL with your webhook):

```bash
curl -X POST --data-urlencode "payload={\"channel\": \"#my-channel-here\", \"username\": \"webhookbot\", \"text\": \"This is posted to #my-channel-here and comes from a bot named webhookbot.\", \"icon_emoji\": \":ghost:\"}" https://hooks.slack.com/services/xxxxxxxxx/xxxxxxxxx/xxxxxxxxxxxxxxxx
```

- **GitHub Actions CI**: there is a workflow at `.github/workflows/playwright-ci.yml` that runs tests on `main` (on push/PR). The workflow does the following:
	- Installs Node 20 and caches npm
	- Runs `npm ci` in the repo root and executes the root `npm test` (root Playwright run)
	- Installs dependencies and runs `npm ci` and `npm test` inside `api-sample` (so API tests run as a separate package)
	- Installs Playwright browsers (`npx playwright install --with-deps`)
	- Uploads two artifacts on completion: `playwright-report` (root) and `api-sample-report` (api-sample)


Project layout
- `src/` — page objects, agents, core framework
- `tests/` — Playwright test specs
- `tests/data/` — generated Excel test data
- `scripts/` — helper scripts

Notes
- Do not commit secrets (API keys) to version control