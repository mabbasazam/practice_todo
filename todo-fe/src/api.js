import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api";

export async function fetchTodos() {
  try {
    const res = await axios.get(`${API_BASE}/todos`);
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch todos");
  }
}

export async function createTodo(title) {
  try {
    const res = await axios.post(`${API_BASE}/todos`, { title });
    return res.data;
  } catch (err) {
    throw new Error("Failed to create todo");
  }
}

export async function updateTodo(id, changes) {
  try {
    const res = await axios.put(`${API_BASE}/todos/${id}`, changes);
    return res.data;
  } catch (err) {
    throw new Error("Failed to update todo");
  }
}

export async function deleteTodo(id) {
  try {
    await axios.delete(`${API_BASE}/todos/${id}`);
    return true;
  } catch (err) {
    throw new Error("Failed to delete todo");
  }
}
