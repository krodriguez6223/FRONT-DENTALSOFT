import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import { cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const { t } = useTranslation()

  const handleLogout = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      window.location.replace('/inicio#/login');
    }, 100);
  }

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" status="success" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">    
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Cerrar sesión
        </CDropdownItem>
        
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown