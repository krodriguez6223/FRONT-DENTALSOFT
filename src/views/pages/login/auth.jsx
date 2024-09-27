export const validateToken = () => {
  const token = localStorage.getItem('token');
  
  // Si el token no existe, simplemente no se hace nada
  if (!token) {
    return true; // O false, dependiendo de cómo manejes la autenticación
  }
  
  const tokenExp = JSON.parse(atob(token.split('.')[1])).exp;
  if (tokenExp * 1000 < Date.now()) {
    localStorage.removeItem('token'); // Eliminar el token si ha expirado
    return false; // Token expirado
  }
  
  return true; // Token válido
};