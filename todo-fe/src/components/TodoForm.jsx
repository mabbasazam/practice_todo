import React, { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={submit} className="flex mb-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a todo..."
        className="border border-gray-300 p-2 flex-1 rounded-l"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
        Add
      </button>
    </form>
  );
}
