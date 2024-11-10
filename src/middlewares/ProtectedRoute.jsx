import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ element }) => {
  const location = useLocation()
  const [isTokenExpired, setIsTokenExpired] = useState(false)

  // Función para verificar si el token ha expirado
  const checkTokenExpired = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      localStorage.removeItem('token')
      setIsTokenExpired(true)
      return true
    }
    return false
  }

  useEffect(() => {
    // Ejecutar la verificación solo una vez por ubicación (ruta) o cambio importante
    if (checkTokenExpired()) {
    //  alert('La sesión ha caducado. Por favor, inicie sesión nuevamente.')
    }
  }, [location])

  // Si el token ha expirado, redirigir al login
  if (isTokenExpired) {
    return <Navigate to="/login" replace />
  }

  return element
}

export default ProtectedRoute
