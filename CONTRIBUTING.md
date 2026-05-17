# Kiosco GROC — Control de versiones con Clasp + Git + GitHub

Guía para conectar un proyecto existente de Google Apps Script con VS Code y GitHub.

---

## Requisitos previos

- WSL activo en VS Code
- Node.js y npm instalados en WSL

```bash
node -v   # v24+
npm -v    # v11+
```

---

## 1. Instalar Clasp

```bash
npm install -g @google/clasp
clasp --version   # verifica que instaló correctamente
```

Activa la API de Apps Script en tu cuenta Google (solo una vez):
👉 https://script.google.com/home/usersettings → **"Google Apps Script API"** → Activar

---

## 2. Iniciar sesión en Clasp

```bash
clasp login
```

Copia el enlace que aparece en la terminal, pégalo en tu navegador de Windows y autoriza con tu cuenta Google.
Acepta **todos** los permisos que solicita.

---

## 3. Obtener el Script ID

En el editor web de GAS:
**⚙️ Configuración del proyecto → ID de secuencia de comandos**

Es una cadena larga tipo:
```
1BxYz_abcDEF1234567890abcdefGHIJKLMNOP
```

---

## 4. Clonar el proyecto existente

```bash
mkdir ~/kiosco-groc
cd ~/kiosco-groc
clasp clone <TU_SCRIPT_ID>
```

Esto descarga los archivos actuales del proyecto:
- `codigo.gs`
- `index.html`
- `appsscript.json`
- `.clasp.json` (contiene el Script ID, no es sensible)

---

## 5. Abrir en VS Code

```bash
code .
```

A partir de aquí **edita siempre desde VS Code**, no desde el editor web de GAS.

---

## 6. Crear el .gitignore

Antes del primer commit, crea el `.gitignore`:

```bash
cat > .gitignore << 'EOF'
.clasprc.json
node_modules/
EOF
```

> ⚠️ `.clasprc.json` contiene tu token personal de sesión — **nunca debe subirse a GitHub**.
> `.clasp.json` sí debe incluirse en Git (solo tiene el Script ID, no credenciales).

---

## 7. Inicializar Git y primer commit

```bash
git init
git add .
git commit -m "feat: commit inicial — kiosco GROC"
```

---

## 8. Crear repositorio en GitHub y conectarlo

1. Ve a [github.com](https://github.com) y crea un repositorio nuevo (ej. `kiosco-groc`)
2. **Sin** inicializar con README ni .gitignore
3. Conecta el remoto desde WSL:

```bash
git remote add origin https://github.com/TU_USUARIO/kiosco-groc.git
git branch -M main
git push -u origin main
```

---

## Flujo de trabajo diario

```bash
# 1. Editas los archivos en VS Code

# 2. Subes cambios a GitHub
git add .
git commit -m "fix: descripción del cambio"
git push

# 3. Subes cambios a Google Apps Script
clasp push
```

Si alguien editó directamente en el editor web de GAS (evitar en lo posible):
```bash
clasp pull
git add .
git commit -m "sync: cambios desde editor web"
git push
```

---

## Comandos Clasp de referencia

| Comando | Acción |
|---|---|
| `clasp push` | Sube cambios local → GAS |
| `clasp pull` | Descarga cambios GAS → local |
| `clasp open` | Abre el editor web de GAS |
| `clasp deploy` | Crea una nueva implementación |
| `clasp logs` | Ver logs de ejecución |
| `clasp --version` | Versión instalada |

---

## Arquitectura del flujo completo

```
VS Code (WSL)
      │
      ├── git push ──→ GitHub (historial de versiones)
      │
      └── clasp push ──→ Google Apps Script ──→ Google Sheets
```

---

## Notas del proyecto

- **SHEET_ID** almacenado en *Propiedades del script* (nunca en el código)
- Tailwind CSS v2 via jsDelivr (sin warning de producción)
- Reset automático del kiosco tras envío exitoso (5 s)
- Timeout de red de 15 s en el frontend
