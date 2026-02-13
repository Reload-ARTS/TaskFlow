// Aquí se conecta toda la aplicación:
// - Lógica (GestorTareas)
// - Interfaz (render + toasts + helper text + countdown)
// - Persistencia (localStorage)
// - Consumo de API (fetch)

import GestorTareas from "./models/GestorTareas.js";
import {
  renderTareas,
  showToast,
  setHelperText,
  updateCountdowns,
  setEditingId,
} from "./ui/dom.js";
import { saveTasks, loadTasks } from "./services/storage.js";
import { fetchTasksFromApi } from "./services/api.js";

// Creo el gestor cargando tareas guardadas en localStorage.
// Así, si recargo o cierro el navegador, las tareas se mantienen.
const gestor = new GestorTareas(loadTasks());

// Referencias DOM: aquí tomo los elementos que voy a usar
const form = document.getElementById("task-form");
const inputDesc = document.getElementById("task-desc");
const inputDeadline = document.getElementById("task-deadline");
const taskList = document.getElementById("task-list");
const btnSync = document.getElementById("btn-sync");

// 1) SINCRONIZAR (API)
// Al presionar "Sincronizar", traigo tareas desde una API externa.
// Esto demuestra fetch + async/await + try/catch.
btnSync.addEventListener("click", async () => {
  // Bloqueo el botón para evitar múltiples clicks mientras carga
  btnSync.disabled = true;
  showToast("🔄 Sincronizando...");

  try {
    // Pido 5 tareas a la API
    const tareasApi = await fetchTasksFromApi(5);

    // Agrego cada tarea al gestor normalizando su formato
    tareasApi.forEach((t) => {
      gestor.agregar({
        descripcion: t.descripcion,
        fechaLimite: "", // no viene fecha desde esta API
        estado: t.estado, // puede venir pendiente o completada
      });
    });

    // Guardo y renderizo el resultado
    saveTasks(gestor.toJSON());
    renderTareas(gestor.listar());
    updateCountdowns();

    showToast("✅ Tareas importadas desde API");
  } catch (err) {
    // Si falla la conexión o la API, lo informo y dejo el error en consola
    console.error(err);
    showToast("❌ Error al sincronizar (revisa conexión)");
  } finally {
    // Vuelvo a habilitar el botón sí o sí
    btnSync.disabled = false;
  }
});

// Render inicial
// Aquí muestro tareas al cargar la app (desde localStorage).
renderTareas(gestor.listar());
updateCountdowns();

// Guardo el estado inicial por consistencia (si estaba vacío, queda guardado).
saveTasks(gestor.toJSON());

// Contadores (setInterval)
// Uso un solo interval global que actualiza los countdowns cada 1 segundo.
setInterval(() => {
  updateCountdowns();
}, 1000);

// EVENTOS PRINCIPALES
// 2) SUBMIT: Agregar tarea
// Capturo los datos del formulario y creo una tarea.
// Simulo un pequeño retardo con setTimeout para demostrar asincronía.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  try {
    const descripcion = inputDesc.value;
    const fechaLimite = inputDeadline.value;

    // Muestro feedback y bloqueo el botón mientras "se agrega"
    setHelperText("⏳ Agregando tarea...");
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // Delay simulado (ej: como si fuera una petición a servidor)
    setTimeout(() => {
      try {
        // Creo la tarea y la guardo
        gestor.agregar({ descripcion, fechaLimite });
        saveTasks(gestor.toJSON());

        // Limpio formulario y mensajes
        form.reset();
        setHelperText("");
        submitBtn.disabled = false;

        // Actualizo la UI
        renderTareas(gestor.listar());
        updateCountdowns();

        showToast("✅ Tarea agregada");

        // Notificación 2 segundos después (setTimeout)
        setTimeout(() => {
          showToast("🔔 Tip: revisa tus tareas pendientes");
        }, 2000);
      } catch (err) {
        // Si el usuario ingresó algo inválido, muestro el error
        submitBtn.disabled = false;
        setHelperText(err.message);
      }
    }, 800);
  } catch (err) {
    // Error inesperado
    setHelperText(err.message);
  }
});

// 3) KEYUP: Validación/feedback en tiempo real
// Aquí muestro un mensaje breve mientras el usuario escribe.
inputDesc.addEventListener("keyup", () => {
  const texto = inputDesc.value.trim();

  if (texto.length === 0) setHelperText("Escribe una descripción para la tarea.");
  else if (texto.length < 3) setHelperText("La descripción es muy corta.");
  else setHelperText("");
});

// 4) CLICK (Delegación de eventos)
// Manejo todos los botones dentro de la lista con un solo listener.
// Esto evita agregar muchos listeners a cada tarea.
taskList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  // Leo la acción y el id desde data-attributes (data-action, data-id)
  const { action, id } = btn.dataset;
  if (!action || !id) return;

  // EDITAR: entrar en modo edición
  if (action === "edit") {
    // Marco el id que estoy editando y re-renderizo para mostrar el input
    setEditingId(id);
    renderTareas(gestor.listar());
    updateCountdowns();

    // Enfoco el input automáticamente para mejorar la UX
    setTimeout(() => {
      const input = document.querySelector(`.task-edit-input[data-id="${id}"]`);
      input?.focus();
      input?.select();
    }, 0);

    return;
  }

  // CANCELAR edición
  if (action === "cancel") {
    // Salgo del modo edición y re-renderizo sin guardar cambios
    setEditingId(null);
    renderTareas(gestor.listar());
    updateCountdowns();
    showToast("↩️ Edición cancelada");
    return;
  }

  // GUARDAR edición
  if (action === "save") {
    const input = document.querySelector(`.task-edit-input[data-id="${id}"]`);
    const nuevoTexto = input?.value ?? "";

    try {
      // Actualizo la descripción en la lógica
      gestor.actualizarDescripcion(id, nuevoTexto);

      // Guardo en localStorage para persistencia
      saveTasks(gestor.toJSON());

      // Salgo del modo edición y re-renderizo
      setEditingId(null);
      renderTareas(gestor.listar());
      updateCountdowns();

      showToast("💾 Tarea actualizada");
    } catch (err) {
      showToast("⚠️ " + err.message);
    }

    return;
  }

  // COMPLETAR / REABRIR
  if (action === "toggle") {
    gestor.toggleEstado(id);
    saveTasks(gestor.toJSON());
    renderTareas(gestor.listar());
    updateCountdowns();
    showToast("🔁 Estado actualizado");
    return;
  }

  // ELIMINAR
  if (action === "delete") {
    gestor.eliminar(id);
    saveTasks(gestor.toJSON());
    renderTareas(gestor.listar());
    updateCountdowns();
    showToast("🗑️ Tarea eliminada");
    return;
  }
});
