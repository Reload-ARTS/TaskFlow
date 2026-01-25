import Tarea from "./Tarea.js";

export default class GestorTareas {
  constructor(tareas = []) {
    // Asegura que todo sea instancia de Tarea
    this.tareas = tareas.map((t) => (t instanceof Tarea ? t : Tarea.fromJSON(t)));
  }

  generarId() {
    //(timestamp + random)
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  agregar({ descripcion, fechaLimite = null, estado = "pendiente"}) {
    const texto = (descripcion ?? "").trim();
    if (!texto) throw new Error("Debes ingresar una descripción.");

    const tarea = new Tarea({
      id: this.generarId(),
      descripcion: texto,
      fechaLimite: fechaLimite || null,
      estado,
    });

    this.tareas = [...this.tareas, tarea]; // spread (ES6)
    return tarea;
  }

  eliminar(id) {
    const antes = this.tareas.length;
    this.tareas = this.tareas.filter((t) => t.id !== id);
    return this.tareas.length !== antes;
  }

  toggleEstado(id) {
    const tarea = this.obtenerPorId(id);
    if (!tarea) return null;
    tarea.toggleEstado();
    return tarea;
  }

  actualizarDescripcion(id, nuevaDescripcion) {
    const tarea = this.obtenerPorId(id);
    if (!tarea) return null;
    tarea.actualizarDescripcion(nuevaDescripcion);
    return tarea;
  }

  obtenerPorId(id) {
    return this.tareas.find((t) => t.id === id) ?? null;
  }

  listar() {
    // devuelve una copia para evitar mutaciones externas
    return [...this.tareas];
  }

  limpiar() {
    this.tareas = [];
  }

  toJSON() {
    return this.tareas.map((t) => t.toJSON());
  }

  static fromJSON(arr) {
    return new GestorTareas(Array.isArray(arr) ? arr : []);
  }
}
