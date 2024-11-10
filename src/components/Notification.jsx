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
          margin: '10px',
          zIndex: '9999',
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0 4px 8px rgba(8, 8, 8, 1), -1px 6px 40px -10px rgba(99, 101, 144, 1)', // Se mantiene el boxShadow

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