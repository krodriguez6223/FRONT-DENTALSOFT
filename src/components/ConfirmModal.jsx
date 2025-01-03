import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react-pro';

const ConfirmModal = ({ visible, onClose, onConfirm, title, message }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 99999,
        display: visible ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '4px',
        width: 'auto',
        minWidth: '300px',
        maxWidth: '90%'
      }}>
        <CModal 
          visible={visible}
          onClose={onClose} 
          alignment="center"
          backdrop={false}
          portal={false}
        >
          <CModalHeader color='danger' closeButton>
            <CModalTitle>{title}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {message}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={onClose}>
              Cancelar
            </CButton>
            <CButton color="danger" onClick={onConfirm}>
              Confirmar
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    </div>
  );
};

export default ConfirmModal;