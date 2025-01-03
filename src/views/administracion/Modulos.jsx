import React, { useState, useEffect } from 'react';
import BarraAcciones from '../../components/BarraAcciones';
import PaginationAndSearch from '../../components/PaginationAndSearch';
import { CCard, CCardBody, CCardHeader, CCol } from '@coreui/react-pro';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Notificaciones, { mostrarNotificacion } from '../../components/Notification';
import axios from '../../conf/axiosConf';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilList, cilTrash } from '@coreui/icons';

const Modulos = () => {
    
    const initialFormData = () => ({ nombre: '', estado: true, descripcion: '', ruta: '',  modulo_id: null });
    const [modulos, setModulos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [modulosPorPagina, setmodulosPorPagina] = useState(100);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selecttedModuloId, setSelectedModuloId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState(initialFormData());
    const [dataSubmodulos, setDataSubmodulos] = useState([]);
    const [modalSubmoduloVisible, setModalSubmoduloVisible] = useState(false);
    const [isEditSubmodulo, setIsEditSubmodulo] = useState(false);
    const [submoduloFormData, setSubmoduloFormData] = useState(initialFormData());
    const [searchTermSubmodulos, setSearchTermSubmodulos] = useState('');

    const fetchModulos = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`/modulos/mod`);
            setModulos(data);
        } catch (error) {
            const message = error.response.data.message
            mostrarNotificacion('Error al cargar modulos: ' + message, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchModulosbySubmodulo = async (id) => {
        setIsLoading(true);
        setDataSubmodulos([]);
        try {
            const { data } = await axios.get(`/modulos/mod/${id}`);
            setDataSubmodulos(data)
        } catch (error) {
            mostrarNotificacion('Error al cargar submodulos: ' + (error.response ? error.response.data.error : error.message), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchModulos();
        setCurrentPage(0);
    }, [searchTerm]);


    const filteredItems = (items, searchTerm) => {
        return items.filter(item => {
            const nombre = `${item.nombre || ''}`.toLowerCase();
            return nombre.includes(searchTerm.toLowerCase());
        });
    };

    const filteredModulos = filteredItems(modulos, searchTerm);
    const filteredSubmodulos = filteredItems(dataSubmodulos, searchTermSubmodulos);

    const paginateItems = (items) => {
        return items.slice(
            currentPage * modulosPorPagina,
            (currentPage + 1) * modulosPorPagina
        );
    };

    const paginatedModulos = paginateItems(filteredModulos);
    const paginatedSubmodulos = paginateItems(filteredSubmodulos);

    const handleCloseModal = () => {
        setModalVisible(false);
        setIsEdit(false);
    };
    //agregar modulo
    const handleSubmit = async (nuevoModulo) => {
        const moduloCompleto = { ...formData, ...nuevoModulo };
        setIsLoading(true);
        try {
            let response
            if (isEdit) {

                // Actualizar modulos existente
                response = await axios.put(`/modulos/mod/${formData.id}`, moduloCompleto);
                if (response.status === 200) {
                    setModulos(prevModulos =>
                        prevModulos.map(modulo =>
                            modulo.id === formData.id ? response.data : modulo
                        )
                    );
                    mostrarNotificacion(response.data.message, 'success');
                } else {
                    mostrarNotificacion('Error al actualizar modulo: ' + (response.data.error || response.statusText), 'error');
                }
            } else {
                const existingModulo = modulos.find(modulo => modulo.nombre === nuevoModulo.nombre);
                if (existingModulo) {
                    mostrarNotificacion('El nombre de modulo ya está en uso.', 'error');
                    return;
                }

                // Agregar nuevo modulos
                response = await axios.post(`/modulos/mod`, moduloCompleto);
                if (response.status === 201) {
                    setModulos(prevModulos => [...prevModulos, response.data]);
                    mostrarNotificacion(response.data.message, 'success');
                } else {
                    mostrarNotificacion('Error al agregar modulo: ' + (response.data.error || response.statusText), 'error');
                }
            }
            handleCloseModal();
            fetchModulos();
        } catch (error) {
            mostrarNotificacion('Error al procesar la solicitudc: ' + (error.response ? error.response.data.error : error.message), 'error');
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
        await fetchModulos();
        setIsLoading(false);
    };

    const handleRolSelect = (rol) => {
        const { nombre, descripcion, ruta, estado, id, } = rol;

        setFormData({ nombre, descripcion, ruta, estado, id, });
        setSelectedModuloId(id);
        setModalVisible(true);
        setIsEdit(true);
    }
    const handleViewSubmodules = (modulo) => {
        fetchModulosbySubmodulo(modulo.id); 
        setSelectedModuloId(modulo.id);
    };
//agregar submodulo
    const handleSubmitSubmodulo = async (nuevoSubmodulo) => {
        const submoduloCompleto = {
            ...submoduloFormData,
            ...nuevoSubmodulo,

        };
        setIsLoading(true);
        try {
            let response;

            if (isEditSubmodulo) {
                response = await axios.put(`/submodulos/sub/${submoduloFormData.id}`, submoduloCompleto);
                if (response.status === 200) {
                    setDataSubmodulos(prev => [...prev, response.data]);
                    mostrarNotificacion(response.data.message, 'success');
                    fetchModulosbySubmodulo(submoduloFormData.modulo_id);
                }
            } else {
                const existingSubmodulo = dataSubmodulos.find(
                    submod => submod.nombre === nuevoSubmodulo.nombre
                );
                if (existingSubmodulo) {
                    mostrarNotificacion('El nombre de submódulo ya está en uso.', 'error');
                    return;
                }
                response = await axios.post(`/submodulos/sub`, submoduloCompleto);
                if (response.status === 201) {
                    setDataSubmodulos(prev => [...prev, response.data]);
                    mostrarNotificacion(response.data.message, 'success');
                    fetchModulosbySubmodulo(submoduloFormData.modulo_id);
                }
            }
            handleCloseSubmoduloModal();

        } catch (error) {
            mostrarNotificacion('Error al procesar la solicitud: ' + (error.response ? error.response.data.error : error.message), 'error')
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSubmoduloModal = () => {
        setModalSubmoduloVisible(false);
        setIsEditSubmodulo(false);
    };

    const handleAgregarSubmodulo = () => {
        setModalSubmoduloVisible(true);
        setSelectedModuloId(null);
    };


    const handleEditSubmodulo = (submodulo) => {
        setSubmoduloFormData({
            nombre: submodulo.nombre,
            descripcion: submodulo.descripcion,
            ruta: submodulo.ruta,
            estado: submodulo.estado,
            id: submodulo.id,
            modulo_id: submodulo.modulo_id
        });
        setModalSubmoduloVisible(true);
        setIsEditSubmodulo(true);
    };


    return (
        <CCol xs={12}>

            <Modal
                visible={modalVisible}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                col="col-md-6"
                tamaño="lg"
                titulo={formData.id_rol ? "Editar Modulo" : "Nuevo Modulo"}
                campos={[
                    { name: 'nombre', placeholder: 'Nombre de modulo', type: 'text', key: 'nombre', required: true, pattern: /^[a-zA-Z0-9 ]+$/ },
                    { name: 'descripcion', placeholder: 'Descripción', type: 'text', key: 'descripcion', required: true, pattern: /^[a-zA-Z0-9 ]+$/ },
                    { name: 'ruta', placeholder: 'Ruta', type: 'text', key: 'ruta', required: true, pattern: /^[a-zA-Z0-9 /]+$/ },
                    {
                        name: 'estado', placeholder: 'Estado', type: 'select', key: 'estado', options: [
                            { value: true, label: 'Activo' },
                            { value: false, label: 'Inactivo' }
                        ], required: true
                    }
                ]}
                formData={formData}
                isEdit={isEdit}
            />
            <Modal
                visible={modalSubmoduloVisible}
                onClose={handleCloseSubmoduloModal}
                onSubmit={handleSubmitSubmodulo}
                col="col-md-6"
                tamaño="lg"
                titulo={isEditSubmodulo ? "Editar Submódulo" : "Nuevo Submódulo"}
                campos={[
                    { name: 'nombre', placeholder: 'Nombre de submódulo', type: 'text', key: 'nombre', required: true, pattern: /^[a-zA-Z0-9 ]+$/ },
                    { name: 'descripcion', placeholder: 'Descripción', type: 'text', key: 'descripcion', required: true, pattern: /^[a-zA-Z0-9 ]+$/ },
                    { name: 'ruta', placeholder: 'Ruta', type: 'text', key: 'ruta', required: true, pattern: /^[a-zA-Z0-9 /]+$/ },
                    {
                        name: 'modulo_id',
                        placeholder: 'Seleccionar Módulo',
                        type: 'select',
                        key: 'modulo_id',
                        options: modulos.map(modulo => ({ value: modulo.id, label: modulo.nombre })), // Opciones formateadas
                        required: true,
                    },

                    {
                        name: 'estado', placeholder: 'Estado', type: 'select', key: 'estado', options: [
                            { value: true, label: 'Activo' },
                            { value: false, label: 'Inactivo' }
                        ], required: true
                    }
                ]}
                formData={submoduloFormData}
                isEdit={isEditSubmodulo}
            />
            <div className='row'>
                <div className='col-lg-6 col-12'>
                    <BarraAcciones
                        botones={{ agregar: true, editar: false, actualizar: true, imprimir: false, descargar: false, compartir: false, filtrar: false }}
                        onAgregarClick={handleAgregarClick}
                        onActualizarClick={handleActualizarDatos}

                    />
                    <CCard className='mb-3'>
                        <CCardHeader className='pt-0 pb-0' style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                            <PaginationAndSearch
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                modulosPorPagina={modulosPorPagina}
                                setmodulosPorPagina={setmodulosPorPagina}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalRoles={filteredModulos.length}
                                display={true}
                            />
                        </CCardHeader>
                    </CCard>
                    <CCard className="mb-4" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                        <CCardBody>
                            <small style={{ fontSize: '16px' }}>Lista de Modulos</small>
                            <Table
                                data={paginatedModulos.map(modulo => ({
                                    ...modulo,
                                    key: modulo.id,
                                    actions: (
                                        <div>
                                            <button
                                                onMouseEnter={() => setSelectedModuloId(modulo.id)}
                                                onMouseLeave={() => setSelectedModuloId(null)}
                                                className='btn '
                                                onClick={() => handleRolSelect(modulo)}
                                            >
                                                <CIcon
                                                    icon={cilPencil}
                                                    className='btn-hover'
                                                />
                                            </button>
                                            <button
                                                onMouseEnter={() => setSelectedModuloId(modulo.id)}
                                                onMouseLeave={() => setSelectedModuloId(null)}
                                                className='btn btn-hover'
                                                onClick={() => handleViewSubmodules(modulo)}
                                            >
                                                <CIcon
                                                    icon={cilList}
                                                    className='btn-hover'
                                                />
                                            </button>
                                        </div>

                                    ),

                                }))}
                                columnas={[
                                    { key: 'actions', label: 'Acciones' },
                                    { key: 'id', label: 'Codigo' },
                                    { key: 'nombre', label: 'Modulos' },
                                    { key: 'estado', label: 'Estado', badge: true }
                                ]}

                            />
                        </CCardBody>
                    </CCard>
                </div>
                <div className='col-lg-6 col-12'>
                    <BarraAcciones
                        botones={{ agregar: true, editar: false, actualizar: true, imprimir: false, descargar: false, compartir: false, filtrar: false }}
                        onAgregarClick={handleAgregarSubmodulo}
                        onActualizarClick={handleActualizarDatos}

                    />
                    <CCard className='mb-3'>
                        <CCardHeader className='pt-0 pb-0' style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                            <PaginationAndSearch
                                searchTerm={searchTermSubmodulos}
                                setSearchTerm={setSearchTermSubmodulos}
                                modulosPorPagina={modulosPorPagina}
                                setmodulosPorPagina={setmodulosPorPagina}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalRoles={filteredSubmodulos.length}
                                display={true}
                            />
                        </CCardHeader>
                    </CCard>
                    <CCard className="mb-4" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                        <CCardBody>
                            <small style={{ fontSize: '16px' }}>Lista de Submodulos</small>
                            <Table
                                data={paginatedSubmodulos.map(modulo => ({
                                    ...modulo,
                                    key: modulo.id,
                                    actions: (
                                        <div>
                                            <button
                                                onMouseEnter={() => setSelectedModuloId(modulo.id)}
                                                onMouseLeave={() => setSelectedModuloId(null)}
                                                className='btn'
                                                onClick={() => handleEditSubmodulo(modulo)}
                                            >
                                                <CIcon icon={cilPencil} className='btn-hover' />
                                            </button>
                                            <button
                                                onMouseEnter={() => setSelectedModuloId(modulo.id)}
                                                onMouseLeave={() => setSelectedModuloId(null)}
                                                className='btn '
                                            >
                                                <CIcon
                                                    icon={cilTrash}
                                                    className='btn-hover'
                                                />
                                            </button>
                                        </div>
                                    )
                                }))}
                                columnas={[
                                    { key: 'actions', label: 'Acciones' },
                                    { key: 'id', label: 'Codigo' },
                                    { key: 'nombre', label: 'Modulos' },
                                    { key: 'estado', label: 'Estado', badge: true }
                                ]}

                            />

                        </CCardBody>
                    </CCard>
                </div>
            </div>
            <Notificaciones />
        </CCol>
    );
}

export default Modulos;