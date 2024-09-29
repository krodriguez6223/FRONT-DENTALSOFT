import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react-pro';

const Modal = ({ visible, onClose, onSubmit, campos, titulo }) => {
  const [nuevoElemento, setNuevoElemento] = useState({});

  const handleInputChange = (e, campo) => {
    const { value } = e.target;
    setNuevoElemento(prev => ({ ...prev, [campo.name]: value }));
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>{titulo}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {campos.map(campo => {
          const commonProps = {
            onChange: e => handleInputChange(e, campo),
            placeholder: campo.placeholder,
          };

          return campo.type === 'select' ? (
            <select key={campo.key} {...commonProps}>
              {campo.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input key={campo.key} type={campo.type} {...commonProps} />
          );
        })}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={() => onSubmit(nuevoElemento)}>
          Agregar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default Modal;
