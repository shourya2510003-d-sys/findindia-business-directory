"use client";

import { useState } from "react";

export default function AdminPage() {
  const [name, setName] = useState("");

  const addCategory = async () => {
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    alert("Category Added!");
    setName("");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <input
        className="border p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
      />

      <button
        onClick={addCategory}
        className="ml-2 bg-red-500 text-white px-4 py-2"
      >
        Add
      </button>
    </div>
  );
}