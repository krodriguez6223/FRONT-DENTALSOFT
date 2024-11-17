import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPuzzle, cilSpeedometer, } from '@coreui/icons'
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
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
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

    ],
  },


]

export default _nav
