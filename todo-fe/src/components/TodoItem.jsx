import React, { useState } from "react";

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);

  function save() {
    if (!value.trim()) return;
    onEdit(value.trim());
    setEditing(false);
  }

  return (
    <li
      className={`flex items-center p-2 border border-gray-200 rounded ${
        todo.completed ? "bg-gray-100 line-through text-gray-500" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="mr-2"
      />

      {editing ? (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="border border-gray-300 p-1 flex-1"
          />
          <button
            onClick={save}
            className="bg-green-500 text-white px-2 py-1 ml-2 rounded"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setValue(todo.title);
            }}
            className="bg-gray-500 text-white px-2 py-1 ml-2 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span
            className="flex-1 cursor-pointer"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
