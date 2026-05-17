# CLAUDE.md — Kiosco GROC

## Qué es este proyecto

Kiosco táctil para registrar la Escala Global de Cambio (GROC) al alta de pacientes de rehabilitación. El paciente mueve un slider de -7 a +7 y el valor se guarda en Google Sheets.

## Stack

- `Código.js` — Google Apps Script (backend): expone `doGet()` y `guardarRespuesta(datos)`
- `index.html` — Frontend completo (HTML + CSS + JS inline), servido por GAS via `HtmlService`
- `appsscript.json` — Configuración del proyecto GAS (timezone, permisos, runtime V8)
- `.clasp.json` — Configuración de Clasp (scriptId del proyecto GAS)

## Arquitectura clave

- No hay servidor propio ni base de datos: todo corre en Google Apps Script
- La comunicación frontend→backend es via `google.script.run` (solo funciona cuando la página está desplegada en GAS, no en Live Server)
- El `SHEET_ID` de Google Sheets **no está en el código** — se guarda en Propiedades del script de GAS (`PropertiesService.getScriptProperties()`)
- Tailwind CSS v2 via jsDelivr CDN (sin build step)

## Limitación importante para desarrollo

`google.script.run` no existe fuera de GAS. Live Server sirve para iterar el UI, pero para probar el envío de datos hay que hacer `clasp push` y abrir la URL de la webapp.

## Flujo de deploy

```bash
clasp push    # sube cambios a Google Apps Script
```

Para que los cambios sean visibles en producción puede ser necesario crear una nueva implementación en GAS (`clasp deploy`).

## Validaciones

- `fechaFin`: string `YYYY-MM-DD`, se valida como fecha real
- `idProceso`: regex `[\w\s\-]{2,50}` (letras, números, guion, espacio)
- `valorGroc`: entero entre -7 y 7
- Validación duplicada en cliente (`index.html`) y servidor (`Código.js`)

## Seguridad

- `.clasprc.json` (token OAuth de Google) excluido por `.gitignore` — vive en `~/.clasprc.json`
- `.clasp.json` (solo el scriptId) sí se versiona — no contiene credenciales
- LockService en el backend para evitar escrituras concurrentes en Sheets
