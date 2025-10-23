import { addInteraction, updateDisplay, reset, counterInstance } from './counter.js';

// Mapa para rastrear el estado de las teclas presionadas (necesario para detectar combinaciones)
const pressedKeys = {};
// 🚨 NUEVO: Mapa para rastrear si la interacción ya fue contada en este ciclo de keydown
const keyCounted = {}; 

// ---------------------------------------------------------------------
// 1. Detección de Entorno y Configuración de UI
// ---------------------------------------------------------------------
// Verificamos si la página actual contiene el canvas de Unity. Si lo tiene, es una escena de juego.
const isUnityScene = document.getElementById('unity-canvas') !== null;
const statusElement = document.getElementById('current-status');
const detectorElement = document.getElementById('interaction-detector');
const toggleButton = document.getElementById('toggle-button');
const resetButton = document.getElementById('reset-button');

// Inicialización de estado: Siempre grabamos por defecto
let isRecording = true; 

if (!isUnityScene) {
    // Si es el menú principal, actualizamos el texto de estado.
    if (statusElement) {
        statusElement.innerText = "En Menú (No cuenta interacciones)";
    }
    if (detectorElement) {
        detectorElement.classList.add('is-menu');
    }
}


// ---------------------------------------------------------------------
// 2. Lógica de Control (Pausar/Reiniciar)
// ---------------------------------------------------------------------

function toggleRecording() {
    isRecording = !isRecording;
    if (statusElement) {
        statusElement.innerText = isRecording ? "Grabando" : "Pausado";
    }
    if (toggleButton) {
        document.getElementById('button-icon').innerText = isRecording ? '⏸️' : '▶️';
    }
}

function handleReset() {
    // Usamos el confirm() global, si no existe lo simulamos
    if ((window.confirm || console.log)('¿Estás seguro de que quieres reiniciar el contador a cero?')) {
        reset();
        isRecording = true; // Reiniciar implica volver a grabar
        if (statusElement) {
            statusElement.innerText = "Grabando";
        }
        if (toggleButton) {
            document.getElementById('button-icon').innerText = '⏸️';
        }
    }
}

// ---------------------------------------------------------------------
// 3. Lógica de Teclado y Conteo
// ---------------------------------------------------------------------

// Handler que se ejecuta al presionar una tecla
function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    
    // Guardamos el estado de la tecla presionada
    pressedKeys[key] = true;

    // Prevenimos el comportamiento por defecto de 'espacio', 'w' y 'g'
    if (key === ' ' || key === 'w' || key === 'g') {
        event.preventDefault();
    }

    // Lógica CONDICIONAL de Conteo:
    // 1. Solo contamos si estamos en una escena de Unity
    // 2. Solo contamos si el contador no está pausado
    if (!isUnityScene || !isRecording) {
        return; 
    }

    // Lógica de conteo: Contar si se presionó 'espacio' Y al mismo tiempo 'w' o 'g'
    if (pressedKeys[' ']) {
        const targetKeys = ['w', 'g'];
        if (targetKeys.includes(key)) {
            // Creamos una clave única para la combinación (ej: "space+w" o "space+g")
            const comboKey = `space+${key}`; 

            // 🚨 SOLUCIÓN AL BUG DE AUTO-REPETICIÓN
            // Solo contamos si esta combinación NO ha sido contada todavía
            if (!keyCounted[comboKey]) {
                addInteraction(key); // Llama a la función de contador.
                keyCounted[comboKey] = true; // Marcamos como contado
            }
        }
    }
}

// Handler que se ejecuta al soltar una tecla
function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    pressedKeys[key] = false;

    // 🚨 LIMPIEZA: Al soltar la tecla 'w' o 'g', reseteamos el flag de contado
    if (key === 'w' || key === 'g') {
        keyCounted[`space+${key}`] = false;
    }
    // 🚨 LIMPIEZA: Si suelta 'espacio', también reseteamos ambos flags por si acaso.
    if (key === ' ') {
        keyCounted['space+w'] = false;
        keyCounted['space+g'] = false;
    }
}

// ---------------------------------------------------------------------
// 4. Attach Event Listeners
// ---------------------------------------------------------------------

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Eventos para los botones de control
if (toggleButton) {
    toggleButton.addEventListener('click', toggleRecording);
}
if (resetButton) {
    resetButton.addEventListener('click', handleReset);
}

// Inicializar la visualización del contador al cargar la página (Importante para el menú)
document.addEventListener('DOMContentLoaded', updateDisplay);

// 🚨 CORRECCIÓN: Evita el uso de confirm() si no existe, simulándolo para evitar errores
window.confirm = window.confirm || function(message) {
    console.log("Simulación de confirmación: " + message);
    return true; 
};
