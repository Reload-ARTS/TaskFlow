// En este archivo me encargo de la persistencia usando localStorage.
// Aquí guardo, cargo y limpio las tareas almacenadas en el navegador.

// Defino una clave única para guardar mis tareas en localStorage.
// Así evito conflictos con otras aplicaciones.
const KEY = "taskflow_tasks";

// Guardo el arreglo de tareas en localStorage.
// Convierto el arreglo a formato JSON porque localStorage solo guarda strings.
export function saveTasks(tasksArray) {
  localStorage.setItem(KEY, JSON.stringify(tasksArray));
}

// Cargo las tareas desde localStorage.
// Si no existe nada guardado, devuelvo un arreglo vacío.
export function loadTasks() {
  const raw = localStorage.getItem(KEY);

  if (!raw) return [];

  try {
    // Intento convertir el string JSON nuevamente a objeto/arreglo
    return JSON.parse(raw);
  } catch (e) {
    // Si el JSON está corrupto o malformado, evito que la app se rompa
    // y reinicio el almacenamiento.
    console.warn("localStorage corrupto, se reinicia.", e);
    return [];
  }
}

// Elimino todas las tareas guardadas en localStorage.
// Esta función no la uso siempre, pero la dejo disponible por si se necesita.
export function clearTasks() {
  localStorage.removeItem(KEY);
}
