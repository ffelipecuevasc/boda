export const inicializarModal = (nombre, rol) => {
    const modal = document.getElementById('welcome-modal');
    const modalNombre = document.getElementById('modal-nombre');
    const modalRol = document.getElementById('modal-rol');
    const modalMensajeEspecial = document.getElementById('modal-mensaje-especial');
    const modalDesc = document.getElementById('modal-desc');
    const btnEntrar = document.getElementById('btn-entrar');

    // Control de guardas: Si falta algún elemento crítico, abortamos limpiamente
    if (!modal || !modalNombre || !modalRol || !modalMensajeEspecial || !btnEntrar) return;

    // 1. Inyección segura del nombre del invitado (Se sobrescribirá si es VIP)
    modalNombre.textContent = nombre;

    // 2. Evaluación quirúrgica del Rol
    if (rol === "INVITADO") {
        modalRol.textContent = "BIENVENIDOS A LA BODA DE ANN & ASIEL";
        modalMensajeEspecial.classList.add('hidden');
        modalMensajeEspecial.textContent = "";
    }
    else if (rol === "BEST MAN" || rol === "DAMA DE HONOR") {
        modalRol.textContent = rol;
        const articulo = rol === "DAMA DE HONOR" ? "nuestra" : "nuestro";
        modalMensajeEspecial.textContent = `¡Eres una pieza fundamental en nuestro gran día como ${articulo} ${rol}!`;
        modalMensajeEspecial.classList.remove('hidden');
    }
    else if (rol === "ANFITRION") {

        modalRol.textContent = "ACCESO VIP";
        modalNombre.textContent = 'Fabián "Fabiloso" Acuña';

        const templateVIP = `
            <div class="bg-surface-variant/20 border border-primary/20 rounded-xl p-5 text-left space-y-4 w-full max-w-sm mx-auto shadow-inner mt-2">
                <p class="text-xs text-on-surface-variant leading-relaxed">
                    <strong class="text-primary tracking-[0.2em] uppercase text-[10px] block mb-1">Cargo:</strong>
                    Maestro de Ceremonias
                </p>
                <p class="text-xs text-on-surface-variant leading-relaxed">
                    <strong class="text-primary tracking-[0.2em] uppercase text-[10px] block mb-1">Autorización:</strong>
                    Para hablar por el micrófono... durante toda la noche.
                </p>
                <p class="text-xs text-on-surface-variant leading-relaxed">
                    <strong class="text-primary tracking-[0.2em] uppercase text-[10px] block mb-1">Acompañante Oficial:</strong>
                    Constanza
                </p>
            </div>
        `;

        modalMensajeEspecial.innerHTML = templateVIP;

        modalMensajeEspecial.classList.remove('hidden', 'italic');

        if (modalDesc) {
            modalDesc.classList.add('hidden');
        }
    }
    else {
        modalRol.textContent = rol;
        modalMensajeEspecial.classList.add('hidden');
    }

    modal.showModal();

    btnEntrar.addEventListener('click', () => {
        modal.classList.remove('fade-in');
        modal.classList.add('fade-out');

        setTimeout(() => {
            modal.close();
            modal.classList.remove('fade-out'); // Limpieza de estado para el ciclo de vida del DOM
        }, 400);
    });
};