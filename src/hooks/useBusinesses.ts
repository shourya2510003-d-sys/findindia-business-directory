"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase";
import type { Business } from "../types";

// ─── Real-time businesses hook ────────────────────────────
export function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(
      ref(db, "businesses"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.entries(snapshot.val()).map(([id, val]) => ({
            id,
            ...(val as Business),
          }));
          setBusinesses(data);
        } else {
          setBusinesses([]);
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

  return { businesses, loading, error };
}

// ─── Single business hook ──────────────────────────────────
export function useBusiness(id: string) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onValue(
      ref(db, `businesses/${id}`),
      (snapshot) => {
        if (snapshot.exists()) {
          setBusiness({ id, ...snapshot.val() });
        } else {
          setBusiness(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  return { business, loading, error };
}
