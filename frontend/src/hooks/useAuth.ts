import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout, updateUser } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isDoctor: user?.role === 'DOCTOR',
    isAdmin: user?.role === 'ADMIN',
    isPatient: user?.role === 'PATIENT',
    setAuth,
    logout,
    updateUser,
  };
}
