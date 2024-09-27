import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard.jsx'))
const Usuarios = React.lazy(() => import('./views/administracion/Usuarios.jsx'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
  },
  {
    path: '/administracion/usuarios',
    name: 'Usuarios',
    element: Usuarios,
  },


]

export default routes