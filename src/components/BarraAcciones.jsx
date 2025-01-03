import React from 'react';
import { CButton } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilSync, cilFilter, cilDataTransferDown, cilPlus, cilPencil, cilPrint, cilShare } from '@coreui/icons'; 

const BarraAcciones = ({ botones, onAgregarClick, onEditarClick, onActualizarClick, onImprimirClick, onDescargarClick, onCompartirClick, onFiltrarClick }) => { 
  const [hoveredKey, setHoveredKey] = React.useState(null); 

  const buttonConfig = [
    { key: 'agregar', icon: cilPlus, title: 'Agregar' },
    { key: 'editar', icon: cilPencil, title: 'Editar' },
    { key: 'actualizar', icon: cilSync, title: 'Actualizar' },
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
          color: hoveredKey === key ? '#fbba06' : undefined,
          width:'40px',
          height: '40px', 
          margin:'2px',
          background:'#0381a1',
          borderColor:'#0381a1',
          
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
        <CIcon
         size= 'lg' 
         icon={icon} /> 
      </CButton>
    )
  );

  return (
    <div style={{ marginBottom: '7px', backgroundColor: '#0381a1', padding: '1px', borderRadius: '6px' }}>
      {buttonConfig.map(renderButton)} 
    </div>
  );
};

export default BarraAcciones;