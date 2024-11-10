import React, { useState } from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CBadge } from '@coreui/react-pro';
import ModalView from '../components/ModalView'
const Table = ({ data, columnas, dataRenderer }) => {
  const [hoveredRowKey, setHoveredRowKey] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleDoubleClick = (row) => {
    setSelectedData(row);
    setModalVisible(true);
  };
  
  return (
    <div>
      <CTable responsive style={{ overflow: 'hidden' }}>
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
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  width: '100px',
                  whiteSpace: 'nowrap',
                }}
                className={'TableHeaderCell'}
              >
                {col.label}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
      </CTable>

      <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'auto' }}>
        <CTable>
          <CTableBody>
            {data.length > 0 ? (
              data.map(row => {
                return (
                  <CTableRow
                    key={row.key} 
                    style={{
                      cursor: 'pointer',
                      transform: hoveredRowKey === row.key ? 'translateY(-2px)' : 'translateY(0)', 
                      backgroundColor: hoveredRowKey === row.key ? '#c1c1c1' : undefined, 
                      color: hoveredRowKey === row.key ? '#30394e' : undefined, 
                    }} 
                    onMouseEnter={() => setHoveredRowKey(row.key)} 
                    onMouseLeave={() => setHoveredRowKey(null)} 
                    onDoubleClick={() => handleDoubleClick(row)} // Agregar evento de doble clic
                  >
                    {columnas.map(col => {
                      return (
                        <CTableDataCell
                          key={col.key} 
                          style={{ padding: '0.1px', width: '100px' }}
                        >
                          {col.badge ? (
                            <CBadge color={row[col.key] ? 'success' : 'danger'}>
                              {row[col.key] ? 'Activo' : 'Inactivo'}
                            </CBadge>
                          ) : (
                            row[col.key]
                          )}
                        </CTableDataCell>
                      );
                    })}
                  </CTableRow>
                );
              })
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={columnas.length}>No hay datos disponibles</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
      <ModalView 
         visible={modalVisible} 
         onClose={() => setModalVisible(false)} 
         data={selectedData} 
         dataRenderer={dataRenderer}
      />
    </div>
  );
};

export default Table;
