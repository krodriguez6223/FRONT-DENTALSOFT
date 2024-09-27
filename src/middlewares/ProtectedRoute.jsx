import React from "react";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token'); 
    const isAuthenticated = token && token.length > 0; 
    return isAuthenticated ? element : <Navigate to="/login" /> 
  }



export default ProtectedRoute;