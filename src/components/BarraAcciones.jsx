import React from 'react';
import { CButton } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilActionUndo, cilFilter, cilDataTransferDown, cilPlus, cilPencil, cilPrint, cilShare } from '@coreui/icons'; // Importar iconos

const BarraAcciones = ({ botones, onAgregarClick, onEditarClick, onActualizarClick, onImprimirClick, onDescargarClick, onCompartirClick, onFiltrarClick }) => { // Agregado el prop onAgregarClick
  const buttonConfig = [
    { key: 'agregar', icon: cilPlus, title: 'Agregar' },
    { key: 'editar', icon: cilPencil, title: 'Editar' },
    { key: 'actualizar', icon: cilActionUndo, title: 'Actualizar' },
    { key: 'imprimir', icon: cilPrint, title: 'Imprimir' },
    { key: 'descargar', icon: cilDataTransferDown, title: 'Descargar' },
    { key: 'compartir', icon: cilShare, title: 'Compartir' },
    { key: 'filtrar', icon: cilFilter, title: 'Filtrar' },
  ];

  const renderButton = ({ key, icon, title }) => ( // Se asegura de que 'key' sea único
    botones[key] && (
      <CButton 
        key={key} // Agregado el prop key para evitar advertencias
        color="dark" 
        className="me-2 fs-5" 
        title={title} 
        onClick={() => {
          const actions = {
            agregar: onAgregarClick,
            editar: onEditarClick,
            actualizar: onActualizarClick,
            imprimir: onImprimirClick,
            descargar: onDescargarClick,
            compartir: onCompartirClick,
            filtrar: onFiltrarClick,
          };
          actions[key]?.(); 
        }} 
      >
        <CIcon icon={icon} /> 
      </CButton>
    )
  );

  return (
    <div style={{ marginBottom: '10px', backgroundColor: '#30394e', padding: '10px', borderRadius: '6px', boxShadow: 'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px' }}>
      {buttonConfig.map(renderButton)} {/* Mapeo de botones para renderizar */}
    </div>
  );
};

export default BarraAcciones;