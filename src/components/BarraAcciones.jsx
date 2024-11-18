import React from 'react';
import { CButton } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilActionUndo, cilFilter, cilDataTransferDown, cilPlus, cilPencil, cilPrint, cilShare } from '@coreui/icons'; 

const BarraAcciones = ({ botones, onAgregarClick, onEditarClick, onActualizarClick, onImprimirClick, onDescargarClick, onCompartirClick, onFiltrarClick }) => { 
  const [hoveredKey, setHoveredKey] = React.useState(null); 

  const buttonConfig = [
    { key: 'agregar', icon: cilPlus, title: 'Agregar' },
    { key: 'editar', icon: cilPencil, title: 'Editar' },
    { key: 'actualizar', icon: cilActionUndo, title: 'Actualizar' },
    { key: 'imprimir', icon: cilPrint, title: 'Imprimir' },
    { key: 'descargar', icon: cilDataTransferDown, title: 'Descargar' },
    { key: 'compartir', icon: cilShare, title: 'Compartir' },
    { key: 'filtrar', icon: cilFilter, title: 'Filtrar' },
  ];

  const renderButton = ({ key, icon, title }) => ( 
    botones[key] && (
      <CButton 
        key={key} 
        color="dark" 
        className={`me-2 fs-5`} // Clase sin hover
        title={title} 
        style={{ 
          transition: 'background-color 0.3s, color 0.3s', 
          transform: hoveredKey === key ? 'translateY(-2px)' : 'translateY(0)', 
          backgroundColor: hoveredKey === key ? '#35b7d4' : undefined, 
          color: hoveredKey === key ? '#30394e' : undefined,
          width:'40px',
          height: '40px', 
          margin:'2px'
        }}
        onMouseEnter={() => setHoveredKey(key)} 
        onMouseLeave={() => setHoveredKey(null)} 
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
    <div style={{ marginBottom: '7px', backgroundColor: '#30394e', padding: '3px', borderRadius: '6px', boxShadow: 'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px' }}>
      {buttonConfig.map(renderButton)} 
    </div>
  );
};

export default BarraAcciones;