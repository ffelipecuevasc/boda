/**
 * /static/js/index.js
 * Controlador Principal
 */

import { listaInvitados } from './data/invitados.js'; // Ajusta la ruta según tu estructura real
import { inicializarModal } from './ui/modal.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- FASE 4: VALIDACIÓN SILENCIOSA Y MANEJO DE URL ---
    const manejarAccesoInvitado = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const vipHash = urlParams.get('vip');

        // Si la URL no tiene parámetro o el hash no existe, la página carga normal (falla silenciosa)
        if (vipHash && listaInvitados[vipHash]) {
            const invitado = listaInvitados[vipHash];

            // Inyectar datos en la modal y abrirla
            inicializarModal(invitado.nombre, invitado.rol);

            // Actualizamos también el saludo del DOM de fondo (opcional, para mantener tu estructura original)
            const saludoEl = document.getElementById('saludo-invitado');
            if (saludoEl) {
                saludoEl.textContent = `¡Hola ${invitado.nombre}, estás invitado a la boda de!`;
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

    // --- 4. MOTOR DEL EFECTO LINTERNA ---
    const manejarLinterna = () => {
        const linterna = document.getElementById('linterna-bg');
        if (!linterna) return;

        const zonasBloqueo = document.querySelectorAll('.pausar-linterna');

        zonasBloqueo.forEach(zona => {
            zona.addEventListener('mouseenter', () => { linterna.classList.add('linterna-apagada'); });
            zona.addEventListener('mouseleave', () => { linterna.classList.remove('linterna-apagada'); });
        });

        const actualizarPosicion = (clientX, clientY) => {
            requestAnimationFrame(() => {
                linterna.style.setProperty('--x', `${clientX}px`);
                linterna.style.setProperty('--y', `${clientY}px`);
            });
        };

        document.addEventListener('mousemove', (e) => actualizarPosicion(e.clientX, e.clientY));
        document.addEventListener('touchmove', (e) => {
            const toque = e.touches[0];
            actualizarPosicion(toque.clientX, toque.clientY);
        }, { passive: true });
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

        const COLORS = ['rgba(102, 105, 86,', 'rgba(141, 142, 124,', 'rgba(176, 137, 129,', 'rgba(240, 192, 188,'];
        const COUNT = 40;

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

        const particulas = Array.from({ length: COUNT }, () => ({
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
    // INICIALIZACIÓN
    // ==========================================
    manejarAccesoInvitado();
    manejarCuentaRegresiva();
    manejarFormulario();
    manejarLinterna();
    manejarParticulasBotanicas();
});