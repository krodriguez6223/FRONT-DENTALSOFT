import React, { useState } from 'react';
import '../scss/style.scss'; 
import { CCard, CCardBody, CCardHeader, CCol } from '@coreui/react-pro';
import { cilSave, cilTrash, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
const DynamicTable = ({ columns, initialData, onSave }) => {
const [data, setData] = useState(initialData);
const [selectedRows, setSelectedRows] = useState([]); // Almacena las filas seleccionadas

  // Maneja el cambio en los valores de las celdas
  const handleInputChange = (rowIndex, columnKey, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnKey] = value;
    setData(updatedData);
  };

  // Agregar una nueva fila vacía
  const handleAddRow = () => {
    const newRow = columns.reduce((acc, column) => {
      acc[column.key] = '';
      return acc;
    }, {});
    setData([...data, newRow]);
  };

  // Maneja la selección de filas
  const handleRowSelect = (rowIndex) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter((index) => index !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  // Eliminar las filas seleccionadas
  const handleDeleteSelectedRows = () => {
    const updatedData = data.filter((_, index) => !selectedRows.includes(index));
    setData(updatedData);
    setSelectedRows([]); // Reinicia la selección
  };

  // Guardar los datos
  const handleSave = () => {
    if (onSave) {
      onSave(data);
    } else {
      console.log('Data saved:', data);
    }
  };

  return (
   
     <CCard className='dynamic-table-card table-responsive'>
        <div className="dynamic-table-container">
        <div className="dynamic-table-actions">
            <a className='btn' onClick={handleAddRow}>
               <CIcon icon={cilPlus} className='btn-hover'/>
            </a>
           
            <a className='btn' onClick={handleDeleteSelectedRows}
                disabled={selectedRows.length === 0}
            >
                 <CIcon icon={cilTrash} className='btn-hover'/>
            </a>
            <a className='btn' onClick={handleSave}>
            <CIcon icon={cilSave} className='btn-hover'/>
            </a>
        </div>
        <div className="table-responsive">
            <table className="dynamic-table">
                <thead>
                <tr>
                    <th>-</th>
                    {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr
                    key={rowIndex}
                    className={selectedRows.includes(rowIndex) ? 'selected-row' : ''}
                    >
                    <td>
                        <input
                        type="checkbox"
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => handleRowSelect(rowIndex)}
                        />
                    </td>
                    {columns.map((column) => (
                        <td key={column.key}>
                        <input
                            type="text"
                            value={row[column.key] || ''}
                            onChange={(e) =>
                            handleInputChange(rowIndex, column.key, e.target.value)
                            }
                            className="dynamic-table-input"
                        />
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
                <tfoot className='text-muted'>
                    <tr>
                        <td  
                            className='text-start footer-table' 
                            colSpan={columns.length + 1} 
                            style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                textAlign: 'left',
                                padding: '5px',
                                backgroundColor: '#e5ce90',
                                color: '#525050'
                            }}
                        >
                            # Filas: {data.length}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
        </div>
        </CCard>
  );
};

export default DynamicTable;
