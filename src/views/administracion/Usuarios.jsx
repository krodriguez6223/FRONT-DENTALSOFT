import React, { useState, useEffect } from 'react';
import BarraAcciones from '../../components/BarraAcciones';
import PaginationAndSearch from '../../components/PaginationAndSearch';
import { CCard, CCardBody, CCardHeader, CCol, CBadge } from '@coreui/react-pro';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import axios from 'axios'; // {{ edit_1 }}

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
        console.error('Error en la respuesta:', errorData); 
        throw new Error('Error al obtener usuarios: ' + (errorData.error || response.statusText));
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar usuarios antes de la paginación
  const filteredUsuarios = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.nombre_persona || ''} ${usuario.nombre_usuario || ''} ${usuario.apellido_persona || ''} ${usuario.cedula_persona || ''}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase()) || 
           (usuario.cedula_persona && usuario.cedula_persona.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleCloseModal = () => setModalVisible(false);

  const handleSubmit = async (nuevoUsuario) => {
    console.log(nuevoUsuario);
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
        },
      });
      // Verificar que la respuesta sea correcta
      // {{ edit_1 }}
      if (response.status !== 201) { // Cambiado de response.ok a response.status
        console.error('Error en la respuesta:', response.data); // Mostrar el error
        throw new Error('Error al agregar usuario: ' + (response.data.error || response.statusText));
      }
      console.log(response.data)
      setUsuarios(prevUsuarios => [...prevUsuarios, response.data]);
      setCurrentPage(0); 
      handleCloseModal();
      fetchUsuarios();
    } catch (error) {
      console.error('Error al enviar el usuario:', error.response ? error.response.data : error.message);
    }
  };
  

  // Paginación de usuarios filtrados
  const paginatedUsuarios = filteredUsuarios.slice(
    currentPage * usuariosPorPagina,
    (currentPage + 1) * usuariosPorPagina
  );


  const handleAgregarClick = () => setModalVisible(true);

  return (
    <CCol xs={12}>
      <BarraAcciones botones={{ agregar: true, editar: true, actualizar: true, imprimir: true, descargar: true, compartir: true, filtrar: true }} onAgregarClick={handleAgregarClick} />

      <Modal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        titulo="Agregar Nuevo Usuario"
        campos={[
          { name: 'nombre_usuario', placeholder: 'Nombre de usuario', type: 'text', key: 'nombre_usuario' }, // {{ edit_1 }}
          { name: 'contrasenia', placeholder: 'Contraseña', type: 'password', key: 'contrasenia' }, // {{ edit_2 }}
          { name: 'estado', placeholder: 'Estado', type: 'select', options: [ // {{ edit_3 }}
              { value: 'true', label: 'Activo', key: 'estado_activo' },
              { value: 'false', label: 'Inactivo', key: 'estado_inactivo' }
            ] 
          },
          { name: 'nombre', placeholder: 'Nombre', type: 'text', key: 'nombre' }, // {{ edit_4 }}
          { name: 'apellido', placeholder: 'Apellido', type: 'text', key: 'apellido' }, // {{ edit_5 }}
          { name: 'direccion', placeholder: 'Dirección', type: 'text', key: 'direccion' }, // {{ edit_6 }}
          { name: 'telefono', placeholder: 'Teléfono', type: 'text', key: 'telefono' }, // {{ edit_7 }}
          { name: 'cedula', placeholder: 'Cédula', type: 'text', key: 'cedula' }, // {{ edit_8 }}
          { name: 'rol', placeholder: 'Rol', type: 'select', options: [ // {{ edit_9 }}
              { value: '5', label: 'Administrador', key: 'rol_admin' },
              { value: '7', label: 'Usuario', key: 'rol_usuario' }
            ] 
          }
        ]}
      />

      <CCard className='mb-3' style={{ boxShadow: 'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px' }}>
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

      <CCard className="mb-4" style={{ boxShadow: 'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px' }}>
        <CCardBody>
          <small style={{ fontSize: '16px' }}>Lista de Usuarios</small>
          <Table 
            data={paginatedUsuarios.map(usuario => ({
              ...usuario,
              key: usuario.id_usuario // Asegúrate de que 'id_usuario' sea único
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
    </CCol>
  );
}

export default Usuarios;
