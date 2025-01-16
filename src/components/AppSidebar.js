import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// Importar createNav y las acciones del slice
import createNav from '../_nav'
import { set } from '../redux/slices/navigationSlice'

const AppSidebar = () => {
  const dispatch = useDispatch()
  // Actualizar los selectores para usar el path correcto del estado
  const unfoldable = useSelector((state) => state.navigation.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.navigation.sidebarShow)
  const activeModule = useSelector((state) => state.navigation.activeModule)

  // Crear el navigation dinámicamente basado en el módulo activo
  const navigation = createNav(activeModule)

  return (
    <CSidebar
      className="bg-dark-gradient "
      colorScheme="dark"
      style={{background:'#03708c'}}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(set({ sidebarShow: visible }))
      }}
    >
      <CSidebarHeader >
        <CSidebarBrand as={NavLink} to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(set({ sidebarShow: false }))}
        />
        <CSidebarToggler
          onClick={() => dispatch(set({ sidebarUnfoldable: !unfoldable }))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
