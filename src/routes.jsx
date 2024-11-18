import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard.jsx'))
//const Usuarios = React.lazy(() => import('./views/administracion/Usuarios.jsx'))
import Usuarios from './views/administracion/Usuarios.jsx'
import Roles from './views/administracion/Roles.jsx'
import Modulos from './views/administracion/Modulos.jsx'

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
  {
    path: '/administracion/roles',
    name: 'Roles',
    element: Roles,
  },
  {
    path: '/administracion/modulos',
    name: 'Modulos',
    element: Modulos,
  },


]

export default routes