export default class Tarea {
  constructor({ id, descripcion, fechaLimite = null, estado = "pendiente", fechaCreacion = null }) {
    this.id = id;
    this.descripcion = descripcion.trim();
    this.estado = estado; // "pendiente" | "completada"
    this.fechaCreacion = fechaCreacion ?? new Date().toISOString();
    this.fechaLimite = fechaLimite; // "YYYY-MM-DD" o null
  }

  toggleEstado() {
    this.estado = this.estado === "pendiente" ? "completada" : "pendiente";
  }

  actualizarDescripcion(nuevaDescripcion) {
    const texto = (nuevaDescripcion ?? "").trim();
    if (!texto) throw new Error("La descripción no puede estar vacía.");
    this.descripcion = texto;
  }

  setFechaLimite(fecha) {
    // fecha esperada: "YYYY-MM-DD" o null/""
    this.fechaLimite = fecha ? fecha : null;
  }

  esConFechaLimite() {
    return Boolean(this.fechaLimite);
  }

  // Para guardar en localStorage / enviar por API (objeto plano)
  toJSON() {
    return {
      id: this.id,
      descripcion: this.descripcion,
      estado: this.estado,
      fechaCreacion: this.fechaCreacion,
      fechaLimite: this.fechaLimite,
    };
  }

  // Para reconstruir desde localStorage / API
  static fromJSON(obj) {
    return new Tarea(obj);
  }
}
