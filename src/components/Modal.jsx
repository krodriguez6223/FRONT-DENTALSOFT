import React, { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react-pro';
import { validation } from '../components/validation'; 
import Select from 'react-select';

const Modal = ({ visible, onClose, onSubmit, campos, titulo, col, tamaño, formData, isEdit }) => {
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

  const handleInputChange = (value, campo) => {
    const formattedValue = campo.type === 'text' ? value.toUpperCase() : value; // Convertir a mayúsculas si es texto
    setNuevoElemento(prev => ({ ...prev, [campo.name]: formattedValue }));
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
        <div className="row col-md-12">
          {campos.map(campo => {
            const commonProps = {
              placeholder: campo.placeholder,
              className: "form-control col-md-6 m-2",
            };

            return campo.type === 'select' ? (
              <div className={`form-group ${col}`} key={campo.key}>
                <label>{campo.placeholder}</label>
                <Select
                  {...commonProps}
                  value={campo.options.find(option => option.value === nuevoElemento[campo.name]) || null} // Mostrar el valor seleccionado
                  options={campo.options.map(option => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  onChange={selectedOption => handleInputChange(selectedOption.value, campo)} // Actualizar solo el valor seleccionado
                />
                {errores[campo.name] && <div className="text-danger">{errores[campo.name]}</div>}
              </div>
            ) : (
              <div className={`form-group ${col}`} key={campo.key}>
                <label>{campo.placeholder}</label>
                <input
                  type={campo.type}
                  {...commonProps}
                  value={nuevoElemento[campo.name] || ''}
                  onChange={e => handleInputChange(e.target.value, campo)}
                />
                {errores[campo.name] && <div className="text-danger">{errores[campo.name]}</div>}
              </div>
            );
          })}
        </div>
      </CModalBody>
      <CModalFooter className="d-flex justify-content-between">
        <CButton color="secondary" onClick={handleClose}>Cancelar</CButton>
        <CButton color={!isEdit ? 'primary' : 'warning'} onClick={handleSubmit}>
          {!isEdit ? 'Agregar' : 'Actualizar'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default Modal;
