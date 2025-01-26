import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  auth: JSON.parse(localStorage.getItem('auth')) || null, // Estado inicial desde localStorage
  setAuth: (authData) => {
    set({ auth: authData });
    localStorage.setItem('auth', JSON.stringify(authData)); // Sincroniza con localStorage
    localStorage.setItem('token', authData.token); // Opcional, si necesitas un acceso rápido al token
  },
  clearAuth: () => {
    set({ auth: null });
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('userPermissions');
    localStorage.removeItem('userData');
  },
  updatePermissions: (newPermissions) => {
    const currentAuth = get().auth;
    if (currentAuth) {
      const updatedAuth = { ...currentAuth, permisos: newPermissions };
      set({ auth: updatedAuth });
      localStorage.setItem('auth', JSON.stringify(updatedAuth)); 
      localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
    }
  },
  getToken: () => get().auth?.token || null,
  getPermissions: () => get().auth?.permisos || [],
}));
export default useAuthStore;
