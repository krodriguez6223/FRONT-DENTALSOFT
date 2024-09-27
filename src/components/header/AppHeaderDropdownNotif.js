import React from 'react'
import { CBadge,  CDropdown, CDropdownHeader,  CDropdownItem, CDropdownMenu,  CDropdownToggle,} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilBell, cilUserFollow } from '@coreui/icons'

const AppHeaderDropdownNotif = () => {
  const itemsCount = 5
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
        <span className="d-inline-block my-1 mx-2 position-relative">
          <CIcon icon={cilBell} size="lg" />
          <CBadge color="danger" position="top-end" shape="rounded-circle" className="p-1">
            <span className="visually-hidden">{itemsCount} new alerts</span>
          </CBadge>
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
          Tienes { itemsCount} notificaciones
        </CDropdownHeader>
        <CDropdownItem>
          <CIcon icon={cilUserFollow} className="me-2 text-success" /> egistros
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownNotif
