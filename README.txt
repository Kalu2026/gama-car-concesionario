GAMA CONCESIONARIO — SITIO WEB ESTÁTICO

ARCHIVOS
- index.html: estructura y contenido de la página.
- styles.css: diseño, colores y adaptación a móviles.
- script.js: inventario de demostración, buscador, filtros, menú móvil y formularios.

ABRIR EN VISUAL STUDIO CODE
1. Descomprime gama-web.zip.
2. Abre la carpeta gama-web en Visual Studio Code (Archivo > Abrir carpeta).
3. Abre index.html en tu navegador. También puedes instalar la extensión Live Server y usar “Open with Live Server”.

ANTES DE PUBLICAR
1. Abre script.js y busca WHATSAPP_NUMBER al comienzo. Reemplaza la cadena vacía por el número oficial de WhatsApp de GAMA, en formato internacional y solo números. Para Colombia usa 57 seguido del número celular, por ejemplo el formato 573001234567 (es un ejemplo de formato, no un número de GAMA).
2. En script.js sustituye los seis vehículos de demostración por el inventario confirmado y sus precios reales.
3. Reemplaza las fotos ilustrativas por fotos propias del concesionario/vehículos.
4. Revisa la información de contacto, textos legales y política de tratamiento de datos antes de publicar.

NOTAS
- No requiere Node.js, npm ni un servidor backend: es HTML, CSS y JavaScript nativo.
- Las imágenes actuales se cargan desde Unsplash; por eso la conexión a internet permite verlas.
- El formulario prepara un mensaje para WhatsApp. No almacena ni envía datos a un servidor.
- El diseño muestra una etiqueta de catálogo demostrativo para evitar confundir los precios de ejemplo con ofertas vigentes.
