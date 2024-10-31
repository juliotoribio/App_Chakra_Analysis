// Seleccionar todos los círculos de los polos delanteros
const polosDelanteros = document.querySelectorAll('#Polos_x5F_Delantero circle');
let selectedPolo = null;

// Objetos para almacenar datos para cada polo
let originalPoloColors = {};
let selectedPoloOrientation = {};
let selectedPoloState = {};

// Añadir un evento de clic a cada polo delantero
polosDelanteros.forEach((polo, index) => {
    const poloId = `polo-${index}`;  // Asigna un ID único a cada polo

    // Guardar el color original del polo si aún no está guardado
    originalPoloColors[poloId] = window.getComputedStyle(polo).getPropertyValue('fill');

    polo.addEventListener('click', (event) => {
        selectedPolo = event.target;

        // Mostrar la orientación y el estado si ya existen en el objeto
        if (selectedPoloOrientation[poloId]) {
            addPoloOrientationText(polo, selectedPoloOrientation[poloId]);
        }
        if (selectedPoloState[poloId]) {
            addPoloStateText(polo, selectedPoloState[poloId]);
        }

        // Mostrar el menú de opciones para el polo seleccionado
        showPoloOptions(selectedPolo, poloId);
    });
});

// Función para mostrar el menú de opciones cerca del polo seleccionado
function showPoloOptions(polo, poloId) {
    // Clonar la plantilla del menú y hacerla visible
    const options = document.getElementById('polo-options-template').cloneNode(true);
    options.classList.remove('hidden');
    document.body.appendChild(options);

    // Posicionar el menú de opciones cerca del polo seleccionado
    const rect = polo.getBoundingClientRect();
    options.style.left = `${rect.left + window.scrollX - rect.width / 2}px`;
    options.style.top = `${rect.top + window.scrollY + rect.height}px`;

    // Definir el color de fondo usando el color original guardado del polo
    const bgColor = originalPoloColors[poloId] || "#AE9890";

    // Aplicar background-color a los botones de orientación
    const rightButton = options.querySelector('.rotate-right-button');
    const leftButton = options.querySelector('.rotate-left-button');
    
    rightButton.style.backgroundColor = bgColor; // Aplica background-color al botón de orientación horaria
    leftButton.style.backgroundColor = bgColor;  // Aplica background-color al botón de orientación antihoraria

    // Evento para seleccionar orientación horaria o antihoraria
    rightButton.addEventListener('click', () => {
        setPoloOrientation(poloId, 'rotate_right');
    });

    leftButton.addEventListener('click', () => {
        setPoloOrientation(poloId, 'rotate_left');
    });

    // Aplicar background-color a cada botón de estado también
    options.querySelectorAll('.state-buttons .circle-button').forEach((button) => {
        button.style.backgroundColor = bgColor;
        button.addEventListener('click', () => {
            setPoloState(poloId, button.textContent.trim());
            closePoloOptions(options);
        });
    });
}

// Función para establecer la orientación del polo y añadir el texto correspondiente
function setPoloOrientation(poloId, orientation) {
    selectedPoloOrientation[poloId] = orientation;  // Guardar la orientación en el objeto correspondiente
    addPoloOrientationText(selectedPolo, orientation);
}

// Función para añadir el texto de orientación (Horario o Antihorario) al polo
function addPoloOrientationText(polo, orientation) {
    let orientationText = polo.parentNode.querySelector(`.orientation-text-${polo.id}`);
    if (!orientationText) {
        orientationText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        orientationText.setAttribute("class", `orientation-text-${polo.id}`);
        orientationText.setAttribute("text-anchor", "middle");
        orientationText.setAttribute("fill", "#AE9890");
        orientationText.style.fontSize = "15px";
        polo.parentNode.insertBefore(orientationText, polo.nextSibling);
    }

    // Posicionar el texto al lado del polo
    orientationText.setAttribute("x", parseFloat(polo.getAttribute("cx")) + 14);
    orientationText.setAttribute("y", parseFloat(polo.getAttribute("cy")) + 4);

    // Mostrar "↻" para horario y "↺" para antihorario
    orientationText.textContent = orientation === 'rotate_right' ? '↻' : '↺';
}

// Función para establecer el estado del polo y añadir el texto correspondiente
function setPoloState(poloId, state) {
    selectedPoloState[poloId] = state;  // Guardar el estado en el objeto correspondiente
    addPoloStateText(selectedPolo, state);

    // Cambiar el color del polo a #AE9890 si el estado es "X", o restaurar el color original
    if (state.toLowerCase() === 'x') {
        selectedPolo.style.fill = "#AE9890";  // Cambiar color a #AE9890 si está bloqueado
    } else {
        selectedPolo.style.fill = originalPoloColors[poloId];  // Restaurar color original
    }
}

// Función para añadir el texto de estado al polo
function addPoloStateText(polo, state) {
    let stateText = polo.parentNode.querySelector(`.state-text-${polo.id}`);
    if (!stateText) {
        stateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        stateText.setAttribute("class", `state-text-${polo.id}`);
        stateText.setAttribute("text-anchor", "middle");
        stateText.setAttribute("fill", "#ffffff");
        stateText.style.fontSize = "11px";
        polo.parentNode.insertBefore(stateText, polo.nextSibling);
    }
    stateText.setAttribute("x", polo.getAttribute("cx"));
    stateText.setAttribute("y", parseFloat(polo.getAttribute("cy")) + 4);
    stateText.textContent = state;
}

// Función para cerrar el menú de opciones
function closePoloOptions(options) {
    options.remove();
}

// Evento para cerrar los menús si se hace clic fuera de ellos
document.addEventListener('click', (event) => {
    const clickedInside = event.target.closest('.polo-options') || event.target.closest('#Polos_x5F_Delantero circle');
    if (!clickedInside) {
        document.querySelectorAll('.polo-options').forEach(optionDiv => {
            optionDiv.classList.add('hidden');
        });
    }
});
