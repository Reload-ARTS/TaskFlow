import GestorTareas from "./models/GestorTareas.js";
import { renderTareas, showToast, setHelperText } from "./ui/dom.js";

const gestor = new GestorTareas();

// --- Referencias DOM ---
const form = document.getElementById("task-form");
const inputDesc = document.getElementById("task-desc");
const inputDeadline = document.getElementById("task-deadline");
const taskList = document.getElementById("task-list");

// Render inicial
renderTareas(gestor.listar());

// --- Eventos ---

// 1) submit: agregar tarea
form.addEventListener("submit", (e) => {
  e.preventDefault();

  try {
    const descripcion = inputDesc.value;
    const fechaLimite = inputDeadline.value; // "" o "YYYY-MM-DD"

    // Agregamos tarea
    gestor.agregar({ descripcion, fechaLimite });

    // Limpiar inputs
    form.reset();
    setHelperText("");

    // Render
    renderTareas(gestor.listar());
    showToast("✅ Tarea agregada");
  } catch (err) {
    setHelperText(err.message);
  }
});

// 2) keyup: feedback simple en tiempo real
inputDesc.addEventListener("keyup", () => {
  const texto = inputDesc.value.trim();
  if (texto.length === 0) setHelperText("Escribe una descripción para la tarea.");
  else if (texto.length < 3) setHelperText("La descripción es muy corta.");
  else setHelperText("");
});

// 3) click (delegación de eventos): completar / eliminar
taskList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const { action, id } = btn.dataset;
  if (!action || !id) return;

  if (action === "toggle") {
    gestor.toggleEstado(id);
    renderTareas(gestor.listar());
    showToast("🔁 Estado actualizado");
  }

  if (action === "delete") {
    gestor.eliminar(id);
    renderTareas(gestor.listar());
    showToast("🗑️ Tarea eliminada");
  }
});
