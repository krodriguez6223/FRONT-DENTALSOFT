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
import ConfirmModal from '../../components/ConfirmModal';
const Modulos = () => {
    
    const initialFormData = () => ({estado: true, descripcion: '', id: null });
    const [catalogos, setCatalogos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [catalogosPorPagina, setcatalogosPorPagina] = useState(100);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selecttedModuloId, setSelectedCatalogoId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState(initialFormData());
    const [dataDetalleCatalogo, setDataDetalleCatalogo] = useState([]);
    const [modaldetalleCatalogoVisible, setModalDetalleCatalogoVisible] = useState(false);
    const [isEditDetalleCatalogo, setIsEditDetalleCatalogo] = useState(false);
    const [detallecatalogoFormData, setDetalleCatalogoFormData] = useState(initialFormData());
    const [searchTermDetalleCatalogo, setSearchTermDetalleCatalogo] = useState('');
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        detalleCatalogoId: null,
        catalogoId: null,
        detalleCatalogo: null
    });

    const fetchCatalogos = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`/catalogo/cat`);
            setCatalogos(data);
        } catch (error) {
            const message = error.response.data.message
            mostrarNotificacion('Error al cargar catalogos: ' + message, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchDetalleCatalogo = async (id) => {
        setIsLoading(true);
        try {
            if (!id) {
                setDataDetalleCatalogo([]);
                return;
            }
            const { data } = await axios.get(`/detallecatalogo/det/${id}`);
            if (data) {
                setDataDetalleCatalogo(data);
            } else {
                setDataDetalleCatalogo([]);
                mostrarNotificacion('No se encontraron detalles para este catálogo', 'warning');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.message || 
                               'Error al cargar los detalles del catálogo';
            mostrarNotificacion(errorMessage, 'error');
            setDataDetalleCatalogo([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCatalogos();
        setCurrentPage(0);
    }, [searchTerm]);


    const filteredItems = (items, searchTerm) => {
        return items.filter(item => {
            const descripcion = `${item.descripcion || ''}`.toLowerCase();
            return descripcion.includes(searchTerm.toLowerCase());
        });
    };

    const filteredCatalogos = filteredItems(catalogos, searchTerm);
    const filteredDetalleCatalogo = filteredItems(dataDetalleCatalogo, searchTermDetalleCatalogo);

    const paginateItems = (items) => {
        return items.slice(
            currentPage * catalogosPorPagina,
            (currentPage + 1) * catalogosPorPagina
        );
    };

    const paginatedCatalogos = paginateItems(filteredCatalogos);
    const paginatedDetalleCatalogo = paginateItems(filteredDetalleCatalogo);

    const handleCloseModal = () => {
        setModalVisible(false);
        setIsEdit(false);
    };
    //agregar catalogo
    const handleSubmit = async (nuevoCatalogo) => {
        const catalogoCompleto = { ...formData, ...nuevoCatalogo };
        setIsLoading(true);
        try {
            let response
            if (isEdit) {

                // Actualizar catalago existente
                response = await axios.put(`/catalogo/cat/${formData.id}`, catalogoCompleto);
                if (response.status === 200) {
                    setCatalogos(prevCatalogos =>
                        prevCatalogos.map(catalogo =>
                            catalogo.id === formData.id ? response.data : catalogo
                        )
                    );
                    mostrarNotificacion(response.data.message, 'success');
                } else {
                    mostrarNotificacion('Error al actualizar catalogo: ' + (response.data.error || response.statusText), 'error');
                }
            } else {
                const existingCatalogo = catalogos.find(catalogo => catalogo.descripcion === nuevoCatalogo.descripcion);
                if (existingCatalogo) {
                    mostrarNotificacion('El nombre de catalogo ya está en uso.', 'error');
                    return;
                }

                // Agregar nuevo catalogo
                response = await axios.post(`/catalogo/cat`, catalogoCompleto);
                if (response.status === 201) {
                    setCatalogos(prevCatalogos => [...prevCatalogos, response.data]);
                    mostrarNotificacion(response.data.message, 'success');
                } else {
                    mostrarNotificacion('Error al agregar catalogo: ' + (response.data.error || response.statusText), 'error');
                }
            }
            handleCloseModal();
            fetchCatalogos();
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
        await fetchCatalogos();
        setIsLoading(false);
    };

    const handleCatalogoSelect = (catalogo) => {
        const { descripcion, estado, id, } = catalogo;
        setFormData({ descripcion, estado, id, });
        setSelectedCatalogoId(id);
        setModalVisible(true);
        setIsEdit(true);
    }
    
    const handleViewDetalleCatalago = (catalogo) => {
        fetchDetalleCatalogo(catalogo.id); 
        setSelectedCatalogoId(catalogo.id);
    };
//agregar detalle catalogo
    const handleSubmitDetalleCatalogo = async (nuevoDetalleCatalogo) => {
        const detallecatalogoCompleto = {
            ...detallecatalogoFormData,
            ...nuevoDetalleCatalogo,

        };
        setIsLoading(true);
        try {
            let response;

            if (isEditDetalleCatalogo) {
                response = await axios.put(`/detallecatalogo/det/${detallecatalogoFormData.id}`, detallecatalogoCompleto);
                if (response.status === 200) {
                    setDataDetalleCatalogo(prev => [...prev, response.data]);
                    mostrarNotificacion(response.data.message, 'success');
                    fetchDetalleCatalogo(detallecatalogoFormData.catalogo_id);
                }
            } else {
                const existingDetalleCatalogo = dataDetalleCatalogo.find(
                    det => det.descripcion === nuevoDetalleCatalogo.descripcion
                );
                if (existingDetalleCatalogo) {
                    mostrarNotificacion('El nombre de subcatalogo ya está en uso.', 'error');
                    return;
                }
                response = await axios.post(`/detallecatalogo/det`, detallecatalogoCompleto);
                if (response.status === 201) {
                    setDataDetalleCatalogo(prev => [...prev, response.data]);
                    mostrarNotificacion(response.data.message, 'success');
                    fetchDetalleCatalogo(detallecatalogoFormData.catalogo_id);
                }
            }
            handleCloseDetalleCatalogoModal();

        } catch (error) {
            mostrarNotificacion('Error al procesar la solicitud: ' + (error.response ? error.response.data.error : error.message), 'error')
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDetalleCatalogoModal = () => {
        setModalDetalleCatalogoVisible(false);
        setIsEditDetalleCatalogo(false);
    };

    const handleAgregarDetalleCatalogo = () => {
        setModalDetalleCatalogoVisible(true);
        setSelectedCatalogoId(null);
    };

    const handleEditDetalleCatalago = (detalleCatalogo) => {
        setDetalleCatalogoFormData({
            descripcion: detalleCatalogo.descripcion,
            estado: detalleCatalogo.estado,
            id: detalleCatalogo.id,
            valor: detalleCatalogo.valor,
            catalogo_id: detalleCatalogo.catalogo_id
        });
        setModalDetalleCatalogoVisible(true);
        setIsEditDetalleCatalogo(true);
    };
    const handleConfirmDelete = async () => {
        try {
            if (!confirmModal.detalleCatalogo) {
                mostrarNotificacion('No se encontró el detalle de catálogo a eliminar', 'error');
                return;
            }
            const response = await axios.delete(`/detallecatalogo/det/${confirmModal.detalleCatalogoId}`);
            console.log(response);
            if (response.status === 200) {
                await fetchDetalleCatalogo(confirmModal.detalleCatalogo.catalogo_id);
                mostrarNotificacion('Detalle catálogo eliminado exitosamente', 'success');
                setConfirmModal({ visible: false, detalleCatalogoId: null, catalogoId: null, detalleCatalogo: null });
            }
        } catch (error) {
            console.log(error);
            mostrarNotificacion('Error al procesar la solicitud: ' + (error.response ? error.response.data.error : error.message), 'error')
        }
    };
    //eliminar detalle catalogo
    const eliminarDetalleCatalogo = (detalleCatalogo) => {
        setConfirmModal({
            visible: true,
            detalleCatalogoId: detalleCatalogo.id,
            catalogoId: detalleCatalogo.catalogo_id,
            detalleCatalogo: detalleCatalogo
        });
    };


    return (
        <CCol xs={12}>

            <Modal
                visible={modalVisible}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                col="col-md-6"
                tamaño="lg"
                titulo={formData.id ? "Editar Catalogo" : "Nuevo Catalogo"}
                campos={[
                    { name: 'descripcion', placeholder: 'Descripción', type: 'text', key: 'descripcion', required: true, pattern: /^[a-zA-Z0-9 ]+$/ },
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
                visible={modaldetalleCatalogoVisible}
                onClose={handleCloseDetalleCatalogoModal}
                onSubmit={handleSubmitDetalleCatalogo}
                col="col-md-6"
                tamaño="lg"
                titulo={isEditDetalleCatalogo ? "Editar detalle Catalogo" : "Nuevo detalle Catalogo"}
                campos={[
                    { name: 'descripcion', placeholder: 'Descripción', type: 'text', key: 'descripcion', required: true, pattern: /^[a-zA-Z0-9 ]+$/ },
                    {
                        name: 'catalogo_id',
                        placeholder: 'Seleccionar Catalogo',
                        type: 'select',
                        key: 'catalogo_id',
                        options: catalogos.map(catalogo => ({ value: catalogo.id, label: catalogo.descripcion })), 
                        required: true,
                    },

                    {
                        name: 'estado', placeholder: 'Estado', type: 'select', key: 'estado', options: [
                            { value: true, label: 'Activo' },
                            { value: false, label: 'Inactivo' }
                        ], required: true
                    }
                ]}
                formData={detallecatalogoFormData}
                isEdit={isEditDetalleCatalogo}
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
                                catalogosPorPagina={catalogosPorPagina}
                                setcatalogosPorPagina={setcatalogosPorPagina}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalRoles={filteredCatalogos.length}
                                display={true}
                            />
                        </CCardHeader>
                    </CCard>
                    <CCard className="mb-4" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                        <CCardBody>
                            <small style={{ fontSize: '16px' }}>Lista de Catalogos</small>
                            <Table
                                data={paginatedCatalogos.map(catalogo => ({
                                    ...catalogo,
                                    key: catalogo.id,
                                    actions: (
                                        <div>
                                            <button
                                                onMouseEnter={() => setSelectedCatalogoId(catalogo.id)}
                                                onMouseLeave={() => setSelectedCatalogoId(null)}
                                                className='btn '
                                                onClick={() => handleCatalogoSelect(catalogo)}
                                            >
                                                <CIcon
                                                    icon={cilPencil}
                                                    className='btn-hover'
                                                />
                                            </button>
                                            <button
                                                onMouseEnter={() => setSelectedCatalogoId(catalogo.id)}
                                                onMouseLeave={() => setSelectedCatalogoId(null)}
                                                className='btn btn-hover'
                                                onClick={() => handleViewDetalleCatalago(catalogo)}
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
                                    { key: 'descripcion', label: 'Catalogo' },
                                    { key: 'estado', label: 'Estado', badge: true }
                                ]}

                            />
                        </CCardBody>
                    </CCard>
                </div>
                <div className='col-lg-6 col-12'>
                    <BarraAcciones
                        botones={{ agregar: true, editar: false, actualizar: true, imprimir: false, descargar: false, compartir: false, filtrar: false }}
                        onAgregarClick={handleAgregarDetalleCatalogo}
                        onActualizarClick={handleActualizarDatos}

                    />
                    <CCard className='mb-3'>
                        <CCardHeader className='pt-0 pb-0' style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                            <PaginationAndSearch
                                searchTerm={searchTermDetalleCatalogo}
                                setSearchTerm={setSearchTermDetalleCatalogo}
                                catalogosPorPagina={catalogosPorPagina}
                                setcatalogosPorPagina={setcatalogosPorPagina}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalRoles={filteredDetalleCatalogo.length}
                                display={true}
                            />
                        </CCardHeader>
                    </CCard>
                    <CCard className="mb-4" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                        <CCardBody>
                            <small style={{ fontSize: '16px' }}>Lista de Submodulos</small>
                            <Table
                                data={paginatedDetalleCatalogo.map(catalogo => ({
                                    ...catalogo,
                                    key: catalogo.id,
                                    actions: (
                                        <div>
                                            <button
                                                onMouseEnter={() => setSelectedCatalogoId(catalogo.id)}
                                                onMouseLeave={() => setSelectedCatalogoId(null)}
                                                className='btn'
                                                onClick={() => handleEditDetalleCatalago(catalogo)}
                                            >
                                                <CIcon icon={cilPencil} className='btn-hover' />
                                            </button>
                                            <button
                                                onMouseEnter={() => setSelectedCatalogoId(catalogo.id)}
                                                onMouseLeave={() => setSelectedCatalogoId(null)}
                                                className='btn'
                                                onClick={() => eliminarDetalleCatalogo(catalogo)}
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
                                    { key: 'descripcion', label: 'Detalle Catalogo' },
                                    { key: 'estado', label: 'Estado', badge: true }
                                ]}

                            />

                        </CCardBody>
                    </CCard>
                </div>
                <ConfirmModal
                    visible={confirmModal.visible}
                    onClose={() => setConfirmModal({ visible: false, detalleCatalogoId: null, catalogoId: null, detalleCatalogo: null })}
                    onConfirm={handleConfirmDelete}
                    title="Confirmar eliminación"
                    message={`¿Está seguro que desea eliminar el detalle de catálogo, ${confirmModal.detalleCatalogo?.descripcion || ''}`}
                />
            </div>
            <Notificaciones />
        </CCol>
    );
}

export default Modulos;