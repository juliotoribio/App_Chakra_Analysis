// Seleccionar todos los círculos de los chakras delanteros
const chakrasDelanteros = document.querySelectorAll('#Chakras_x5F_Primarios_x5F_Delantero circle');
let selectedChakra = null;

// Objetos para almacenar datos separados para cada chakra
let originalChakraColors = {};     // Color original
let selectedOrientation = {};      // Orientación seleccionada (rotate_right, rotate_left)
let selectedState = {};            // Estado seleccionado (Bloqueado, Exacerbado, Depletado)

// Añadir un evento de clic a cada chakra delantero
chakrasDelanteros.forEach((chakra, index) => {
    const chakraId = `chakra-${index}`;  // Asigna un ID único a cada chakra

    // Guardar el color original del chakra si aún no está guardado
    originalChakraColors[chakraId] = window.getComputedStyle(chakra).getPropertyValue('fill');

    chakra.addEventListener('click', (event) => {
        selectedChakra = event.target;
        
        // Mostrar la orientación y el estado si ya existen en el objeto
        if (selectedOrientation[chakraId]) {
            addOrientationText(chakra, selectedOrientation[chakraId]);
        }
        if (selectedState[chakraId]) {
            addStateText(chakra, selectedState[chakraId]);
        }
        
        // Mostrar el menú de opciones para el chakra seleccionado
        showOptions(selectedChakra, chakraId);
    });
});

// Función para mostrar el menú de opciones cerca del chakra seleccionado
// Función para mostrar el menú de opciones cerca del chakra seleccionado
function showOptions(chakra, chakraId) {
    // Clonar la plantilla del menú y hacerla visible
    const options = document.getElementById('chakra-options-template').cloneNode(true);
    options.classList.remove('hidden');
    document.body.appendChild(options);

    // Posicionar el menú de opciones cerca del chakra seleccionado
    const rect = chakra.getBoundingClientRect();
    options.style.left = `${rect.left + window.scrollX - rect.width / 2}px`;
    options.style.top = `${rect.top + window.scrollY + rect.height}px`;

    // Definir el color de fondo usando el color original guardado del chakra
    const bgColor = originalChakraColors[chakraId] || "#AE9890";

    // Aplicar background-color a los botones de orientación
    const rightButton = options.querySelector('.rotate-right-button');
    const leftButton = options.querySelector('.rotate-left-button');
    
    rightButton.style.backgroundColor = bgColor; // Aplica background-color al botón de orientación horaria
    leftButton.style.backgroundColor = bgColor;  // Aplica background-color al botón de orientación antihoraria

    rightButton.addEventListener('click', () => {
        setOrientation(chakraId, 'rotate_right');
        closeOptions(options);
    });

    leftButton.addEventListener('click', () => {
        setOrientation(chakraId, 'rotate_left');
        closeOptions(options);
    });

    // Aplica background-color a cada botón de estado también
    options.querySelectorAll('.state-buttons .circle-button').forEach((button) => {
        button.style.backgroundColor = bgColor;
        button.addEventListener('click', () => {
            setState(chakraId, button.textContent.trim());
            closeOptions(options);
        });
    });
}


// Función para establecer la orientación del chakra y añadir el texto correspondiente
function setOrientation(chakraId, orientation) {
    selectedOrientation[chakraId] = orientation;  // Guardar la orientación en el objeto correspondiente
    addOrientationText(selectedChakra, orientation);
    updateDirectionDisplay(chakraId);             // Actualizar la visualización de las direcciones de rotación
}

// Función para actualizar visualmente la dirección de los textos de cada chakra
function updateDirectionDisplay(chakraId) {
    // Obtén la dirección seleccionada del chakra desde selectedOrientation
    const direction = selectedOrientation[chakraId];

    // Selecciona los elementos de texto correspondientes al chakra específico
    const rightText = document.getElementById(`${chakraId}_Dir_Right`);
    const leftText = document.getElementById(`${chakraId}_Dir_Left`);

    // Mostrar u ocultar según la dirección
    if (direction === 'rotate_right') {
        rightText.style.display = 'inline';  // Mostrar dirección horaria
        leftText.style.display = 'none';     // Ocultar dirección antihoraria
    } else if (direction === 'rotate_left') {
        rightText.style.display = 'none';    // Ocultar dirección horaria
        leftText.style.display = 'inline';   // Mostrar dirección antihoraria
    } else {
        // Si no se ha seleccionado dirección, mostrar ambos (o como prefieras)
        rightText.style.display = 'inline';
        leftText.style.display = 'inline';
    }
}

// Función para añadir el texto de orientación (Horario o Antihorario) al chakra
function addOrientationText(chakra, orientation) {
    let orientationText = chakra.parentNode.querySelector(`.orientation-text-${chakra.id}`);
    if (!orientationText) {
        orientationText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        orientationText.setAttribute("class", `orientation-text-${chakra.id}`);
        orientationText.setAttribute("text-anchor", "middle");
        orientationText.setAttribute("fill", "#AE9890");
        orientationText.style.fontSize = "15px";
        chakra.parentNode.insertBefore(orientationText, chakra.nextSibling);
    }
    
    // Posicionar el texto al lado del chakra
    orientationText.setAttribute("x", parseFloat(chakra.getAttribute("cx")) + 12);
    orientationText.setAttribute("y", parseFloat(chakra.getAttribute("cy")) + 4);

    // Mostrar "Horario" para rotate_right y "Antihorario" para rotate_left
    orientationText.textContent = orientation === 'rotate_right' ? '↻' : '↺'; // '↻' para horario, '↺' para antihorario
}



// Función para establecer el estado del chakra y añadir el texto correspondiente
function setState(chakraId, state) {
    selectedState[chakraId] = state;  // Guardar el estado en el objeto correspondiente
    addStateText(selectedChakra, state);

    // Cambiar el color del chakra a #AE9890 si el estado es "X", o restaurar el color original
    if (state.toLowerCase() === 'x') {
        selectedChakra.classList.add('chakra-background');  // Añade clase con el color de fondo
    } else {
        selectedChakra.classList.remove('chakra-background');  // Elimina clase si el estado no es "X"
    }
}



// Función para añadir el texto de estado (Bloqueado, Exacerbado, Depletado) al chakra
function addStateText(chakra, state) {
    let stateText = chakra.parentNode.querySelector(`.state-text-${chakra.id}`);
    if (!stateText) {
        stateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        stateText.setAttribute("class", `state-text-${chakra.id}`);
        stateText.setAttribute("text-anchor", "middle");
        stateText.setAttribute("fill", "#ffffff");
        stateText.style.fontSize = "11px";
        chakra.parentNode.insertBefore(stateText, chakra.nextSibling);
    }
    stateText.setAttribute("x", chakra.getAttribute("cx"));
    stateText.setAttribute("y", parseFloat(chakra.getAttribute("cy")) + 4);
    stateText.textContent = state;
}

// Función para cerrar el menú de opciones
function closeOptions(options) {
    options.remove();
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
