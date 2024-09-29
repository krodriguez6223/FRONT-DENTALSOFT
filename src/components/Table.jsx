import React from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CBadge } from '@coreui/react-pro';

const Table = ({ data, columnas }) => {
  return (
    <div style={{ maxHeight: '600px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px' }}>
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

      <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'auto' }}>
        <CTable>
          <CTableBody>
            {data.length > 0 ? (
              data.map(row => {
                return (
                  <CTableRow
                    key={row.key} // Asegúrate de que 'id_usuario' es único
                    style={{ cursor: 'pointer' }}
                  >
                    {columnas.map(col => {
                      return (
                        <CTableDataCell
                          key={col.key} // Asignar clave única a cada celda
                          style={{ padding: '1px', width: '100px' }}
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
    </div>
  );
};

export default Table;
