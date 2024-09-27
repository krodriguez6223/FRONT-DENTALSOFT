import React, { useState } from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CBadge } from '@coreui/react-pro';

const Table = ({ data, columnas }) => {
  const [hoveredRow, setHoveredRow] = useState(null); // Estado para identificar la fila sobre la que se pasa el cursor

  const handleMouseEnter = (rowId) => {
    setHoveredRow(rowId); // Cambia el estado cuando se pasa el cursor por una fila
  };

  const handleMouseLeave = () => {
    setHoveredRow(null); // Restablece el estado cuando el cursor sale de la fila
  };

  return (
    <div style={{ maxHeight: '600px', overflow: 'hidden',boxShadow: 'rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px',   }}>
      <CTable responsive style={{ overflow: 'hidden' }}> 
        {/* Encabezado fijo */}
        <CTableHead>
          <CTableRow>
            {columnas.map(col => (
              <CTableHeaderCell
                key={col.key}
                style={{
                  position: 'sticky',
                  top: 0,
                  background: '#30394e',
                  zIndex: 1,
                  color: 'white',
                  borderTop: '5px solid #30394e',
                  paddingRight: '10px',
                  paddingLeft: '10px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  width: '100px', 
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
      </CTable>

      <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'auto' }}> {/* Agregado overflowX para scroll horizontal */}
        <CTable>
          <CTableBody>
            {data.length > 0 ? (
              data.map(item => (
                <CTableRow
                  key={item.id_usuario}
                  style={{
                    cursor: 'pointer',                     
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id_usuario)}
                  onMouseLeave={handleMouseLeave}
                >
                  {columnas.map((col, index) => (
                    <CTableDataCell
                      key={`${item.id_usuario}-${col.key}-${index}`}
                      style={{ padding: '1px', transition: 'background:red', width: '100px' }} // Alineación consistente
                    >
                      {col.badge ? (
                        <CBadge color={item[col.key] ? 'success' : 'danger'}>
                          {item[col.key] ? 'Activo' : 'Inactivo'}
                        </CBadge>
                      ) : (
                        item[col.key]
                      )}
                    </CTableDataCell>
                  ))}
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={columnas.length}>No hay datos disponibles</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </div>
  );
};

export default Table;
