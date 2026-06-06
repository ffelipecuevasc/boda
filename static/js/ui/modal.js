/**
 * /static/js/ui/modal.js
 * Gestión visual de estados de la Modal de Bienvenida
 */

export const inicializarModal = (nombre, rol) => {
    const modal = document.getElementById('welcome-modal');
    const modalNombre = document.getElementById('modal-nombre');
    const modalRol = document.getElementById('modal-rol');
    const modalMensajeEspecial = document.getElementById('modal-mensaje-especial');
    const btnEntrar = document.getElementById('btn-entrar');

    // Control de guardas: Si falta algún elemento crítico, abortamos limpiamente
    if (!modal || !modalNombre || !modalRol || !modalMensajeEspecial || !btnEntrar) return;

    // 1. Inyección segura del nombre del invitado
    modalNombre.textContent = nombre;

    // 2. Evaluación quirúrgica del Rol y manejo del Patrón de Nodos Ocultos
    if (rol === "INVITADO") {
        // Modificación del texto base solicitada por los novios
        modalRol.textContent = "BIENVENIDOS A LA BODA DE ANN & ASIEL";

        // Nos aseguramos de que el nodo especial esté oculto para invitados regulares
        modalMensajeEspecial.classList.add('hidden');
        modalMensajeEspecial.textContent = "";
    }
    else if (rol === "BEST MAN" || rol === "DAMA DE HONOR") {
        // Mantenemos el nombre del rol destacado en la parte superior
        modalRol.textContent = rol;

        // Construimos un mensaje emotivo personalizado que destaca su rol especial
        const articulo = rol === "DAMA DE HONOR" ? "nuestra" : "nuestro";
        modalMensajeEspecial.textContent = `¡Eres una pieza fundamental en nuestro gran día como ${articulo} ${rol}!`;

        // Implementación del Concepto 1: Removemos la clase hidden para revelar el elemento pre-construido
        modalMensajeEspecial.classList.remove('hidden');
    }

    // 3. Despliegue nativo de la modal (Top Layer, Focus Trapping automático)
    modal.showModal();

    // 4. Manejo de cierre con transición suave
    btnEntrar.addEventListener('click', () => {
        modal.classList.remove('fade-in');
        modal.classList.add('fade-out');

        setTimeout(() => {
            modal.close();
            modal.classList.remove('fade-out'); // Limpieza de estado para el ciclo de vida del DOM
        }, 400);
    });
};