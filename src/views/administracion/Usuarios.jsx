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

const Usuarios = () => {
  const initialFormData = () => ({
    nombre_usuario: '',
    contrasenia: '',
    estado: true, 
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    cedula: '',
    id_rol: 5
  });

  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEdit, setIsEdit] = useState(false); 
  const [formData, setFormData] = useState(initialFormData());

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/users/usr`); 
      setUsuarios(data);
    } catch (error) {
      const  message = error.response.data.message 
      mostrarNotificacion('Error al cargar usuarios: ' + message, 'error'); 
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const filteredUsuarios = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.nombre_usuario || ''} ${usuario.nombre_persona || ''} ${usuario.apellido_persona || ''} ${usuario.cedula_persona || ''}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase()) || 
           (usuario.cedula_persona && usuario.cedula_persona.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const paginatedUsuarios = filteredUsuarios.slice(
    currentPage * usuariosPorPagina,
    (currentPage + 1) * usuariosPorPagina
  );

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEdit(false); 
  };
  const handleSubmit = async (nuevoUsuario) => {
    const usuarioCompleto = { ...formData, ...nuevoUsuario }; 
    setIsLoading(true); 
    try {
      let response;

      if (isEdit) {
        if (!nuevoUsuario.contrasenia) {
          usuarioCompleto.contrasenia = formData.contrasenia; 
        }
        // Actualizar usuario existente
        response = await axios.put(`/users/usr/${formData.id_usuario}`, usuarioCompleto);
        if (response.status === 200) {
          setUsuarios(prevUsuarios => 
            prevUsuarios.map(usuario => 
              usuario.id_usuario === formData.id_usuario ? response.data : usuario
            )
          );
          mostrarNotificacion(response.data.message, 'success');
        } else {
          mostrarNotificacion('Error al actualizar usuario: ' + (response.data.error || response.statusText), 'error');
        }
      } else {
        const existingUser = usuarios.find(usuario => usuario.nombre_usuario === nuevoUsuario.nombre_usuario);
        if (existingUser) {
          mostrarNotificacion('El nombre de usuario ya está en uso.', 'error');
          return; 
        }
        
        // Agregar nuevo usuario
        response = await axios.post(`/users/usr/`, usuarioCompleto);
        if (response.status === 201) {
          setUsuarios(prevUsuarios => [...prevUsuarios, response.data]);
          mostrarNotificacion(response.data.message, 'success');
        } else {
          mostrarNotificacion('Error al agregar usuario: ' + (response.data.error || response.statusText), 'error');
        }
      }
      handleCloseModal();
      fetchUsuarios();
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
    await fetchUsuarios(); 
    setIsLoading(false); 
  };

  const handleUserSelect = (usuario) => {
    const { 
        nombre_usuario, 
        estado, 
        nombre_persona, 
        apellido_persona, 
        direccion_persona, 
        telefono_persona, 
        cedula_persona, 
        rol_id, 
        id_usuario 
    } = usuario;

    setFormData({ 
      nombre_usuario,
      contrasenia: '', 
      estado:estado,
      nombre: nombre_persona,
      apellido: apellido_persona,
      direccion: direccion_persona,
      telefono: telefono_persona,
      cedula: cedula_persona,
      id_rol: rol_id,
      id_usuario
    });
    setSelectedUserId(id_usuario); 
    setModalVisible(true); 
    setIsEdit(true);
  }

  //mostra infromacion del usuario en el modal
  const dataRenderer = (data) => {
    if (!data) {
      return <p>Cargando...</p>; 
    }
  
    const {
      id_usuario,
      nombre_persona,
      fecha_registro,
      telefono_persona,
      direccion_persona,
      apellido_persona,
      estado,
      cedula,
      rol
    } = data;
  
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Código</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{id_usuario ? id_usuario : ''}</td>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nombres</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{nombre_persona ? nombre_persona :''}</td>
          </tr>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Cedula</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{cedula ?  cedula : ''}</td>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Apellidos</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{apellido_persona ? apellido_persona : ''}</td>
          </tr>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Dirección</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{direccion_persona ?  direccion_persona : ''}</td>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Estado</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd'}}>{estado ? 'Activo' : 'Inactivo'}</td> 
          </tr>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Fecha registro</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{fecha_registro ? new Date(fecha_registro).toLocaleDateString('es-ES') : ''}</td>
            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Rol</th>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd'}}>{rol ? rol : ''}</td> 
          </tr>
          <tr>
          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Teléfono</th>
          <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{telefono_persona ?  telefono_persona : ''}</td>

          </tr>
        </tbody>
      </table>
    );
  };
  
  return (
    <CCol xs={12}>
      <BarraAcciones 
        botones={{ agregar: true, editar: false, actualizar: true, imprimir: true, descargar: true, compartir: true, filtrar: true }} 
        onAgregarClick={handleAgregarClick} 
        onActualizarClick={handleActualizarDatos} 

      />
      <CCard className='mb-3'>
        <CCardHeader className='pt-0 pb-0' style={{boxShadow: '0 0 10px 0 rgba(0, 0, 0, .5)'} }>
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
        col="col-md-6"
        tamaño="lg"
        titulo={formData.id_usuario ? "Editar Usuario" : "Nuevo Usuario"} 
       campos={[
          { name: 'nombre_usuario', placeholder: 'Nombre de usuario', type: 'text', key: 'nombre_usuario', required: true, pattern: /^[a-zA-Z0-9]+$/ }, 
          { name: 'contrasenia', placeholder: 'Contraseña', type: 'password', key: 'contrasenia', required: true }, 
          { name: 'estado', placeholder: 'Estado', type: 'select', key: 'estado', options: [
              { value: true, label: 'Activo' },
              { value: false, label: 'Inactivo' }
            ], required: true 
          },
          { name: 'nombre', placeholder: 'Nombres', type: 'text', key: 'nombre', required: true, pattern: /^[a-zA-Z\s]+$/ },
          { name: 'apellido', placeholder: 'Apellidos', type: 'text', key: 'apellido', required: true, pattern: /^[a-zA-Z\s]+$/ }, 
          { name: 'direccion', placeholder: 'Dirección', type: 'text', key: 'direccion', required: true, pattern: /^[a-zA-Z\s]+$/ },
          { name: 'telefono', placeholder: 'Teléfono', type: 'text', key: 'telefono', required: false, pattern: /^[0-9]*$/ }, 
          { name: 'cedula', placeholder: 'Cédula', type: 'text', key: 'cedula', required: true, pattern: /^[0-9]*$/ }, 
          { name: 'id_rol', placeholder: 'Rol', type: 'select', key: 'roleId', options: [
              { value: 5 , label: 'Administrador' },
              { value: 6 , label: 'empleado' }
            ], required: true 
          }
        ]}
       formData={formData}
       isEdit={isEdit}
      />
      <CCard className="mb-4" style={{boxShadow: '0 0 10px 0 rgba(0, 0, 0, .5)'} }>
        <CCardBody>
          <small style={{ fontSize: '16px' }}>Lista de Usuarios</small>
          <Table 
            data={paginatedUsuarios.map(usuario => ({
              ...usuario,
              key: usuario.id_usuario,
              actions: (
                <button
                   onMouseEnter={() => setSelectedUserId(usuario.id_usuario)} 
                   onMouseLeave={() => setSelectedUserId(null)} 
                   className='btn ' 
                   onClick={() => handleUserSelect(usuario)}>
                   <CIcon 
                    icon={cilPencil} 
                    style={{ 
                      color: selectedUserId === usuario.id_usuario ? 'white' : 'black', 
                      transform: selectedUserId === usuario.id_usuario ? 'scale(1.3)' : 'scale(1)', 
                      transition: 'transform 0.2s ease',                                        
                    }} 
                    /> 
                </button> 
              )
              
            }))} 
            columnas={[
              { key: 'actions', label: 'Acciones' },
              { key: 'id_usuario', label: 'Codigo' },
              { key: 'nombre_usuario', label: 'Nombre de usuario' },
              { key: 'nombre_persona', label: 'Nombres y apellidos' },
              { key: 'cedula_persona', label: 'Cédula' },
              { key: 'telefono_persona', label: 'Teléfono' },
              { key: 'rol', label: 'Rol' },
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

export default Usuarios;