# Guía de traspaso a nueva cuenta de Google

Este documento describe cómo configurar el proyecto Kiosco GROC desde cero en una cuenta de Google distinta (por ejemplo, la cuenta oficial de empresa).

El código no necesita ningún cambio. Solo hay que reconfigurar las credenciales y los identificadores de los servicios externos.

---

## Requisitos previos

- [clasp](https://github.com/google/clasp) instalado globalmente (`npm install -g @google/clasp`)
- Acceso a la cuenta de Google de empresa
- Una hoja de cálculo de Google Sheets en la cuenta de empresa donde se guardarán las respuestas

---

## Pasos

### 1. Crear el proyecto en Google Apps Script

En la cuenta de empresa, ir a [script.google.com](https://script.google.com) y crear un proyecto nuevo vacío. Anotar el `scriptId` que aparece en la URL:

```
https://script.google.com/home/projects/<scriptId>/edit
```

### 2. Autenticar clasp con la cuenta de empresa

```bash
clasp logout
clasp login
```

El navegador abrirá una ventana para seleccionar la cuenta. Entrar con la cuenta de empresa. Esto reemplaza `~/.clasprc.json` con el token nuevo.

### 3. Actualizar `.clasp.json`

Reemplazar el `scriptId` con el del proyecto recién creado:

```json
{
  "scriptId": "<nuevo-script-id>",
  "rootDir": "",
  "scriptExtensions": [".js", ".gs"],
  "htmlExtensions": [".html"],
  "jsonExtensions": [".json"],
  "filePushOrder": [],
  "skipSubdirectories": false
}
```

### 4. Subir el código

```bash
clasp push
```

Verificar en [script.google.com](https://script.google.com) que los archivos (`Código.js`, `index.html`, `appsscript.json`) aparecen correctamente.

### 5. Configurar la Script Property con el ID de la hoja

El `SHEET_ID` no está en el código — se guarda como propiedad del script. En el editor de GAS:

**Proyecto → Propiedades del proyecto → Propiedades de script**

Añadir:
| Clave | Valor |
|-------|-------|
| `SHEET_ID` | ID de la hoja de cálculo de Google Sheets |

El ID de la hoja está en su URL:
```
https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
```

### 6. Crear la implementación (deployment)

En el editor de GAS: **Implementar → Nueva implementación → Aplicación web**

Configuración recomendada:
- **Ejecutar como:** yo (la cuenta de empresa)
- **Quién tiene acceso:** Cualquier usuario (anónimo)

Guardar la URL de la webapp — es la que se usará en producción (cambia respecto a la cuenta anterior).

---

## Verificación

1. Abrir la URL de la webapp en el navegador
2. Completar el formulario y enviar
3. Comprobar que la respuesta aparece en la hoja de cálculo

---

## Notas importantes

- **`executeAs: USER_DEPLOYING`** (configurado en `appsscript.json`): el script corre como la cuenta que hizo el deploy. Esa cuenta debe tener acceso de escritura a la hoja.
- **`~/.clasprc.json`** contiene el token OAuth y no se versiona. Si se trabaja en varios equipos, cada uno debe hacer `clasp login` con la cuenta de empresa.
- **`.clasp.json`** sí se versiona y debe tener el `scriptId` del proyecto de empresa una vez hecho el traspaso.
- Si se necesita volver a la cuenta personal, repetir los pasos 2 y 3 con los valores originales.
