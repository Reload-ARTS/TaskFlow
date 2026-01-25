const listEl = document.getElementById("task-list");
const emptyStateEl = document.getElementById("empty-state");
const toastEl = document.getElementById("toast");
const helperEl = document.getElementById("helper-text");

let editingId = null;

export function setEditingId(id) {
  editingId = id;
}

export function getEditingId() {
  return editingId;
}

export function setHelperText(texto) {
  if (!helperEl) return;
  helperEl.textContent = texto;
}

export function showToast(mensaje) {
  if (!toastEl) return;

  toastEl.textContent = mensaje;
  toastEl.classList.add("show");

  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2000);
}

export function renderTareas(tareas = []) {
  // Empty state
  if (emptyStateEl) {
    emptyStateEl.style.display = tareas.length ? "none" : "block";
  }

  // Limpia lista
  listEl.innerHTML = "";

  // Render
  tareas.forEach((tarea) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${tarea.estado === "completada" ? "checked" : ""} data-action="toggle" data-id="${tarea.id}" />
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

function msToTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${d}d ${h}h ${m}m ${s}s`;
}

function deadlineToMs(deadlineStr) {
  // deadlineStr: "YYYY-MM-DD"
  // lo tomamos como fin del día local (23:59:59)
  const endOfDay = new Date(`${deadlineStr}T23:59:59`);
  return endOfDay.getTime();
}

export function updateCountdowns() {
  const nodes = document.querySelectorAll(".task-countdown");

  nodes.forEach((el) => {
    const deadlineStr = el.dataset.deadline;
    const deadlineMs = deadlineToMs(deadlineStr);
    const diff = deadlineMs - Date.now();

    if (diff <= 0) {
      el.textContent = `⛔ Vencida (${deadlineStr})`;
    } else {
      el.textContent = `⏳ Vence en: ${msToTime(diff)} (hasta ${deadlineStr})`;
    }
  });
}
