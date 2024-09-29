import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Notificaciones = () => {
  return (
    <Toaster 
      position="bottom-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          color: '#000',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '10px 20px',
          margin: '10px',
          zIndex: '9999',
          transition: 'all 0.3s ease-in-out',
        },
      }}
    />
  );
};

export const mostrarNotificacion = (mensaje, tipo) => {
  if (tipo === 'error') {
    toast.error(mensaje);
  } else {
    toast.success(mensaje);
  }
};

export default Notificaciones;