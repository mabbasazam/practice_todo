import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (!todos.length) return <p className="text-gray-500">No todos yet.</p>;
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onEdit={(title) => onEdit(todo.id, title)}
        />
      ))}
    </ul>
  );
}
