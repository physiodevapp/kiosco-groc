# CLAUDE.md — Kiosco GROC

## Qué es este proyecto

Kiosco táctil para registrar la Escala Global de Cambio (GROC) al alta de pacientes de rehabilitación. El paciente mueve un slider de -7 a +7 y el valor se guarda en Google Sheets.

## Stack

- `Código.js` — Google Apps Script (backend): expone `doGet()` y `guardarRespuesta(datos)`
- `index.html` — Frontend completo (HTML + CSS + JS inline), servido por GAS via `HtmlService`
- `appsscript.json` — Configuración del proyecto GAS (timezone, permisos, runtime V8)
- `.clasp.personal.json` / `.clasp.prod.json` — scriptIds de cada entorno (ver Flujo de deploy)
- `.clasp.json` — archivo activo generado por el Makefile, ignorado por git

## Arquitectura clave

- No hay servidor propio ni base de datos: todo corre en Google Apps Script
- La comunicación frontend→backend es via `google.script.run` (solo funciona cuando la página está desplegada en GAS, no en Live Server)
- El `SHEET_ID` de Google Sheets **no está en el código** — se guarda en Propiedades del script de GAS (`PropertiesService.getScriptProperties()`)
- Tailwind CSS v2 via jsDelivr CDN (sin build step)

## Limitación importante para desarrollo

`google.script.run` no existe fuera de GAS. Live Server sirve para iterar el UI, pero para probar el envío de datos hay que hacer `clasp push` y abrir la URL de la webapp.

## Flujo de deploy

Hay dos entornos gestionados con `make`. El archivo `.clasp.json` es generado automáticamente y no se versiona.

```bash
make push-personal   # sube al proyecto GAS personal (pruebas)
make push-prod       # sube al proyecto GAS de producción y revierte .clasp.json
```

Para que los cambios sean visibles en la URL pública puede ser necesario crear una nueva implementación en GAS (`clasp deploy`).

## Validaciones

- `fechaFin`: string `YYYY-MM-DD`, generada automáticamente en el cliente como fecha local de hoy
- `idProceso`: regex `A\d{6}` — siempre "A" + 6 dígitos (ej. A000001), construido por el numpad
- `valorGroc`: entero entre -7 y 7
- Validación en cliente (`index.html`) y servidor (`Código.js`)

## Formato de commits

Cuando se pida hacer un commit, usar siempre este formato:

```bash
git commit -m "título corto en imperativo" -m "descripción cuando sea necesario"
```

- El primer `-m` es el título (máx ~72 caracteres)
- El segundo `-m` solo se incluye cuando hay contexto relevante que añadir
- Nunca usar `git commit` sin flags ni editores interactivos
- **No añadir co-autoría** (`Co-authored-by`) en ningún caso

## Seguridad

- `.clasprc.json` (token OAuth de Google) excluido por `.gitignore` — vive en `~/.clasprc.json`
- `.clasp.json` excluido por `.gitignore` — generado por el Makefile, no contiene credenciales
- `.clasp.personal.json` / `.clasp.prod.json` — sí se versionan, contienen solo el scriptId
- LockService en el backend para evitar escrituras concurrentes en Sheets
