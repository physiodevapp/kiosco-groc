// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN
//  Guarda el ID de la hoja en Archivo > Propiedades del proyecto
//  > Propiedades del script  (clave: SHEET_ID)
//  Así el ID nunca queda expuesto en el código fuente.
// ─────────────────────────────────────────────────────────────
const SHEET_NAME = 'Respuestas';

function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Valoración GROC - Clínica')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setFaviconUrl("https://www.clinicauniversitarialasalle.es/wp-content/uploads/2024/10/cropped-estrella-1-32x32.png")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function guardarRespuesta(datos) {
  try {
    // ── 1. Presencia de datos ────────────────────────────────
    if (!datos) {
      throw new Error('No se recibieron datos.');
    }

    const { fechaFin, idProceso, valorGroc } = datos;

    if (!fechaFin || !idProceso || valorGroc === undefined || valorGroc === null) {
      throw new Error('Faltan campos obligatorios.');
    }

    // ── 2. Validación de fecha ───────────────────────────────
    // fechaFin llega como string "YYYY-MM-DD"; comprobamos que
    // sea una fecha real, no texto arbitrario.
    const fechaParsed = new Date(fechaFin);
    if (isNaN(fechaParsed.getTime())) {
      throw new Error('La fecha de alta no es válida.');
    }

    // ── 3. Validación del valor GROC ─────────────────────────
    const valor = Number(valorGroc);
    if (isNaN(valor) || valor < -7 || valor > 7 || !Number.isInteger(valor)) {
      throw new Error('El valor GROC debe ser un entero entre -7 y 7.');
    }

    // ── 4. Validación básica del ID de proceso ───────────────
    // Admite letras, números, guiones y espacios; mínimo 2 caracteres.
    if (!/^[\w\s\-]{2,50}$/i.test(idProceso)) {
      throw new Error('El ID de proceso contiene caracteres no permitidos o es demasiado corto/largo.');
    }

    // ── 5. Etiquetas (claves como strings para evitar ambigüedad) ──
    const etiquetas = {
      "7":  "Muchísimo mejor",
      "6":  "Mucho mejor",
      "5":  "Moderadamente mejor",
      "4":  "Algo mejor",
      "3":  "Un poco mejor",
      "2":  "Casi igual (un poco mejor)",
      "1":  "Casi igual (mínimamente mejor)",
      "0":  "Sin cambios",
      "-1": "Casi igual (mínimamente peor)",
      "-2": "Casi igual (un poco peor)",
      "-3": "Un poco peor",
      "-4": "Algo peor",
      "-5": "Moderadamente peor",
      "-6": "Mucho peor",
      "-7": "Muchísimo peor"
    };

    // ── 6. Apertura de la hoja ───────────────────────────────
    const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (!sheetId) {
      throw new Error('SHEET_ID no configurado en las propiedades del script.');
    }

    const ss = SpreadsheetApp.openById(sheetId);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Cabeceras si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Fecha Fin Tratamiento',
        'ID Proceso Rehabilitación',
        'Valor GROC',
        'Etiqueta GROC'
      ]);

      // Formato de cabecera: negrita + fondo azul marca
      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#202A60');
      headerRange.setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }

    // ── 7. Escritura con bloqueo de concurrencia ─────────────
    const lock = LockService.getScriptLock();
    lock.waitLock(10000); // espera hasta 10 s antes de fallar

    try {
      sheet.appendRow([
        new Date(),           // Timestamp exacto del servidor
        fechaParsed,          // Objeto Date (Google lo formatea automáticamente)
        idProceso.trim(),     // Sin espacios sobrantes
        valor,
        etiquetas[String(valor)] || ''
      ]);
    } finally {
      lock.releaseLock();
    }

    return { success: true, message: 'Fila guardada correctamente' };

  } catch (error) {
    console.error('Error en guardarRespuesta:', error);
    return {
      success: false,
      error: error.message || String(error)
    };
  }
}