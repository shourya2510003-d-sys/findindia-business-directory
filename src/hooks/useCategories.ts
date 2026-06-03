"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase";
import type { Category } from "../types";

// ─── Real-time categories hook ────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(
      ref(db, "categories"),
      (snapshot) => {
       if (snapshot.exists()) {
  const rawData = snapshot.val();

  if (rawData && typeof rawData === "object") {
    const data = Object.entries(rawData).map(([id, val]) => ({
      id,
      ...(val as Category),
    }));

    setCategories(data);
  } else {
    setCategories([]);
  }
} else {
  setCategories([]);
}
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { categories, loading, error };
}
