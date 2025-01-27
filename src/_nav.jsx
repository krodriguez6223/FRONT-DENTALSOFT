import React from 'react'
import CIcon from '@coreui/icons-react'
import { 
  cilSettings, 
  cilSpeedometer, 
  cilWallet, 
  cilBasket, 
  cilCart, 
  cilCalendar, 
  cilDollar, 
  cilMoney,
  cilPencil,
  cilSmile
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react-pro'
import { getAllPermissions } from './middlewares/permissions'

// Mapeo de íconos por módulo
const iconosPorModulo = {
  'ADMINISTRACION': cilSettings,    
  'CARTERA': cilWallet,            
  'INVENTARIO': cilBasket,         
  'VENTAS': cilCart,              
  'AGENDAMIENTO': cilCalendar,    
  'COMPRAS': cilDollar,           
  'GASTOS': cilMoney,
  'ODONTOLOGICO': cilSmile             
}

// Agregar array de submódulos a excluir
const submodulosExcluidos = [
  'detallecatalogo', 
  'submodulos', 
  'permisos'
] 

const createNav = (activeModule) => {
  const currentModule = activeModule || localStorage.getItem('activeModule')
  
  const timestamp = Date.now()
  
  const baseNav = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      key: `dashboard-${timestamp}`
    }
  ]

  // Si no hay módulo activo en parámetros ni localStorage, solo retornar el Dashboard
  if (!currentModule) {
    return baseNav;
  }

  // Guardar el módulo activo en localStorage
  localStorage.setItem('activeModule', currentModule)

  // Obtener permisos del localStorage
  const userPermissions = getAllPermissions()

  // Modificar la lógica de agrupación de permisos
  const modulePermissions = userPermissions.reduce((acc, permission) => {
    if (!acc[permission.id_modulo]) {
      acc[permission.id_modulo] = {
        nombre: permission.nombre_modulo,
        ruta: permission.ruta,
        submodulos: []
      }
    }

    if (permission.read && permission.nombre_submodulo) {
      const ruta = `${permission.ruta}`.toLowerCase()
      
      // Verificar si el submódulo no está en la lista de excluidos
      const nombreSubmódulo = permission.nombre_submodulo.toLowerCase()
      if (!submodulosExcluidos.some(excluido => excluido.toLowerCase() === nombreSubmódulo)) {
        const submduloExistente = acc[permission.id_modulo].submodulos.some(
          sub => sub.name.toLowerCase() === nombreSubmódulo
        )

        if (!submduloExistente) {
          acc[permission.id_modulo].submodulos.push({
            component: CNavItem,
            name: permission.nombre_submodulo.charAt(0).toUpperCase() + permission.nombre_submodulo.slice(1),
            to: ruta,
          })
        }
      }
    }

    return acc
  }, {})

  // Buscar el módulo activo usando currentModule en lugar de activeModule
  const moduleData = Object.values(modulePermissions).find(
    mod => mod.nombre === currentModule
  )

  // Si encontramos el módulo activo y tiene submodulos, lo agregamos al nav
  if (moduleData && moduleData.submodulos.length > 0) {
    baseNav.push({
      component: CNavGroup,
      name: moduleData.nombre,
      icon: <CIcon icon={iconosPorModulo[moduleData.nombre] || cilPencil} customClassName="nav-icon" />,
      items: moduleData.submodulos,
      key: `module-${moduleData.nombre}-${timestamp}`,
      visible: false,
      defaultOpen: false
    })
  }

  return baseNav
}

export default createNav
