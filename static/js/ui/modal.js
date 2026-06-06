/**
 * /static/js/ui/modal.js
 */

export const inicializarModal = (nombre, rol) => {
    const modal = document.getElementById('welcome-modal');
    const modalNombre = document.getElementById('modal-nombre');
    const modalRol = document.getElementById('modal-rol');
    const btnEntrar = document.getElementById('btn-entrar');

    if (!modal || !modalNombre || !modalRol || !btnEntrar) return;

    // FASE 4: Prevención XSS. Uso estricto de textContent.
    modalNombre.textContent = nombre;
    modalRol.textContent = rol;

    // Mostrar modal (bloquea el fondo nativamente y atrapa el foco)
    modal.showModal();

    // Cierre y transición suave
    btnEntrar.addEventListener('click', () => {
        modal.classList.remove('fade-in');
        modal.classList.add('fade-out');

        // Esperar a que termine la animación en CSS antes de destruir el bloqueo
        setTimeout(() => {
            modal.close();
            // Restaurar clases por si se llegase a abrir de nuevo (opcional)
            modal.classList.remove('fade-out');
        }, 400);
    });
};