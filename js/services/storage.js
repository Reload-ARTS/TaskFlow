const KEY = "taskflow_tasks";

export function saveTasks(tasksArray) {
  localStorage.setItem(KEY, JSON.stringify(tasksArray));
}

export function loadTasks() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("localStorage corrupto, se reinicia.", e);
    return [];
  }
}

export function clearTasks() {
  localStorage.removeItem(KEY);
}
