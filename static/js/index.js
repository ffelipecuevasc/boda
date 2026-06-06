/**
 * Lógica de la Invitación Digital
 */

import {listaInvitados} from './data/invitados.js';
import {inicializarModal} from './ui/modal.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PERSONALIZACIÓN DE BIENVENIDA ---
    const manejarBienvenida = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const vipHash = urlParams.get('vip'); // Extraemos el hash de la URL
        const saludoEl = document.getElementById('saludo-invitado');

        // Si existe el hash en la URL y además coincide con alguien en nuestro diccionario
        if (vipHash && listaInvitados[vipHash]) {
            const invitado = listaInvitados[vipHash];

            // 1. Invocamos la modal inyectando nombre y rol de forma segura
            inicializarModal(invitado.nombre, invitado.rol);

            // 2. Actualizamos el texto de fondo
            if (saludoEl) {
                saludoEl.textContent = `¡Bienvenidos, ${invitado.nombre}! Estás cordialmente invitado a la boda de`;
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