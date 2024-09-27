import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react-pro'

import { useNavigate } from 'react-router-dom'

const Page404 = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/'); // Redirige a la página de inicio usando React Router
  };
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Página no encontrada</h4>
              <p className="text-body-secondary float-start">
              Volver a la pgina principal
              </p>
            </div>
           
              <CButton  color="info"  onClick={handleRedirect}>Regresar</CButton> 
           
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
