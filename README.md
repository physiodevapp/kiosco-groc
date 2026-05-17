# Kiosco GROC — Clinical Improvement Assessment

Touch kiosk for recording the Global Rating of Change (GROC) scale at patient discharge from rehabilitation. Data is saved directly to Google Sheets.

## Tech stack

- **Google Apps Script** — backend and webapp hosting
- **HTML + Tailwind CSS v2** — responsive touch interface
- **Clasp** — local ↔ GAS sync via CLI
- **Git + GitHub** — version control

## Architecture

```
VS Code (WSL)
      │
      ├── git push ──→ GitHub (history)
      │
      └── clasp push ──→ Google Apps Script ──→ Google Sheets
```

## Setup

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full installation guide and development workflow.

The Google Sheets `SHEET_ID` is stored in **Script Properties** (never in source code).

## Workflow

```bash
# Edit in VS Code, then:
git add . && git commit -m "..." && git push   # → GitHub
clasp push                                      # → Google Apps Script
clasp deploy --deploymentId <id>               # → production URL
```

## Notes

- Webapp is anonymously accessible (`ANYONE_ANONYMOUS`) — designed for internal kiosk use
- Automatic form reset after successful submission (5 s)
- Network timeout of 15 s in the frontend
