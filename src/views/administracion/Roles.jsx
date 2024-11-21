import React, { useState, useEffect } from 'react';
import BarraAcciones from '../../components/BarraAcciones';
import PaginationAndSearch from '../../components/PaginationAndSearch';
import { CCard, CCardBody, CCardHeader, CCol } from '@coreui/react-pro';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Notificaciones, { mostrarNotificacion } from '../../components/Notification';
import axios from '../../conf/axiosConf';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';

const Roles = () => {
  const initialFormData = () => ({
    nombre: '',
    estado: true, 

  });

  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rolesPorPagina, setRolesPorPagina] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRold, setSelectedRolId] = useState(null);
  const [isEdit, setIsEdit] = useState(false); 
  const [formData, setFormData] = useState(initialFormData());

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/roles/rol`); 
      setRoles(data);
    } catch (error) {
      const  message = error.response.data.message 
      mostrarNotificacion('Error al cargar roles: ' + message, 'error'); 
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const filteredRoles = roles.filter(rol => {
    const nombre = `${rol.nombre || ''}`.toLowerCase();
    return nombre.includes(searchTerm.toLowerCase()) || 
           (rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const paginatedRoles = filteredRoles.slice(
    currentPage * rolesPorPagina,
    (currentPage + 1) * rolesPorPagina
  );

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEdit(false); 
  };
  const handleSubmit = async (nuevoRol) => {
    const rolCompleto = { ...formData, ...nuevoRol }; 
    setIsLoading(true); 
    try {
      let response;

      if (isEdit) {

        // Actualizar rol existente
        response = await axios.put(`/roles/rol/${formData.id_rol}`, rolCompleto);
        if (response.status === 200) {
          setRoles(prevRoles => 
            prevRoles.map(rol => 
              rol.id_rol=== formData.id_rol ? response.data : rol
            )
          );
          mostrarNotificacion(response.data.message, 'success');
        } else {
          mostrarNotificacion('Error al actualizar rol: ' + (response.data.error || response.statusText), 'error');
        }
      } else {
        const existingRol = roles.find(rol => rol.nombre === nuevoRol.nombre);
        if (existingRol) {
          mostrarNotificacion('El nombre de rol ya está en uso.', 'error');
          return; 
        }
        
        // Agregar nuevo rol
        response = await axios.post(`/roles/rol`, rolCompleto);
        if (response.status === 201) {
          setRoles(prevRoles => [...prevRoles, response.data]);
          mostrarNotificacion(response.data.message, 'success');
        } else {
          mostrarNotificacion('Error al agregar rol: ' + (response.data.error || response.statusText), 'error');
        }
      }
      handleCloseModal();
      fetchRoles();
    } catch (error) {
      mostrarNotificacion('Error al procesar la solicitud: ' + (error.response ? error.response.data.error : error.message), 'error');
    } finally {
      setIsLoading(false); 
    }
  };

  const handleAgregarClick = () => {
    setFormData(initialFormData());
    setModalVisible(true);
  };
  const handleActualizarDatos = async () => {
    setIsLoading(true); 
    await fetchRoles(); 
    setIsLoading(false); 
  };

  const handleRolSelect = (rol) => {
    const { 
        nombre, 
        estado, 
        id_rol,
    } = rol;

    setFormData({ 
      nombre,
      estado,
      id_rol
    });
    setSelectedRolId(id_rol); 
    setModalVisible(true); 
    setIsEdit(true);
  }

  //mostra infromacion del rol en el modal
  const dataRenderer = (data) => {
    if (!data) {
      return <p>Cargando...</p>; 
    }
  
    const {
      id_rol,
      nombre
    } = data;
  
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Código</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{id_rol? id_rol : ''}</td>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nombre rol</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{nombre ? nombre :''}</td>
          </tr>
        </tbody>
      </table>
    );
  };
  

  return (
    <CCol xs={12}>
      <BarraAcciones 
        botones={{ agregar: true, editar: false, actualizar: true, imprimir: false, descargar: false, compartir: false, filtrar: false }} 
        onAgregarClick={handleAgregarClick} 
        onActualizarClick={handleActualizarDatos} 

      />
      <CCard className='mb-3'>
        <CCardHeader className='pt-0 pb-0' style={{boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'} }>
          <PaginationAndSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            rolesPorPagina={rolesPorPagina}
            setRolesPorPagina={setRolesPorPagina}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRoles={filteredRoles.length}
          />
        </CCardHeader>
      </CCard>
      <Modal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        col="col-md-6"
        tamaño="lg"
        titulo={formData.id_rol ? "Editar Rol" : "Nuevo Rol"} 
       campos={[
          { name: 'nombre', placeholder: 'Nombre de rol', type: 'text', key: 'nombre', required: true, pattern: /^[a-zA-Z0-9]+$/ }, 
          { name: 'estado', placeholder: 'Estado', type: 'select', key: 'estado', options: [
              { value: true, label: 'Activo' },
              { value: false, label: 'Inactivo' }
            ], required: true 
          }
        ]}
       formData={formData}
       isEdit={isEdit}
      />
      <CCard className="mb-4" style={{boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'} }>
        <CCardBody>
          <small style={{ fontSize: '20px', padding: '8px', background: 'red', borderRadius: '10px', marginBottom:'15px' }}>Lista de Roles</small>
          <Table 
            data={paginatedRoles.map(rol => ({
              ...rol,
              key: rol.id_rol,
              actions: (
                <button
                   onMouseEnter={() => setSelectedRolId(rol.id_rol)} 
                   onMouseLeave={() => setSelectedRolId(null)} 
                   className='btn ' 
                   onClick={() => handleRolSelect(rol)}>
                   <CIcon 
                    icon={cilPencil} 
                    style={{ 
                      color: selectedRold === rol.id_rol ? 'white' : 'black', 
                      transform: selectedRold === rol.id_rol ? 'scale(1.3)' : 'scale(1)', 
                      transition: 'transform 0.2s ease',                                        
                    }} 
                    /> 
                </button> 
              )
              
            }))} 
            columnas={[
              { key: 'actions', label: 'Acciones' },
              { key: 'id_rol', label: 'Codigo' },
              { key: 'nombre', label: 'Nombre de rol' },
              { key: 'estado', label: 'Estado', badge: true } 
            ]} 
            dataRenderer={dataRenderer}
          />
        </CCardBody>
      </CCard>
      <Notificaciones />
    </CCol>
  );
}

export default Roles;