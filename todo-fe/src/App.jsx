import React, { useEffect, useState } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(title) {
    try {
      const newTodo = await createTodo(title);
      setTodos(prev => [newTodo, ...prev]);
    } catch (err) {
      alert(err.message || 'Failed to add');
    }
  }

  async function handleToggle(id) {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    try {
      const updated = await updateTodo(id, { completed: !t.completed });
      setTodos(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      alert(err.message || 'Failed to update');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this todo?')) return;
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  }

  async function handleEdit(id, title) {
    try {
      const updated = await updateTodo(id, { title });
      setTodos(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      alert(err.message || 'Failed to edit');
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <TodoForm onAdd={handleAdd} />
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;