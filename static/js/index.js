/**
 * Lógica de la Invitación Digital
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

    // --- 2. CUENTA REGRESIVA ---
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
            form.classList.add('opacity-50', 'pointer-events-none');
            setTimeout(() => {
                form.style.display = 'none';
                exito.classList.remove('hidden');
                exito.classList.add('fade-in');
            }, 1000);
        });
    };

    // --- 4. MOTOR DEL EFECTO LINTERNA (Soporte Desktop + Mobile) ---
    const manejarLinterna = () => {
        const linterna = document.getElementById('linterna-bg');
        if (!linterna) return;

        // Función unificada para actualizar coordenadas
        const actualizarPosicion = (clientX, clientY) => {
            requestAnimationFrame(() => {
                linterna.style.setProperty('--x', `${clientX}px`);
                linterna.style.setProperty('--y', `${clientY}px`);
            });
        };

        // Escucha para Mouse (Desktop)
        document.addEventListener('mousemove', (e) => {
            actualizarPosicion(e.clientX, e.clientY);
        });

        // Escucha para Toque (Mobile/Tablets)
        document.addEventListener('touchmove', (e) => {
            // Prevenimos el scroll si queremos que el dedo solo mueva la linterna
            // Si quieres que el usuario pueda hacer scroll mientras mueve la linterna,
            // borra la siguiente línea (e.preventDefault()):

            const toque = e.touches[0];
            actualizarPosicion(toque.clientX, toque.clientY);
        }, { passive: true }); // passive: true mejora el rendimiento del scroll en móviles
    };
    // Inicializar funciones
    manejarBienvenida();
    manejarCuentaRegresiva();
    manejarFormulario();
    manejarLinterna();
});