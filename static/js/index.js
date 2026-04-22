/**
 * Lógica de la Invitación Digital
 * Desarrollado por: [Tu Nombre/Empresa]
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PERSONALIZACIÓN DE BIENVENIDA ---
    const manejarBienvenida = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const invitado = urlParams.get('nombre');
        const saludoEl = document.getElementById('saludo-invitado');

        if (invitado && saludoEl) {
            saludoEl.textContent = `¡Hola ${invitado}, estás invitado a la boda de!`;
        }
    };

    // --- 2. CUENTA REGRESIVA (Objetivo: 31 Dic 2026) ---
    const manejarCuentaRegresiva = () => {
        const fechaFin = new Date('December 31, 2026 23:59:59').getTime();

        const timer = setInterval(() => {
            const ahora = new Date().getTime();
            const diferencia = fechaFin - ahora;

            if (diferencia <= 0) {
                clearInterval(timer);
                return;
            }

            const d = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const h = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diferencia % (1000 * 60)) / 1000);

            document.getElementById('contador-dias').textContent = d.toString().padStart(2, '0');
            document.getElementById('contador-horas').textContent = h.toString().padStart(2, '0');
            document.getElementById('contador-minutos').textContent = m.toString().padStart(2, '0');
            document.getElementById('contador-segundos').textContent = s.toString().padStart(2, '0');
        }, 1000);
    };

    // --- 3. GESTIÓN DE FORMULARIO RSVP ---
    const manejarFormulario = () => {
        const form = document.getElementById('formulario-rsvp');
        const exito = document.getElementById('mensaje-exito');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulación de envío a Google Sheets
            console.log("Enviando datos...", {
                nombre: document.getElementById('nombre').value,
                asistencia: document.getElementById('asistencia').value,
                cancion: document.getElementById('cancion').value
            });

            form.classList.add('opacity-50', 'pointer-events-none');
            setTimeout(() => {
                form.style.display = 'none';
                exito.classList.remove('hidden');
                exito.classList.add('fade-in');
            }, 1000);
        });
    };

    // Inicializar funciones
    manejarBienvenida();
    manejarCuentaRegresiva();
    manejarFormulario();
});