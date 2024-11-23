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
          padding: '10px 20px',
          marginBottom: '60px',
          zIndex: '9999',
          transition: 'all 0.3s ease-in-out',
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
        },
      }}
    />
  );
};

export const mostrarNotificacion = (mensaje, tipo) => {
  const estiloNotificacion = {
    borderLeft: `5px solid ${tipo === 'error' ? '#dc3545' : '#20c997'}`,
  };

  if (tipo === 'error') {
    toast.error(mensaje, {
      style: estiloNotificacion,
    });
  } else {
    toast.success(mensaje, {
      style: estiloNotificacion,
    });
  }
};

export default Notificaciones;
