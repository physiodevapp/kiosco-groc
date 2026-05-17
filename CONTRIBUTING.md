# Kiosco GROC — Version control with Clasp + Git + GitHub

Guide for connecting an existing Google Apps Script project with VS Code and GitHub.

---

## Prerequisites

- WSL active in VS Code
- Node.js and npm installed in WSL

```bash
node -v   # v24+
npm -v    # v11+
```

---

## 1. Install Clasp

```bash
npm install -g @google/clasp
clasp --version   # verify installation
```

Enable the Apps Script API on your Google account (once only):
👉 https://script.google.com/home/usersettings → **"Google Apps Script API"** → Enable

---

## 2. Log in to Clasp

```bash
clasp login
```

Copy the link shown in the terminal, paste it in your Windows browser, and authorize with your Google account. Accept **all** requested permissions.

---

## 3. Get the Script ID

In the GAS web editor:
**⚙️ Project settings → Script ID**

It's a long string like:
```
1BxYz_abcDEF1234567890abcdefGHIJKLMNOP
```

---

## 4. Clone the existing project

```bash
mkdir ~/kiosco-groc
cd ~/kiosco-groc
clasp clone <YOUR_SCRIPT_ID>
```

This downloads the current project files:
- `Código.js`
- `index.html`
- `appsscript.json`
- `.clasp.json` (contains the Script ID — not sensitive)

---

## 5. Open in VS Code

```bash
code .
```

From here, **always edit from VS Code**, not from the GAS web editor.

---

## 6. Create .gitignore

Before the first commit, create `.gitignore`:

```bash
cat > .gitignore << 'EOF'
.clasprc.json
node_modules/
EOF
```

> ⚠️ `.clasprc.json` contains your personal session token — **never push it to GitHub**.
> `.clasp.json` should be included in Git (it only contains the Script ID, no credentials).

---

## 7. Initialize Git and first commit

```bash
git init
git add .
git commit -m "feat: initial commit — kiosco GROC"
```

---

## 8. Create a GitHub repository and connect it

1. Go to [github.com](https://github.com) and create a new repository (e.g. `kiosco-groc`)
2. **Without** initializing with README or .gitignore
3. Connect the remote from WSL:

```bash
git remote add origin https://github.com/YOUR_USERNAME/kiosco-groc.git
git branch -M main
git push -u origin main
```

---

## Clasp reference commands

| Command | Action |
|---|---|
| `clasp push` | Upload changes local → GAS |
| `clasp pull` | Download changes GAS → local |
| `clasp open` | Open the GAS web editor |
| `clasp deployments` | List deployments and their IDs |
| `clasp deploy --deploymentId <id> --description "v1.x"` | Update an existing deployment to the latest pushed code |
| `clasp logs` | View execution logs |
| `clasp --version` | Installed version |

---

## From VS Code to production

### What each action does

| Action | Result | Visible to |
|---|---|---|
| Live Server | Local preview (no `google.script.run`) | You only |
| `clasp push` | Code updated in GAS editor | No one in production |
| `clasp push` + `/dev` URL | Full flow test with Sheets | Project editors only |
| `clasp deploy --deploymentId <id>` | Public `/exec` URL updated | Everyone (patients) |

### GAS URLs

- **`/dev`** — always runs the latest `clasp push`. Requires being logged in as editor. Use for testing.
- **`/exec`** — production URL. Only changes when a new deployment version is created.

### Typical workflow

```bash
# 1. Iterate UI (styles, layout) → Live Server in VS Code

# 2. Test the full flow (real submission to Sheets)
clasp push
# Open /dev URL in the browser

# 3. Save to Git
git add .
git commit -m "type: change description"
git push

# 4. Publish to production
clasp push                                              # if not done in step 2
clasp deployments                                       # copy the deploymentId
clasp deploy --deploymentId <id> --description "v1.x"
```

Steps 3 and 4 are independent of each other.

If someone edited directly in the GAS web editor (avoid when possible):
```bash
clasp pull
git add .
git commit -m "sync: changes from web editor"
git push
```

---

## Project notes

- **SHEET_ID** stored in *Script Properties* (never in source code)
- Tailwind CSS v2 via jsDelivr CDN (no production warning)
- Automatic kiosk reset after successful submission (5 s)
- Network timeout of 15 s in the frontend
