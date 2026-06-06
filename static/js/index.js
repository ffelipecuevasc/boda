/**
 * Lógica de la Invitación Digital
 */

import {listaInvitados} from './data/invitados.js';
import {inicializarModal} from './ui/modal.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PERSONALIZACIÓN DE BIENVENIDA ---
    const manejarBienvenida = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const vipHash = urlParams.get('vip');

        if (vipHash && listaInvitados[vipHash]) {
            const invitado = listaInvitados[vipHash];

            // 1. Invocamos la modal
            inicializarModal(invitado.nombre, invitado.rol);

            // 2. Inyección dinámica del Checkbox
            const contenedorNombres = document.getElementById('contenedor-nombres-rsvp');
            if (contenedorNombres) {
                // Generación de elementos con API DOM pura (Sanitización estricta)
                const label = document.createElement('label');
                label.className = 'flex items-center gap-3 cursor-pointer group p-4 border border-surface-variant rounded-xl focus-within:border-primary transition-colors';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'invitados_confirmados';
                checkbox.value = invitado.nombre;
                checkbox.checked = true; // Requisito de submit
                checkbox.required = true;
                checkbox.className = 'w-5 h-5 rounded border-surface-variant text-primary focus:ring-primary transition-all';

                const span = document.createElement('span');
                span.className = 'text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors';
                span.textContent = invitado.nombre;

                label.appendChild(checkbox);
                label.appendChild(span);
                contenedorNombres.appendChild(label);
            }
        }
    };

    // --- 2. CUENTA REGRESIVA ---
    const manejarCuentaRegresiva = () => {
        const fechaFin = new Date('September 11, 2026 16:00:00').getTime();

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
        const btnSubmit = form?.querySelector('button[type="submit"]');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Estado UI: Loading (Prevención de double-tap)
            const textoOriginalBtn = btnSubmit.textContent;
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'ENVIANDO...';
            btnSubmit.classList.add('opacity-50', 'pointer-events-none');

            // 2. Serialización de payload
            const formData = new FormData(form);
            const dataProcesada = new URLSearchParams();

            dataProcesada.append('invitados_confirmados', formData.get('invitados_confirmados'));
            dataProcesada.append('asistencia', formData.get('asistencia'));
            dataProcesada.append('cancion', formData.get('cancion') || '');

            // Agrupación de restricciones alimenticias múltiples a un string
            const arrRestricciones = formData.getAll('restriccion');
            const strRestricciones = arrRestricciones.length > 0 ? arrRestricciones.join(', ') : 'ninguna';
            dataProcesada.append('restriccion', strRestricciones);

            // Endpoint de Google Apps Script generado
            const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9qRBZQh9f1Qtk9Ly6KVKprYEF09b7DmKVkIZlms8PkJQCOztMQ74Vb4SC_LW2jU--dA/exec';

            try {
                // 3. Petición Asíncrona POST
                // URLSearchParams inyecta automáticamente el Content-Type: application/x-www-form-urlencoded
                const response = await fetch(GOOGLE_APP_SCRIPT_URL, {
                    method: 'POST',
                    body: dataProcesada,
                    redirect: 'follow'
                });

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") === -1) {
                    throw new Error("Apps Script devolvió HTML (Problema de permisos CORS).");
                }

                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

                const resultado = await response.json();

                if (resultado.status === 'success') {
                    // 4. Estado UI: Success
                    form.classList.add('fade-out', 'pointer-events-none');

                    // Sincronización con la animación CSS nativa
                    setTimeout(() => {
                        form.style.display = 'none';
                        exito.classList.remove('hidden');
                        exito.classList.add('fade-in');
                    }, 400);
                } else {
                    throw new Error(resultado.details || 'Fallo interno en Apps Script');
                }

            } catch (error) {
                // 5. Estado UI: Error Dropback
                console.error('Error en RSVP Webhook:', error);
                alert('No pudimos procesar tu confirmación. Revisa tu conexión e intenta nuevamente.');

                // Rollback del botón
                btnSubmit.disabled = false;
                btnSubmit.textContent = textoOriginalBtn;
                btnSubmit.classList.remove('opacity-50', 'pointer-events-none');
            }
        });
    };

    // --- 4. MOTOR DEL EFECTO LINTERNA (Soporte Desktop + Mobile) ---
    const manejarLinterna = () => {
        const linterna = document.getElementById('linterna-bg');
        if (!linterna) return;

        // NUEVO: Lógica de "Apagado Inteligente"
        const zonasBloqueo = document.querySelectorAll('.pausar-linterna');

        zonasBloqueo.forEach(zona => {
            // Cuando el mouse entra, ocultamos la linterna
            zona.addEventListener('mouseenter', () => {
                linterna.classList.add('linterna-apagada');
            });
            // Cuando el mouse sale, la volvemos a encender
            zona.addEventListener('mouseleave', () => {
                linterna.classList.remove('linterna-apagada');
            });
        });

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
            const toque = e.touches[0];
            actualizarPosicion(toque.clientX, toque.clientY);
        }, {passive: true});
    };

    // --- 5. EFECTO DE PARTÍCULAS BOTÁNICAS (CANVAS) ---
    const manejarParticulasBotanicas = () => {
        const canvas = document.getElementById('hojas-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let W = canvas.width = canvas.offsetWidth;
        let H = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        });

        // PALETA BOTÁNICA VINTAGE (Adaptado a tu nueva paleta)
        const COLORS = [
            'rgba(102, 105, 86,',   // #666956 (Primary - Oliva Oscuro)
            'rgba(141, 142, 124,',  // #8d8e7c (Secondary - Oliva Medio)
            'rgba(176, 137, 129,',  // #b08981 (Tertiary - Rosa apagado/Marrón)
            'rgba(240, 192, 188,'   // #f0c0bc (Surface Variant - Rosa suave)
        ];
        const COUNT = 40; // Número de partículas en pantalla

        const drawLeaf = (ctx, x, y, size, rotation, alpha, colorBase) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.bezierCurveTo(size * 0.8, -size * 0.3, size * 0.6, size * 0.8, 0, size * 1.2);
            ctx.bezierCurveTo(-size * 0.6, size * 0.8, -size * 0.8, -size * 0.3, 0, -size);
            ctx.fillStyle = colorBase + alpha.toFixed(2) + ')';
            ctx.fill();
            ctx.restore();
        };

        const particulas = Array.from({length: COUNT}, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            size: Math.random() * 6 + 4,
            vx: (Math.random() - 0.5) * 0.4,
            vy: Math.random() * 0.8 + 0.2,
            rot: Math.random() * Math.PI * 2,
            vrot: (Math.random() - 0.5) * 0.015,
            alpha: Math.random() * 0.5 + 0.2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            wobble: Math.random() * Math.PI * 2,
        }));

        const animar = () => {
            ctx.clearRect(0, 0, W, H);
            particulas.forEach(p => {
                p.wobble += 0.01;
                p.x += p.vx + Math.sin(p.wobble) * 0.3;
                p.y += p.vy;
                p.rot += p.vrot;

                if (p.y > H + 20) {
                    p.y = -20;
                    p.x = Math.random() * W;
                }

                drawLeaf(ctx, p.x, p.y, p.size, p.rot, p.alpha, p.color);
            });
            requestAnimationFrame(animar);
        };
        animar();
    };

    // ==========================================
    // INICIALIZACIÓN DE TODAS LAS FUNCIONES
    // ==========================================
    manejarBienvenida();
    manejarCuentaRegresiva();
    manejarFormulario();
    manejarLinterna();
    manejarParticulasBotanicas(); // <- Inyección del nuevo efecto
});