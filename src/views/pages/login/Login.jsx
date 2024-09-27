import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react-pro'

import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'


const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  useEffect(() => {
   
    const token = localStorage.getItem('token');
    if (token) {
      window.location.replace('/inicio'); 
    }
  }, []); 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!nombreUsuario.trim() || !contrasenia.trim()) {
      alert("Por favor, completa todos los campos.");
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
        body: JSON.stringify({ nombre_usuario: nombreUsuario.trim(), contrasenia: contrasenia.trim() }),
      });

      // Manejo de respuesta no OK
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error en la respuesta del servidor');
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        // Manteniendo localStorage para el token
        localStorage.setItem('token', data.token);
        window.location.replace('/inicio');
      } else {
        throw new Error('La respuesta no es un JSON válido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      alert(`Error: ${error.message}`);
    }
  };



  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column flex-md-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Inicia sesión con tu usuario y contraseña</p>
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
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name="contrasenia"
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-contrasenia"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12}>
                        <CButton
                          color="primary"
                          className="px-4 w-100"
                          type='submit'
                          value="Iniciar Sesión"
                        >
                          Iniciar Sesión
                        </CButton>
                      </CCol>

                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-none d-md-block text-center" style={{ width: '100%', minWidth: '300px' }}>
                <CCardBody className="text-center">
                  <div>


                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login