import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSettings, cilSpeedometer, } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react-pro'

const _nav = [
  {
    component: CNavItem,
    name:'dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    
  },

  {
    component: CNavGroup,
    name: 'Adminstracion',
    to: '/administracion',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/administracion/usuarios',
      },
      {
        component: CNavItem,
        name: 'Roles',
        to: '/administracion/roles',
      },
      {
        component: CNavItem,
        name: 'Modulos',
        to: '/administracion/modulos',
      },

    ],
  },


]

export default _nav
