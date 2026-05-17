# Kiosco GROC — Valoración de Mejora Clínica

Kiosco táctil para registrar la Escala Global de Cambio (GROC) al alta de pacientes de rehabilitación. Los datos se guardan directamente en Google Sheets.

## Tecnología

- **Google Apps Script** — backend y hosting de la webapp
- **HTML + Tailwind CSS v2** — interfaz táctil responsive
- **Clasp** — sincronización local ↔ GAS via CLI
- **Git + GitHub** — control de versiones

## Arquitectura

```
VS Code (WSL)
      │
      ├── git push ──→ GitHub (historial)
      │
      └── clasp push ──→ Google Apps Script ──→ Google Sheets
```

## Configuración inicial

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para la guía completa de instalación y flujo de trabajo diario.

El `SHEET_ID` de Google Sheets se guarda en **Propiedades del script** (nunca en el código fuente).

## Flujo de trabajo

```bash
# Editar en VS Code, luego:
git add . && git commit -m "..." && git push   # → GitHub
clasp push                                      # → Google Apps Script
```

## Notas

- La webapp es de acceso anónimo (`ANYONE_ANONYMOUS`) — diseñada para uso en kiosco interno
- Reset automático del formulario tras envío exitoso (5 s)
- Timeout de red de 15 s en el frontend
