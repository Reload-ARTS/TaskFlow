// GestorTareas centraliza la lógica del CRUD de tareas.
// Mantiene un arreglo interno de instancias de Tarea y expone métodos
// para crear, modificar, eliminar, listar y serializar tareas.

import Tarea from "./Tarea.js";

export default class GestorTareas {
  constructor(tareas = []) {
    // Garantiza que todos los elementos sean instancias de la clase Tarea.
    // Esto permite usar métodos como toggleEstado() o actualizarDescripcion().
    this.tareas = tareas.map((t) => (t instanceof Tarea ? t : Tarea.fromJSON(t)));
  }

  // Genera un id simple y suficientemente único para este proyecto:
  // timestamp + parte aleatoria.
  generarId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  // Crea una nueva tarea con validación básica.
  // - descripcion: obligatoria
  // - fechaLimite: opcional
  // - estado: por defecto "pendiente" (útil también para importar desde API)
  agregar({ descripcion, fechaLimite = null, estado = "pendiente" }) {
    const texto = (descripcion ?? "").trim();

    if (!texto) {
      throw new Error("Debes ingresar una descripción.");
    }

    const tarea = new Tarea({
      id: this.generarId(),
      descripcion: texto,
      fechaLimite: fechaLimite || null,
      estado,
    });

    // Se crea un nuevo arreglo (inmutabilidad) usando spread ES6.
    this.tareas = [...this.tareas, tarea];

    return tarea;
  }

  // Elimina una tarea por id.
  // Retorna true si se eliminó algo, false si no se encontró el id.
  eliminar(id) {
    const antes = this.tareas.length;
    this.tareas = this.tareas.filter((t) => t.id !== id);
    return this.tareas.length !== antes;
  }

  // Cambia el estado de una tarea por id (pendiente <-> completada).
  // Retorna la tarea modificada o null si no existe.
  toggleEstado(id) {
    const tarea = this.obtenerPorId(id);
    if (!tarea) return null;

    tarea.toggleEstado();
    return tarea;
  }

  // Actualiza la descripción de una tarea por id.
  // Retorna la tarea modificada o null si no existe.
  actualizarDescripcion(id, nuevaDescripcion) {
    const tarea = this.obtenerPorId(id);
    if (!tarea) return null;

    tarea.actualizarDescripcion(nuevaDescripcion);
    return tarea;
  }

  // Busca una tarea por id.
  // Retorna la tarea encontrada o null si no existe.
  obtenerPorId(id) {
    return this.tareas.find((t) => t.id === id) ?? null;
  }

  // Retorna una copia del arreglo para evitar mutaciones externas.
  listar() {
    return [...this.tareas];
  }

  // Elimina todas las tareas del gestor (reinicio completo).
  limpiar() {
    this.tareas = [];
  }

  // Convierte las tareas a objetos planos (serializables).
  // Esto se usa para guardarlas en localStorage o enviar por API.
  toJSON() {
    return this.tareas.map((t) => t.toJSON());
  }

  // Reconstruye un GestorTareas desde un arreglo (por ejemplo desde localStorage).
  static fromJSON(arr) {
    return new GestorTareas(Array.isArray(arr) ? arr : []);
  }
}
