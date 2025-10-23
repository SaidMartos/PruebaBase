// js/counter.js

/**
 * Módulo para gestionar el estado de los contadores únicos de interacción
 * usando localStorage para la persistencia entre páginas.
 */
class Counter { // Eliminamos 'export' de la clase
    constructor() {
        // En tu HTML, solo tienes 'contador-total', así que ignoraré 'w' y 'g' individuales.
        this._total_display = document.getElementById('contador-total');
        
        // 🚨 Cargar valores desde localStorage (cargamos el total combinando 'w' y 'g')
        this._w_total = this._load('w');
        this._g_total = this._load('g');
        
        this.updateDisplay();
    }
    
    /**
     * Carga un valor de contador desde localStorage o devuelve 0.
     * @param {string} keyPrefix 'w' o 'g'
     * @returns {number} El valor cargado.
     */
    _load(keyPrefix) {
        const value = localStorage.getItem(`contador_${keyPrefix}`);
        return value ? parseInt(value) : 0;
    }

    /**
     * Guarda el valor actual de un contador en localStorage.
     * @param {string} keyPrefix 'w' o 'g'
     * @param {number} value El valor a guardar.
     */
    _save(keyPrefix, value) {
        localStorage.setItem(`contador_${keyPrefix}`, value.toString());
    }

    /**
     * Aumenta el contador total (asumiendo que cualquier interacción cuenta para 'w').
     * En tu caso, vamos a incrementar 'w' y mantener 'g' por si lo necesitas más tarde.
     * * @param {string} key 'w' o 'g' (Aumenta la interacción registrada)
     */
    addInteraction(key = 'w') {
        if (key === 'w') {
            this._w_total++;
            this._save('w', this._w_total);
        } else if (key === 'g') {
            this._g_total++;
            this._save('g', this._g_total);
        }
        this.updateDisplay();
    }
    
    /**
     * Reinicia todos los contadores a cero.
     */
    reset() {
        this._w_total = 0;
        this._g_total = 0;
        
        // 🚨 Reiniciar también en localStorage
        this._save('w', 0);
        this._save('g', 0);
        
        this.updateDisplay();
    }
    
    /**
     * Actualiza el contenido visible en la pantalla.
     */
    updateDisplay() {
        // Desactivado porque no tienes los elementos individuales en el HTML:
        // if (this._w_display) this._w_display.textContent = this._w_total.toString();
        // if (this._g_display) this._g_display.textContent = this._g_total.toString();
        
        const total = this._w_total + this._g_total;
        if (this._total_display) this._total_display.textContent = total.toString();
    }
}


// -----------------------------------------------------------------
// 🚨 SOLUCIÓN AL ERROR: Exportamos una instancia única y sus métodos
// -----------------------------------------------------------------

const counterInstance = new Counter();

// Exportamos las funciones que 'main.js' espera.
export function addInteraction(key) {
    counterInstance.addInteraction(key);
}

export function reset() {
    counterInstance.reset();
}

export function updateDisplay() {
    counterInstance.updateDisplay();
}

// También exportamos la instancia para el botón de reinicio en main.js
export { counterInstance };
