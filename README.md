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

Troubleshooting
- Playwright browser deps (Linux/CI):

```bash
sudo npx playwright install-deps
```

- If a test fails to launch a browser, run `npx playwright install` and the `install-deps` command above.
- If TypeScript scripts error with `ts-node` missing, install dev deps:

```bash
npm install --save-dev ts-node typescript @types/node
```

- Single-file runs and parallelism: using `-j 1` limits job shards; Playwright will still use workers defined in config.

Project layout
- `src/` — page objects, agents, core framework
- `tests/` — Playwright test specs
- `tests/data/` — generated Excel test data
- `scripts/` — helper scripts

Notes
- Do not commit secrets (API keys) to version control. Use `.env` and `.env.example`.
- If tests that expect a local app are skipped, set `BASE_URL` environment variable to run against a real app: `BASE_URL=http://your-app:3000 npm test`.
