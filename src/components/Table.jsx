import React, { useState, useEffect, useRef } from 'react';
import ModalView from '../components/ModalView';
import Submodulos from '../views/administracion/Submodulos';

const Table = ({ data, columnas, dataRenderer, onRowSelect, totalRegistros }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [hoveredRowKey, setHoveredRowKey] = useState(null);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const tableRef = useRef(null);

  const handleDoubleClick = (row) => {
    setSelectedData(row);
    setModalVisible(true);
  };

  const handleRowClick = (key) => {
    setSelectedRowKey(key);
    if (onRowSelect) onRowSelect(key);
  };

  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setSelectedRowKey(null); // Despinta la fila seleccionada
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <div
      ref={tableRef}
      style={{ maxHeight: '500px', overflow: 'auto', position: 'relative' }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {data.length > 0 && (
          <thead>
            <tr>
              {columnas.map((col) => (
                <th
                  key={col.key}
                  onClick={() => sortData(col.key)}
                  style={{
                    position: 'sticky',
                    top: 0,
                    background: '#0381a1',
                    color: '#c1d8da',
                    fontWeight: '400',
                    padding: '3px',
                    paddingLeft: columnas[0].key === col.key ? '15px' : '3px',
                    whiteSpace: 'nowrap',
                    fontSize: '17px',
                    textAlign: 'left',
                    zIndex: 10,
                    borderBottom: '2px solid #ddd',
                    cursor: 'pointer',
                  }}
                >
                  {col.label}
                  {sortConfig.key === col.key && (
                    <span style={{ marginLeft: '5px' }}>
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {getSortedData().length > 0 ? (
            getSortedData().map((row) => (
              <tr
                key={row.key}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedRowKey === row.key   ? 'rrgb(3 129 161 / 69%)' : hoveredRowKey === row.key ? '#dbdfe6' : '#f8f9fa',
                  color: hoveredRowKey === row.key ? '#323a49' : undefined,
                }}
                onMouseEnter={() => setHoveredRowKey(row.key)}
                onMouseLeave={() => setHoveredRowKey(null)}
                onDoubleClick={() => handleDoubleClick(row)}
                onClick={() => handleRowClick(row.key)}
              >
                {columnas.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      borderBottom: '1px solid #ddd',
                      textAlign: 'left',
                      color: '#6b7785',
                    }}
                  >
                    {col.badge ? (
                      <span
                        style={{
                          padding: '1px 8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: row[col.key] ? '#216e4e' : '#ca2800',
                          backgroundColor: row[col.key] ? '#baf3db' : '#ffd5d2',
                        }}
                      >
                        {row[col.key] ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columnas.length}
                style={{ textAlign: 'center', padding: '20px' }}
              >
                <div>
                  <img
                    src="src/assets/images/notFound.svg"
                    alt="Sin datos"
                    style={{ width: '400px', marginBottom: '10px' }}
                  />
                  <p style={{ fontSize: '16px', color: '#6b7785' }}>
                    No existen registros
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={columnas.length}
              style={{
                position: 'sticky',
                bottom: 0,
                background: '#e5ce90',
                padding: '3px',
                color: '#6b7785',
                fontWeight: '500',
                textAlign: 'right',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
              }}
            >
           <span style={{ marginRight: '20px', color: '#323a49', fontSize: '15px', fontWeight: 'bold' }}>Total de registros: {totalRegistros || data.length}</span> 

            </td>
          </tr>
        </tfoot>
      </table>

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
