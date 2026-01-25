export async function fetchTasksFromApi(limit = 5) {
  const url = `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  // Normalizamos al formato que usa tu app
  return data.map((item) => ({
    descripcion: item.title,
    estado: item.completed ? "completada" : "pendiente",
  }));
}
