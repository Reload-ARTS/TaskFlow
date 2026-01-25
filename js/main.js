import GestorTareas from "./models/GestorTareas.js";

const gestor = new GestorTareas();

console.log("TaskFlow ready ✅");

const t1 = gestor.agregar({ descripcion: "Probar POO", fechaLimite: "" });
const t2 = gestor.agregar({ descripcion: "Tarea con fecha", fechaLimite: "2026-02-01" });

console.log(gestor.listar());
gestor.toggleEstado(t1.id);
console.log("Estado cambiado:", gestor.obtenerPorId(t1.id));
