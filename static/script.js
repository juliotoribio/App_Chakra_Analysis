// Seleccionar todos los círculos de los chakras delanteros
const chakrasDelanteros = document.querySelectorAll('#Chakras_x5F_Primarios_x5F_Delantero circle');
let selectedChakra = null;
let originalChakraColors = {}; // Objeto para almacenar los colores originales de los chakras
let selectedOrientation = {}; // Objeto para almacenar la orientación seleccionada de cada chakra
let selectedState = {}; // Objeto para almacenar el estado seleccionado de cada chakra

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
            options = createOptionsDiv(optionsId, originalChakraColors[chakraId]);
            document.body.appendChild(options);
        }

        // Mostrar el contenedor de opciones de botones de orientación
        options.classList.remove('hidden');

        // Obtener la posición del chakra clicado
        const rect = selectedChakra.getBoundingClientRect();
        const offsetX = rect.width / 2;
        const offsetY = rect.height / 2;

        // Ajustar la posición del div de opciones con respecto al chakra clicado
        options.style.left = `${rect.left + window.scrollX - offsetX}px`;
        options.style.top = `${rect.top + window.scrollY + offsetY + 20}px`;
    });
});

// Función para crear un nuevo div de opciones con orientación y estado
function createOptionsDiv(chakraId, chakraColor) {
    // Clonar la plantilla de opciones desde el HTML
    const template = document.getElementById('chakra-options-template');
    const clone = template.cloneNode(true);

    clone.id = chakraId;
    clone.classList.remove('hidden');

    // Añadir eventos a los botones de orientación
    const orientationButtons = clone.querySelectorAll('.buttons-container:nth-of-type(1) .circle-button');
    orientationButtons.forEach(button => {
        button.style.backgroundColor = chakraColor; // Aplicar el color del chakra
        button.onclick = () => {
            // Marcar botón seleccionado
            clearSelectedButtons(orientationButtons);
            button.classList.add('selected');

            // Guardar la orientación seleccionada para el chakra actual
            selectedOrientation[chakraId] = button.textContent;
        };
    });

    // Añadir eventos a los botones de estado
    const stateButtons = clone.querySelectorAll('.buttons-container:nth-of-type(2) .circle-button');
    stateButtons.forEach(button => {
        button.style.backgroundColor = chakraColor; // Aplicar el color del chakra
        button.onclick = () => {
            // Resaltar el botón seleccionado
            clearSelectedButtons(stateButtons);
            button.classList.add('selected');

            // Comprobar si la orientación fue seleccionada antes de permitir seleccionar el estado
            if (!selectedOrientation[chakraId]) {
                alert('Por favor, selecciona primero una dirección.');
                return;
            }

            // Guardar el estado seleccionado para el chakra actual
            selectedState[chakraId] = button.textContent;

            // Actualizar el estado del chakra y ocultar las opciones
            addTextToChakra(selectedChakra, button.textContent);
            updateChakraState(button, selectedChakra, originalChakraColors[chakraId]);
            clone.classList.add('hidden');
        };
    });

    return clone;
}

// Función para limpiar la clase 'selected' de un grupo de botones
function clearSelectedButtons(buttons) {
    buttons.forEach(button => button.classList.remove('selected'));
}

// Función para añadir texto al chakra seleccionado
function addTextToChakra(chakra, textContent) {
    let textElement = chakra.nextElementSibling;
    if (!textElement || textElement.tagName !== 'text') {
        textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", chakra.getAttribute("cx"));
        textElement.setAttribute("y", chakra.getAttribute("cy"));
        textElement.setAttribute("text-anchor", "middle");
        textElement.setAttribute("dy", ".3em");
        chakra.parentNode.insertBefore(textElement, chakra.nextSibling);
    }

    textElement.textContent = textContent;
    textElement.style.fill = "#fff";
    textElement.style.fontSize = "11px";
    textElement.style.fontWeight = "bold";
    textElement.style.fontFamily = "Carlito, sans-serif";

    textElement.addEventListener('click', (event) => {
        event.stopPropagation();
        showOptionsForText(chakra);
    });
}

// Función para actualizar el estado visual del chakra
function updateChakraState(button, chakra, originalColor) {
    if (button.textContent.toLowerCase() === 'x') {
        chakra.setAttribute('fill', '#000');
    } else {
        chakra.setAttribute('fill', originalColor);
    }
}

// Función para mostrar las opciones al hacer clic en el texto del chakra
function showOptionsForText(chakra) {
    document.querySelectorAll('.chakra-options').forEach(optionDiv => {
        optionDiv.classList.add('hidden');
    });

    const index = Array.from(chakrasDelanteros).indexOf(chakra);
    const chakraId = `chakra-options-${index}`;
    let options = document.getElementById(chakraId);

    if (options) {
        options.classList.remove('hidden');

        const rect = chakra.getBoundingClientRect();
        const offsetX = rect.width / 2;
        const offsetY = rect.height / 2;
        options.style.left = `${rect.left + window.scrollX - offsetX}px`;
        options.style.top = `${rect.top + window.scrollY + offsetY + 20}px`;
    }
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
