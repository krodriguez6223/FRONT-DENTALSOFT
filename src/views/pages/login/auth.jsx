export const validateToken = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return true;
  }
  const tokenExp = JSON.parse(atob(token.split('.')[1])).exp;
  if (tokenExp * 1000 < Date.now()) {
    localStorage.removeItem('token'); 
    return false; 
  }
  
  return true; 
};