import React, { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalTitle,  CModalBody,  CModalFooter,  CButton, } from '@coreui/react-pro';
import { validation } from '../components/validation'; 
import Select from 'react-select'

const Modal = ({ visible, onClose, onSubmit, campos, titulo, col, tamaño, formData, isEdit}) => {
  const [nuevoElemento, setNuevoElemento] = useState({});
  const [errores, setErrores] = useState({}); 
  useEffect(() => {
    if (visible) {
      setNuevoElemento(isEdit ? { ...formData } : {}); 
      setErrores({});
    }
  }, [visible, formData, isEdit]); 

  const handleClose = () => {
    setNuevoElemento({}); 
    setErrores({});
    onClose(); 
  };

  const schema = validation(campos, isEdit);

  const handleInputChange = (e, campo) => {
    const value = e.target ? e.target.value : e; 
    const upperCaseValue = campo.type === 'text' ? value.toUpperCase() : value; 
    setNuevoElemento(prev => ({ ...prev, [campo.name]: upperCaseValue })); 
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(nuevoElemento, { abortEarly: false });
      
      if (isEdit) {
        onSubmit({ ...formData, ...nuevoElemento }); 
      } else {
        onSubmit(nuevoElemento); 
      }
    } catch (validationErrors) {
      const formattedErrors = validationErrors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrores(formattedErrors); 
    }
  };

  const modalSize = ["sm", "lg", "xl"].includes(tamaño) ? tamaño : "lg"; 

  return (
    <CModal visible={visible} onClose={handleClose} size={modalSize} backdrop="static">
      <CModalHeader onClose={handleClose}>
        <CModalTitle>{titulo}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className={'row col-md-12'}>
          {campos.map(campo => {
            const commonProps = {
              onChange: e => handleInputChange(e, campo),
              placeholder: campo.placeholder,
              className: "form-control col-md-6 m-2 ", 
              value: nuevoElemento[campo.name] || '', // Asegurarse de que el valor se muestre
            };

            return campo.type === 'select' ? (
              <div className={`form-group ${col}`} key={campo.key}>
                 <Select 
                {...commonProps}
                value={campo.options.find(option => option.value === nuevoElemento[campo.name])} // Asegúrate de que el valor seleccionado se muestre correctamente
                options={campo.options.map(option => ({ value: option.value, label: option.label }))} // Formatea las opciones para react-select
                onChange={selectedOption => handleInputChange(selectedOption.value, campo)} // Cambia aquí para pasar solo el valor
              />
                {errores[campo.name] && <div className="text-danger">{errores[campo.name]}</div>} 
              </div>
            ) : (
              <div className={`form-group ${col}`} key={campo.key}>
                <input 
                  type={campo.type}{...commonProps}
                />
                {errores[campo.name] && <div className="text-danger">{errores[campo.name]}</div>}
              </div>
            );
          })}
        </div>
      </CModalBody>
      <CModalFooter className="d-flex justify-content-between">     
        <CButton color="secondary" onClick={handleClose}> Cancelar
        </CButton>
        <CButton color={ !isEdit ? 'primary' : 'warning' } onClick={handleSubmit}> {!isEdit ? 'Agregar' : 'Actualizar'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default Modal;
