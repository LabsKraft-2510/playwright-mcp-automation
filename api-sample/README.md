# API Sample (Playwright API tests)

This sample module demonstrates API automation using Playwright's API testing features, driven by Excel test data.

Overview
- Tool: Playwright (API tests)
- Language: TypeScript
- Sample public API: https://reqres.in/ (free test API)
- Data-driven: reads `tests/data/api_testcases.xlsx`

Setup
1. Install dependencies (run inside `api-sample`):

```bash
npm install
```

2. Generate sample Excel test cases:

```bash
npm run generate:data
# creates tests/data/api_testcases.xlsx
```

3. Run tests:

```bash
npm test
# or run single file from repo root:
# npx playwright test api-sample/tests/api.spec.ts -j 1
```

Files
- `src/ApiDataProvider.ts` — small helper for reading/writing XLSX
- `scripts/generate-excel.ts` — creates `tests/data/api_testcases.xlsx`
- `tests/api.spec.ts` — Playwright API tests driven from Excel

Integrations & Notes
- MCP servers: you can integrate Playwright, Excel, API, filesystem, and SQL MCP servers in Claude Desktop. Use the project root `claude_desktop_config.json` as a template.
- GitHub Copilot: enable in VS Code via the Copilot extension (install marketplace extension and sign in).
- AI-assisted generation: use Claude Desktop (or Anthropic API) to propose test cases and generate spreadsheet rows; save them into `api-sample/tests/data/`.

Example: add a new test case
1. Open `api-sample/scripts/generate-excel.ts` and add a new test case object
2. Run `npm run generate:data`
3. Run `npm test`

Troubleshooting
- If tests fail to launch, make sure Playwright browsers are installed:
```bash
npx playwright install
sudo npx playwright install-deps    # on Linux CI
```
- If `ts-node` errors appear, install dev deps:
```bash
npm install --save-dev ts-node typescript @types/node
```

Security
- Avoid committing API keys/secrets. Use `.env` and `.env.example` in the repo root.

