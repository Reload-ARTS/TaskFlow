// En este archivo me encargo de consumir una API externa.
// Uso fetch con async/await para traer tareas de prueba
// y luego adapto los datos al formato que usa mi aplicación.

export async function fetchTasksFromApi(limit = 5) {
  // Construyo la URL incluyendo un parámetro para limitar la cantidad de tareas
  const url = `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`;

  // Hago la petición HTTP usando fetch (esto devuelve una promesa)
  const res = await fetch(url);

  // Verifico si la respuesta fue exitosa (status 200–299)
  // Si no lo fue, lanzo un error para que lo capture el try/catch en main.js
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  // Convierto la respuesta a formato JSON
  const data = await res.json();

  // Normalizo los datos para que coincidan con la estructura de mi aplicación.
  // La API devuelve:
  // - title
  // - completed (true/false)
  //
  // Yo transformo eso en:
  // - descripcion
  // - estado ("pendiente" o "completada")
  return data.map((item) => ({
    descripcion: item.title,
    estado: item.completed ? "completada" : "pendiente",
  }));
}
