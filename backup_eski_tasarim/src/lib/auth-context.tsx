"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthUser,
  defaultDoctors,
  getStoredUser,
  saveStoredUser,
  getRegisteredUsers,
  saveRegisteredUser,
  getInitials,
} from "./auth-data";

interface AuthContextType {
  user: AuthUser;
  registeredUsers: AuthUser[];
  isAuthenticated: boolean;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  login: (email: string, password?: string) => boolean;
  switchUser: (targetUser: AuthUser) => void;
  register: (userData: Partial<AuthUser>) => boolean;
  updateDoctorProfile: (updated: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(defaultDoctors[0]);
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(defaultDoctors);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Sync with localStorage
  useEffect(() => {
    const load = () => {
      const stored = getStoredUser();
      const allUsers = getRegisteredUsers();
      setUser(stored);
      setRegisteredUsers(allUsers);
    };

    load();

    const handleUpdate = () => load();
    window.addEventListener("dentapp_auth_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("dentapp_auth_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const switchUser = (targetUser: AuthUser) => {
    setUser(targetUser);
    saveStoredUser(targetUser);
    setIsAuthenticated(true);
  };

  const login = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const all = getRegisteredUsers();
    const found = all.find((u) => u.email.toLowerCase() === cleanEmail);

    if (found) {
      switchUser(found);
    } else {
      // Default to doctor 0 or create session
      switchUser(defaultDoctors[0]);
    }
    setIsAuthenticated(true);
    return true;
  };

  const register = (data: Partial<AuthUser>): boolean => {
    const name = data.name?.trim() || "Dr. Yeni Hekim";
    const initials = getInitials(name);
    const newUser: AuthUser = {
      id: "dr_" + Date.now().toString(36),
      name,
      title: data.title?.trim() || "Diş Hekimi",
      role: data.role?.trim() || "Hekim",
      specialty: data.specialty?.trim() || "Genel Diş Hekimliği",
      email: data.email?.trim() || `hekim_${Date.now()}@dentasphere.com`,
      phone: data.phone?.trim() || "+90 (555) 000 00 00",
      avatarInitials: initials,
      clinicName: data.clinicName?.trim() || "DentaSphere Ağız ve Diş Sağlığı Polikliniği",
    };

    saveRegisteredUser(newUser);
    saveStoredUser(newUser);
    setUser(newUser);
    setRegisteredUsers(getRegisteredUsers());
    setIsAuthenticated(true);
    return true;
  };

  const updateDoctorProfile = (updated: Partial<AuthUser>) => {
    const newName = updated.name ? updated.name.trim() : user.name;
    const initials = getInitials(newName);

    const merged: AuthUser = {
      ...user,
      ...updated,
      name: newName,
      avatarInitials: initials,
    };

    saveStoredUser(merged);
    saveRegisteredUser(merged);
    setUser(merged);
    setRegisteredUsers(getRegisteredUsers());
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registeredUsers,
        isAuthenticated,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        login,
        switchUser,
        register,
        updateDoctorProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
