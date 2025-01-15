import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const login = useCallback((userData) => {
    const authData = {
      id_usuario: userData.id_usuario,
      nombre_usuario: userData.nombre_usuario,
      caja_id: userData.caja_id,
      token: userData.token,
      permisos: userData.permisos
    };
    
    // Guardar en el estado
    setAuth(authData);
    
    // Guardar en localStorage
    localStorage.setItem('auth', JSON.stringify(authData));
    localStorage.setItem('token', userData.token);
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('userPermissions');
    localStorage.removeItem('userData');
  }, []);

  const updatePermissions = useCallback((newPermissions) => {
    if (auth) {
      const updatedAuth = {
        ...auth,
        permisos: newPermissions
      };
      setAuth(updatedAuth);
      localStorage.setItem('auth', JSON.stringify(updatedAuth));
      localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ 
      auth, 
      login, 
      logout,
      updatePermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};