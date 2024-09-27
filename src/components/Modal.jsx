import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,

  CButton

} from '@coreui/react-pro';

const Modal = ({ visible, onClose, onSubmit, campos, titulo }) => { 
  const [nuevoElemento, setNuevoElemento] = useState({}); 
  const handleInputChange = (e, campo) => {
    setNuevoElemento({...nuevoElemento, [campo.name]: e.target.value}); 
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>{titulo}</CModalTitle> 
      </CModalHeader>

      <CModalBody>
        {campos.map((campo, index) => {
          const commonProps = {
            onChange: (e) => handleInputChange(e, campo),
            type: campo.type,
            placeholder: campo.placeholder,
          };

          if (campo.type === 'select') {
            return (
              <select key={index} {...commonProps}> {/* {{ edit_1 }} Mover key aquí */}
                {campo.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }

          return (
            <input 
              key={index} // {{ edit_2 }} Mover key aquí
              {...commonProps} 
            />
          );
        })}
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Cancelar</CButton>
        <CButton color="primary" onClick={() => onSubmit(nuevoElemento)}>Agregar</CButton> {/* Cambiado a 'nuevoElemento' */}
      </CModalFooter>
    </CModal>
  );
};

export default Modal;
