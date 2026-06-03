"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  logoutUser,
  setCurrentUser,
  onAuthChange,
} from "../lib/auth";

import type { OwnerUser } from "@/types/business";

type AuthContextType = {
  user: OwnerUser | null;
  loading: boolean;
  login: (user: OwnerUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<OwnerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);

    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser as OwnerUser | null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (loggedInUser: OwnerUser) => {
    setCurrentUser(loggedInUser);
    setUser(loggedInUser);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}