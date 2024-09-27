import React from 'react'
import { CFooter } from '@coreui/react-pro'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Dental Soft
        </a>
        <span className="ms-1">&copy; 2024 </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
         kelvin Rodriguez
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
