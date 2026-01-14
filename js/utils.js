// js/utils.js

/**
 * Muestra una notificación flotante (Toast)
 * @param {string} mensaje - Texto a mostrar
 * @param {string} tipo - 'exito' (verde) o 'error' (rojo)
 */
function mostrarNotificacion(mensaje, tipo = 'exito') {
    const notificacion = document.createElement('div');
    
    let colorClase = tipo === 'error' ? 'bg-red-500 border-red-700' : 'bg-green-500 border-green-700';
    let icono = tipo === 'error' ? '⚠️' : '✅';

    // Estilos Tailwind para la notificación flotante
    notificacion.className = `fixed top-5 right-5 z-50 ${colorClase} text-white px-6 py-4 rounded-lg shadow-2xl border-l-4 flex items-center gap-3 transform transition-all duration-500 translate-x-full opacity-0`;
    
    notificacion.innerHTML = `
        <span class="text-xl">${icono}</span>
        <p class="font-bold">${mensaje}</p>
    `;

    document.body.appendChild(notificacion);

    // Animación de entrada
    setTimeout(() => {
        notificacion.classList.remove('translate-x-full', 'opacity-0');
    }, 10);

    // Animación de salida automática
    setTimeout(() => {
        notificacion.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => notificacion.remove(), 500);
    }, 3000);
}

/**
 * Pone el borde rojo al input y lo quita al escribir
 */
function marcarErrorInput(idInput) {
    const input = document.getElementById(idInput);
    if(input) {
        input.classList.add('border-red-500', 'ring-2', 'ring-red-200');
        input.focus();
        input.addEventListener('input', () => {
            input.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
        }, { once: true });
    }
}