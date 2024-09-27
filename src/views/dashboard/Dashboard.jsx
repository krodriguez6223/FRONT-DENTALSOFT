import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken } from '../../views/pages/login/auth'; // Importar la función de validación

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!validateToken()) {
      alert("El token ha expirado. Por favor, inicie sesión nuevamente."); // Mensaje de expiración
      navigate('/login'); // Redirigir a la página de login
    }
  }, [navigate]);

  return (
    <div>
      {/* Contenido del dashboard */}
    </div>
  );
};

export default Dashboard;
