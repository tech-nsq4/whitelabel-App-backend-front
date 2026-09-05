import { createContext, useContext, useState } from "react";
import { loginApi, logoutApi } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const permissions = user?.permissions ?? [];
  const isSuperAdmin =
    user?.is_super_admin === true || permissions.length === 0;

  const managesAllClinics = user?.manages_all_clinics === true;
  const adminClinicIds = managesAllClinics
    ? null
    : (user?.clinics?.map((c) => c.id) ?? []);

  function hasPermission(slug) {
    if (isSuperAdmin) return true;
    return permissions.includes(slug);
  }

  function getClinicParams() {
    if (managesAllClinics || !adminClinicIds?.length) return {};
    return { clinic_id: adminClinicIds[0] };
  }

  async function login(email, password) {
    const { data } = await loginApi(email.trim().toLowerCase(), password);
    const userData = data.data.admin;
    const token = data.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
    return true;
  }

  async function logout() {
    try {
      await logoutApi();
    } catch {
    }
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        isSuperAdmin,
        managesAllClinics,
        adminClinicIds,
        getClinicParams,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
