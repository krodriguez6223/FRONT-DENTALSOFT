import React, { useState } from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CBadge, CFooter } from '@coreui/react-pro';
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
      <CTable
        responsive style={{ overflow: 'hidden' }}>
        <CTableHead>
          <CTableRow>
            {columnas.map(col => (
              <CTableHeaderCell
                key={col.key}
                style={{
                  position: 'sticky',
                  top: 0,
                  background: '#0381a1',
                  zIndex: 1,
                  color: '#c1d8da',
                  fontWeight: '400',
                  paddingRight: '10px',
                  paddingLeft: '10px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  width: '100px',
                  whiteSpace: 'nowrap',
                  //border: 'solid 1px #aab3c5',
                  fontSize: '17px'
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
        <CTable
        >
          <CTableBody bo>
            {data.length > 0 ? (
              data.map(row => {
                return (
                  <CTableRow
                    key={row.key}
                    style={{
                      cursor: 'pointer',
                      transform: hoveredRowKey === row.key ? 'translateY(-2px)' : 'translateY(0)',
                      backgroundColor: hoveredRowKey === row.key ? '#dbdfe6' : undefined,
                      color: hoveredRowKey === row.key ? '#323a49' : undefined,
                    }}
                    onMouseEnter={() => setHoveredRowKey(row.key)}
                    onMouseLeave={() => setHoveredRowKey(null)}
                    onDoubleClick={() => handleDoubleClick(row)}
                  >
                    {columnas.map(col => {
                      return (
                        <CTableDataCell
                          key={col.key}
                          style={{ padding: '0.1px', width: '100px', color: '#6b7785' }}
                        >
                          {col.badge ? (<CBadge
                            style={{ color: '#fff', fontWeight: '300' }}
                            color={row[col.key] ? 'success' : 'danger'}>
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
                <CTableDataCell colSpan={columnas.length} >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                      src="src/assets/images/notFound.svg"
                      alt="Sin datos"
                      style={{  width: '300px', height: '300px', marginBottom: '-40px'}}
                    />
                    <span style={{
                    //  background: '#FBD7A4',
                    //  color: '#D68B0D',
                      textAlign: 'center',
                      padding: '10px 85px',
                      fontSize:'22px'
                      //borderRadius: '15px',
                    }}>

                      No existen registros
                    </span>
                  </div>
                </CTableDataCell>
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
