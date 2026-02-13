// Este archivo maneja toda la interfaz (UI):
// - Renderizar la lista de tareas en el DOM
// - Mostrar mensajes (helper text y toast)
// - Controlar el modo edición (edit/save/cancel)
// - Actualizar el contador regresivo de tareas con fecha límite

const listEl = document.getElementById("task-list");
const emptyStateEl = document.getElementById("empty-state");
const toastEl = document.getElementById("toast");
const helperEl = document.getElementById("helper-text");

// Guardo el id de la tarea que estoy editando (si no hay, es null)
let editingId = null;

// Con esta función activo el modo edición para una tarea específica
export function setEditingId(id) {
  editingId = id;
}

// Esta función me permite consultar cuál tarea está en edición actualmente
export function getEditingId() {
  return editingId;
}

// Muestro mensajes de ayuda o validación debajo del formulario
export function setHelperText(texto) {
  if (!helperEl) return;
  helperEl.textContent = texto;
}

// Muestro una notificación corta (toast) en la esquina inferior derecha
export function showToast(mensaje) {
  if (!toastEl) return;

  toastEl.textContent = mensaje;
  toastEl.classList.add("show");

  // Oculto el toast automáticamente después de 2 segundos
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2000);
}

// Renderizo todas las tareas dentro del <ul id="task-list">
// Aquí decido cómo se ve cada tarea: texto normal, modo edición, botones, contador, etc.
export function renderTareas(tareas = []) {
  // Si no hay tareas, muestro un mensaje; si hay, lo oculto
  if (emptyStateEl) {
    emptyStateEl.style.display = tareas.length ? "none" : "block";
  }

  // Limpio la lista para volver a dibujar desde cero
  listEl.innerHTML = "";

  // Creo un <li> por cada tarea
  tareas.forEach((tarea) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Armo el HTML de la tarea usando template literals
    // - Si la tarea está completada, marco el checkbox y aplico estilo "done"
    // - Si la tarea está en edición (editingId), muestro un input y botones Guardar/Cancelar
    // - Si tiene fecha límite, muestro el "slot" del contador para que updateCountdowns lo actualice
    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox"
          ${tarea.estado === "completada" ? "checked" : ""}
          data-action="toggle"
          data-id="${tarea.id}" />

        <div>
          ${editingId === tarea.id ? `
            <input
              class="task-edit-input"
              type="text"
              value="${tarea.descripcion.replace(/"/g, "&quot;")}"
              data-id="${tarea.id}"
            />
          ` : `
            <p class="task-desc ${tarea.estado === "completada" ? "done" : ""}">
              ${tarea.descripcion}
            </p>
          `}

          <small class="task-meta">
            Creada: ${new Date(tarea.fechaCreacion).toLocaleString()}
          </small>

          ${tarea.fechaLimite ? `
            <small class="task-countdown" data-deadline="${tarea.fechaLimite}"></small>
          ` : ""}
        </div>
      </div>

      <div class="task-actions">
        <button type="button" data-action="toggle" data-id="${tarea.id}">
          ${tarea.estado === "completada" ? "↩️ Reabrir" : "✅ Completar"}
        </button>

        ${editingId === tarea.id ? `
          <button type="button" data-action="save" data-id="${tarea.id}">💾 Guardar</button>
          <button type="button" data-action="cancel" data-id="${tarea.id}">✖️ Cancelar</button>
        ` : `
          <button type="button" data-action="edit" data-id="${tarea.id}">✏️ Editar</button>
        `}

        <button type="button" data-action="delete" data-id="${tarea.id}">
          🗑️ Eliminar
        </button>
      </div>
    `;

    listEl.appendChild(li);
  });
}

// Convierto milisegundos a un formato legible: "Xd Xh Xm Xs"
function msToTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${d}d ${h}h ${m}m ${s}s`;
}

// Transformo una fecha "YYYY-MM-DD" a milisegundos, considerando el fin del día local
function deadlineToMs(deadlineStr) {
  const endOfDay = new Date(`${deadlineStr}T23:59:59`);
  return endOfDay.getTime();
}

// Actualizo todos los contadores visibles en pantalla
// (solo afecta a tareas que tienen <small class="task-countdown">)
export function updateCountdowns() {
  const nodes = document.querySelectorAll(".task-countdown");

  nodes.forEach((el) => {
    const deadlineStr = el.dataset.deadline;
    const deadlineMs = deadlineToMs(deadlineStr);
    const diff = deadlineMs - Date.now();

    // Si ya pasó la fecha, marco la tarea como vencida
    if (diff <= 0) {
      el.textContent = `⛔ Vencida (${deadlineStr})`;
    } else {
      // Si falta tiempo, muestro el tiempo restante actualizado
      el.textContent = `⏳ Vence en: ${msToTime(diff)} (hasta ${deadlineStr})`;
    }
  });
}
