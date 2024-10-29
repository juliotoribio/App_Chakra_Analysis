// Seleccionar todos los círculos de los chakras delanteros
const chakrasDelanteros = document.querySelectorAll('#Chakras_x5F_Primarios_x5F_Delantero circle');
let selectedChakra = null;
let originalChakraColors = {}; // Objeto para almacenar los colores originales de los chakras

// Añadir un evento de clic a cada chakra delantero
chakrasDelanteros.forEach((chakra, index) => {
    chakra.addEventListener('click', (event) => {
        // Ocultar todos los menús de opciones existentes
        document.querySelectorAll('.chakra-options').forEach(optionDiv => {
            optionDiv.classList.add('hidden');
        });

        // Guardar el chakra seleccionado
        selectedChakra = event.target;

        // Guardar el color original del chakra si aún no está guardado
        const chakraId = `chakra-${index}`;
        if (!originalChakraColors[chakraId]) {
            originalChakraColors[chakraId] = window.getComputedStyle(selectedChakra).getPropertyValue('fill');
        }

        // Crear un ID único para el menú de opciones de este chakra
        const optionsId = `chakra-options-${index}`;

        // Verificar si el div de opciones ya existe, si no, crearlo
        let options = document.getElementById(optionsId);
        if (!options) {
            options = createOptionsDiv(optionsId, selectedChakra);
            document.body.appendChild(options);
        }

        // Obtener el color del chakra clicado utilizando 'getComputedStyle'
        const chakraColor = originalChakraColors[chakraId];

        // Cambiar el color de fondo de cada botón al color del chakra clicado
        const circleButtons = options.querySelectorAll('.circle-button');
        circleButtons.forEach(button => {
            button.style.backgroundColor = chakraColor;

            // Añadir lógica de clic para cada botón
            button.onclick = () => {
                addTextToChakra(selectedChakra, button.textContent);
                
                // Cambiar el color del chakra basado en la selección
                if (button.textContent.toLowerCase() === 'x') {
                    selectedChakra.style.fill = '#ad9890'; // Cambiar color a negro usando CSS inline
                } else {
                    // Restaurar el color original del chakra si se selecciona "+" o "-"
                    selectedChakra.style.fill = chakraColor;
                }

                // Ocultar el contenedor de opciones después de seleccionar
                options.classList.add('hidden');
            };
        });

        // Mostrar el contenedor de opciones de botones
        options.classList.remove('hidden');

        // Obtener la posición del chakra clicado
        const rect = selectedChakra.getBoundingClientRect();
        const offsetX = rect.width / 2; // Para centrar el div horizontalmente respecto al chakra
        const offsetY = rect.height / 2; // Para posicionar el div justo debajo del chakra

        // Ajustar la posición del div de opciones con respecto al chakra clicado
        options.style.left = `${rect.left + window.scrollX - offsetX}px`;
        options.style.top = `${rect.top + window.scrollY + offsetY + 20}px`;
    });
});

// Función para crear un nuevo div de opciones
function createOptionsDiv(chakraId, chakraElement) {
    // Crear el contenedor principal del menú de opciones
    const options = document.createElement('div');
    options.id = chakraId;
    options.className = 'chakra-options hidden';

    // Crear la estructura interna del menú
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    const title = document.createElement('p');
    title.className = 'options-title';
    title.textContent = 'Selecciona el estado:';
    optionsContainer.appendChild(title);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    ['x', '+', '-'].forEach(symbol => {
        const button = document.createElement('button');
        button.className = 'circle-button';
        button.textContent = symbol;
        buttonsContainer.appendChild(button);
    });

    optionsContainer.appendChild(buttonsContainer);
    options.appendChild(optionsContainer);

    return options;
}

// Función para añadir texto al chakra seleccionado
function addTextToChakra(chakra, textContent) {
    // Verificar si ya hay un elemento de texto asociado al chakra
    let textElement = chakra.nextElementSibling;
    if (!textElement || textElement.tagName !== 'text') {
        // Crear un nuevo elemento de texto si no existe
        textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", chakra.getAttribute("cx"));
        textElement.setAttribute("y", chakra.getAttribute("cy"));
        textElement.setAttribute("text-anchor", "middle");
        textElement.setAttribute("dy", ".3em");
        chakra.parentNode.insertBefore(textElement, chakra.nextSibling);
    }

    // Actualizar el contenido del elemento de texto con el símbolo seleccionado
    textElement.textContent = textContent;
    textElement.style.fill = "#fff"; // Color del texto, puedes cambiarlo si deseas
    textElement.style.fontSize = "11px";
    textElement.style.fontWeight = "bold";
    textElement.style.fontFamily = "'Montserrat', sans-serif"; // Aplicar la fuente Montserrat

    // Añadir evento de clic al texto para volver a mostrar el menú de opciones
    textElement.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevenir que el clic cierre el menú de opciones
        showOptionsForText(chakra);
    });
}

// Función para mostrar las opciones al hacer clic en el texto del chakra
function showOptionsForText(chakra) {
    // Ocultar todos los menús de opciones existentes
    document.querySelectorAll('.chakra-options').forEach(optionDiv => {
        optionDiv.classList.add('hidden');
    });

    // Identificar el índice del chakra para obtener el menú de opciones correspondiente
    const index = Array.from(chakrasDelanteros).indexOf(chakra);
    const optionsId = `chakra-options-${index}`;
    let options = document.getElementById(optionsId);

    // Mostrar el contenedor de opciones de botones
    options.classList.remove('hidden');

    // Obtener la posición del chakra
    const rect = chakra.getBoundingClientRect();
    const offsetX = rect.width / 2;
    const offsetY = rect.height / 2;

    // Ajustar la posición del div de opciones con respecto al chakra clicado
    options.style.left = `${rect.left + window.scrollX - offsetX}px`;
    options.style.top = `${rect.top + window.scrollY + offsetY + 20}px`;
}

// Evento para cerrar los menús si se hace clic fuera de ellos
document.addEventListener('click', (event) => {
    const clickedInside = event.target.closest('.chakra-options') || event.target.closest('#Chakras_x5F_Primarios_x5F_Delantero circle');
    if (!clickedInside) {
        document.querySelectorAll('.chakra-options').forEach(optionDiv => {
            optionDiv.classList.add('hidden');
        });
    }
});
