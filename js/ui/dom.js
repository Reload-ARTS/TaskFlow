const listEl = document.getElementById("task-list");
const emptyStateEl = document.getElementById("empty-state");
const toastEl = document.getElementById("toast");
const helperEl = document.getElementById("helper-text");

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
          <p class="task-desc ${tarea.estado === "completada" ? "done" : ""}">
            ${tarea.descripcion}
          </p>
          <small class="task-meta">
            Creada: ${new Date(tarea.fechaCreacion).toLocaleString()}
            ${tarea.fechaLimite ? ` • Límite: ${tarea.fechaLimite}` : ""}
          </small>
        </div>
      </div>

      <div class="task-actions">
        <button type="button" data-action="toggle" data-id="${tarea.id}">
          ${tarea.estado === "completada" ? "↩️ Reabrir" : "✅ Completar"}
        </button>
        <button type="button" data-action="delete" data-id="${tarea.id}">
          🗑️ Eliminar
        </button>
      </div>
    `;

    listEl.appendChild(li);
  });
}
