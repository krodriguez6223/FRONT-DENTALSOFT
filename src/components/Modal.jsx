import React, { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react-pro';
import { validation } from '../components/validation'; 
import Select from 'react-select';
import CIcon from '@coreui/icons-react';

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
    const formattedValue = campo.type === 'text' ? value.toUpperCase() : value;
    setNuevoElemento(prev => ({
      ...prev,
      [campo.name]: formattedValue
    }));
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
      <CModalHeader onClose={handleClose} style={{ backgroundColor: '#0381a1',color: 'white' }}>
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
                <div className="d-flex align-items-center mt-2" style={{ marginLeft: '10px' }}>
                  <Select
                    {...commonProps}
                    className="flex-grow-1"
                    value={campo.options.find(option => option.value === nuevoElemento[campo.name]) || null}
                    options={campo.options.map(option => ({
                      value: option.value,
                      label: option.label,
                    }))}
                    onChange={selectedOption => handleInputChange(selectedOption.value, campo)}
                  />
                  {campo.extraButton && (
                    <CButton
                      onClick={campo.extraButton.onClick}
                      className={campo.extraButton.className}
                      title={campo.extraButton.title}
                      style={campo.extraButton.style}
                    >
                      <CIcon 
                        icon={campo.extraButton.icon} 
                        size='lg'
                      />
                    </CButton>
                  )}
                </div>
                {errores[campo.name] && <div className="text-danger">{errores[campo.name]}</div>}
              </div>
            ) : campo.type === 'button' ? (
              <div className={`form-group ${col}`} key={campo.key}>
                <CButton
                  color={campo.color }
                  onClick={() => campo.onClick && campo.onClick(nuevoElemento)}
                  className={`m-2 ${campo.className || ''}`}
                  style={campo.style}
                  title={campo.placeholder}
                >
                  {campo.icon && (
                    <CIcon 
                      icon={campo.icon}
                      size='lg'
                    />
                  )}
                </CButton>
              </div>
            ) : (
              <div className={`form-group ${col}`} key={campo.key}>
                <div className="floating-label-group">
                  <input
                    type={campo.type}
                    {...commonProps}
                    value={nuevoElemento[campo.name] || ''}
                    onChange={e => handleInputChange(e.target.value, campo)}
                    placeholder=" "
                  />
                  <label className={nuevoElemento[campo.name] ? 'floating' : ''}>
                    {campo.placeholder}
                  </label>
                  {errores[campo.name] && <div className="text-danger">{errores[campo.name]}</div>}
                </div>
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
