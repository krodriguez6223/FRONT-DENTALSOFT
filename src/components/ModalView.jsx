import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react-pro';

const CustomModal = ({ visible, onClose, data, dataRenderer, title = 'Detalles' }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {dataRenderer ? dataRenderer(data) : <p>No hay datos para mostrar.</p>}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Cerrar</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CustomModal;
