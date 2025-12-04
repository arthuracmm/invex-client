'use client';

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AuthService } from "../service/auth/authService";
import api from "../service/auth/api";

interface Establishment {
  adress: string
  cep: string
  city: string
  cnpj: string
  complement: string | null
  email: string
  id: string
  isActive: boolean
  name: string
  neighborhood: string
  number: string
  type: string
}

interface User {
  id: string;
  fullName: string;
  role: string;
  cpf: string;
  email: string;
  establishment: Establishment
  [key: string]: any;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    const access_token = Cookies.get("token");
    if (!access_token) return;

    try {
      const decodedUser = await AuthService.decode(access_token);
      if (!decodedUser?.sub) return;

      const userDetails = await api.get(`/users/${decodedUser.sub}`);
      setUser(userDetails.data);
      console.log(userDetails.data)
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);