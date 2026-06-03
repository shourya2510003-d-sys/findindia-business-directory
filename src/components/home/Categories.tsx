"use client";

import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  icon?: string;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
    .then((data) => {
  console.log("API Response:", data);
  setCategories(Array.isArray(data) ? data : []);
});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white border rounded-xl p-4 text-center hover:shadow"
          >
            {cat.name}
          </div>
        ))}
      </div>
    </section>
  );
}
