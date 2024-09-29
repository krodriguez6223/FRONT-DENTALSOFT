import React, { useState, useEffect } from 'react';
import BarraAcciones from '../../components/BarraAcciones';
import PaginationAndSearch from '../../components/PaginationAndSearch';
import { CCard, CCardBody, CCardHeader, CCol } from '@coreui/react-pro';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import axios from 'axios';
import Notificaciones, { mostrarNotificacion } from '../../components/Notification';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchUsuarios = async () => {
    const API = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`${API}/users`, {
        method: 'GET',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        mostrarNotificacion('Error al obtener usuarios: ' + (errorData.error || response.statusText), 'error');
        return;
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      mostrarNotificacion('Error al cargar usuarios: ' + error.message, 'error'); // Mejora en la notificación de error
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filter users based on the search term
  const filteredUsuarios = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.nombre_usuario || ''}${usuario.nombre_persona || ''} ${usuario.nombre_usuario || ''} ${usuario.apellido_persona || ''} ${usuario.cedula_persona || ''}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase()) || 
           (usuario.cedula_persona && usuario.cedula_persona.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Handle modal close
  const handleCloseModal = () => setModalVisible(false);

  // Handle user submission
  const handleSubmit = async (nuevoUsuario) => {
    const API = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
    try {
      const response = await axios.post(`${API}/users`, nuevoUsuario, { 
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status !== 201) {
        mostrarNotificacion('Error al agregar usuario: ' + (response.data.error || response.statusText), 'error');
      }

      setUsuarios(prevUsuarios => [...prevUsuarios, response.data]);
      setCurrentPage(0); 
      handleCloseModal();
      fetchUsuarios();
      mostrarNotificacion('Usuario agregado exitosamente', 'success');
      setModalVisible(false);
    } catch (error) {
      mostrarNotificacion('Error al agregar usuario: ' + (error.response ? error.response.data.error : error.message), 'error');
    }
  };

  // Paginate users
  const paginatedUsuarios = filteredUsuarios.slice(
    currentPage * usuariosPorPagina,
    (currentPage + 1) * usuariosPorPagina
  );

  // Handle modal open
  const handleAgregarClick = () => setModalVisible(true);

  return (
    <CCol xs={12}>
      <BarraAcciones 
        botones={{ agregar: true, editar: true, actualizar: true, imprimir: true, descargar: true, compartir: true, filtrar: true }} 
        onAgregarClick={handleAgregarClick} 
      />
      <CCard className='mb-3'>
        <CCardHeader className='pt-0 pb-0'>
          <PaginationAndSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            usuariosPorPagina={usuariosPorPagina}
            setUsuariosPorPagina={setUsuariosPorPagina}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalUsuarios={filteredUsuarios.length}
          />
        </CCardHeader>
      </CCard>
      <Modal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        titulo="Agregar Nuevo Usuario"
        campos={[
          { name: 'nombre_usuario', placeholder: 'Nombre de usuario', type: 'text', key: 'nombre_usuario' },
          { name: 'contrasenia', placeholder: 'Contraseña', type: 'password', key: 'contrasenia' },
          { name: 'estado', placeholder: 'Estado', type: 'select', key: 'estado', options: [
              { value: 'true', label: 'Activo' },
              { value: 'false', label: 'Inactivo' }
            ] 
          },
          { name: 'nombre', placeholder: 'Nombre', type: 'text', key: 'nombre' },
          { name: 'apellido', placeholder: 'Apellido', type: 'text', key: 'apellido' },
          { name: 'direccion', placeholder: 'Dirección', type: 'text', key: 'direccion' },
          { name: 'telefono', placeholder: 'Teléfono', type: 'text', key: 'telefono' },
          { name: 'cedula', placeholder: 'Cédula', type: 'text', key: 'cedula' },
          { name: 'rol', placeholder: 'Rol', type: 'select', key: 'rol', options: [
              { value: '5', label: 'Administrador' },
              { value: '7', label: 'Usuario' }
            ] 
          }
        ]}
      />
      <CCard className="mb-4">
        <CCardBody>
          <small style={{ fontSize: '16px' }}>Lista de Usuarios</small>
          <Table 
            data={paginatedUsuarios.map(usuario => ({
              ...usuario,
              key: usuario.id_usuario // Asegúrate que 'id_usuario' es único
            }))} 
            columnas={[
              { key: 'id_usuario', label: 'ID' },
              { key: 'nombre_usuario', label: 'Nombre de usuario' },
              { key: 'nombre_persona', label: 'Nombres y apellidos' },
              { key: 'cedula_persona', label: 'Cédula' },
              { key: 'telefono_persona', label: 'Teléfono' },
              { key: 'rol', label: 'Rol' },
              { key: 'estado', label: 'Estado', badge: true } 
            ]} 
          />
        </CCardBody>
      </CCard>
      <Notificaciones />
    </CCol>
  );
}

export default Usuarios;
