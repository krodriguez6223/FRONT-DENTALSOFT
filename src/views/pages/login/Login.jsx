import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilArrowCircleLeft } from '@coreui/icons'
import Notificaciones, { mostrarNotificacion } from '../../../components/Notification'

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.replace('/inicio'); 
    }
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreUsuario.trim() || !contrasenia.trim()) {
      mostrarNotificacion('Por favor, completa todos los campos', 'error')
      return;
    }

    try {
      const API = import.meta.env.VITE_API_URL; 
      if (!API) {
        throw new Error('La URL de la API no está definida.');
      }

      const response = await fetch(`${API}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre_usuario: nombreUsuario.trim(), 
          contrasenia: contrasenia.trim() 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la respuesta del servidor');
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        
        // Almacenar token y permisos
        localStorage.setItem('token', data.token);
        
        // Almacenar permisos por separado para fácil acceso
        if (data.permisos) {
          localStorage.setItem('userPermissions', JSON.stringify(data.permisos));
        }

        // Almacenar información del usuario
        const userData = {
          id_usuario: data.id_usuario,
          nombre_usuario: data.nombre_usuario,
          caja_id: data.caja_id
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Redireccionar al inicio
        window.location.replace('/inicio');
      } else {
        throw new Error('La respuesta no es un JSON válido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      mostrarNotificacion(`${error.message}`, 'error'); 
    }
  };


  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-6 d-none d-md-block login-image"></div>

        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={8}>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-body-secondary">
                        Inicia sesión con tu usuario y contraseña
                      </p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          name="nombre_usuario"
                          placeholder="Usuario"
                          autoComplete="nombre_usuario"
                          value={nombreUsuario}
                          onChange={(e) => setNombreUsuario(e.target.value)}
                        />
                      </CInputGroup>

                      {/* Input de contraseña con botón para mostrar/ocultar */}
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type={mostrarContrasenia ? 'text' : 'password'}
                          name="contrasenia"
                          placeholder="Contraseña"
                          autoComplete="current-contrasenia"
                          value={contrasenia}
                          onChange={(e) => setContrasenia(e.target.value)}
                        />
                        <CInputGroupText
                          onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                          style={{ cursor: 'pointer' }}
                        >
                          <CIcon icon={mostrarContrasenia ? cilArrowCircleLeft : cilArrowCircleLeft} />
                        </CInputGroupText>
                      </CInputGroup>

                      <CButton color="primary" className="w-100" type="submit">
                        Iniciar Sesión
                      </CButton>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
          <Notificaciones />
        </div>
      </div>
    </div>
  );
};

export default Login;