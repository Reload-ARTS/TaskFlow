// Clase que representa una tarea individual.
// Define la estructura y el comportamiento básico de cada tarea dentro de la aplicación.

export default class Tarea {
  constructor({
    id,
    descripcion,
    fechaLimite = null,
    estado = "pendiente",
    fechaCreacion = null
  }) {
    // Identificador único de la tarea
    this.id = id;

    // Descripción principal (se limpia con trim para evitar espacios innecesarios)
    this.descripcion = descripcion.trim();

    // Estado de la tarea: "pendiente" o "completada"
    this.estado = estado;

    // Fecha de creación (si no se proporciona, se genera automáticamente)
    this.fechaCreacion = fechaCreacion ?? new Date().toISOString();

    // Fecha límite en formato "YYYY-MM-DD" o null
    this.fechaLimite = fechaLimite;
  }

  // Alterna el estado entre "pendiente" y "completada"
  toggleEstado() {
    this.estado =
      this.estado === "pendiente" ? "completada" : "pendiente";
  }

  // Actualiza la descripción validando que no quede vacía
  actualizarDescripcion(nuevaDescripcion) {
    const texto = (nuevaDescripcion ?? "").trim();

    if (!texto) {
      throw new Error("La descripción no puede estar vacía.");
    }

    this.descripcion = texto;
  }

  // Asigna o elimina la fecha límite
  // Se espera formato "YYYY-MM-DD" o null/""
  setFechaLimite(fecha) {
    this.fechaLimite = fecha ? fecha : null;
  }

  // Indica si la tarea tiene fecha límite asociada
  esConFechaLimite() {
    return Boolean(this.fechaLimite);
  }

  // Convierte la instancia en un objeto plano
  // Útil para guardar en localStorage o enviar a una API
  toJSON() {
    return {
      id: this.id,
      descripcion: this.descripcion,
      estado: this.estado,
      fechaCreacion: this.fechaCreacion,
      fechaLimite: this.fechaLimite,
    };
  }

  // Reconstruye una instancia de Tarea a partir de un objeto plano
  // Útil al cargar datos desde localStorage o API
  static fromJSON(obj) {
    return new Tarea(obj);
  }
}
