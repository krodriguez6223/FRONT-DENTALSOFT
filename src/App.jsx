import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './middlewares/ProtectedRoute.jsx'
import { CSpinner, useColorModes } from '@coreui/react-pro'
import './scss/style.scss'


// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes(
    'coreui-pro-react-admin-template-theme-modern',
  )
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
    const token = localStorage.getItem('token'); 
    if (!token || (JSON.parse(atob(token.split('.')[1])).exp * 1000 < Date.now())) {
      localStorage.removeItem('token'); 
      alert("El token ha expirado. Por favor, inicie sesión nuevamente.");
      window.location.href = '/login'; 
    }
  }, []) 
  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route path="*" name="Home" element={<ProtectedRoute element={<DefaultLayout />} />} />
          <Route path="*" element={<Navigate to="/404" replace />} /> 
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
