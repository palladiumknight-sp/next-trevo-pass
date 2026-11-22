"use client";

import { User, onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  loginUser,
  logoutUser,
  requestPasswordReset,
} from "@/features/auth/repositories/auth.repository";

import { AuthContextProps } from "@/@types";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase/auth";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "O endereço de e-mail informado é inválido.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/user-disabled": "Esta conta está desativada.",
  "auth/too-many-requests":
    "Muitas tentativas. Aguarde um momento e tente novamente.",
  "auth/network-request-failed":
    "Não foi possível conectar. Verifique sua conexão e tente novamente.",
  "auth/email-already-in-use": "Este e-mail já está em uso.",
  "auth/weak-password": "A senha informada é muito fraca.",
};

function normalizeAuthError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    return new Error(
      AUTH_ERROR_MESSAGES[error.code] ??
        "Não foi possível concluir a operação de autenticação. Tente novamente.",
    );
  }

  return error instanceof Error
    ? error
    : new Error("Ocorreu um erro inesperado na autenticação.");
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setUserVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      return await loginUser(email, password);
    } catch (error) {
      throw normalizeAuthError(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      throw normalizeAuthError(error);
    }
  }, []);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    try {
      await requestPasswordReset(email);
    } catch (error) {
      throw normalizeAuthError(error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setUser(null);
      return null;
    }

    try {
      await currentUser.reload();
      const refreshedUser = auth.currentUser;
      setUser(refreshedUser);
      setUserVersion((version) => version + 1);
      return refreshedUser;
    } catch (error) {
      throw normalizeAuthError(error);
    }
  }, []);

  const status: AuthContextProps["status"] = loading
    ? "loading"
    : user
      ? "authenticated"
      : "unauthenticated";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        status,
        signIn,
        signOut,
        sendPasswordResetEmail,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
