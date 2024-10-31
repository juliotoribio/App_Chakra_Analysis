// download-button.js

document.getElementById('download-button').addEventListener('click', function() {
    // Selecciona el contenedor que quieres capturar
    const content = document.body;

    // Usa html2canvas para capturar el contenido
    html2canvas(content, {
        scale: 2,  // Aumenta la resolución
        useCORS: true, // Permite cargar imágenes externas
        backgroundColor: null // Hace el fondo transparente
    }).then(canvas => {
        // Convierte el canvas a URL de imagen
        const imgData = canvas.toDataURL('image/png');

        // Crea un enlace de descarga
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'pagina_web.png'; // Nombre del archivo de la imagen
        link.click();
    });
});
