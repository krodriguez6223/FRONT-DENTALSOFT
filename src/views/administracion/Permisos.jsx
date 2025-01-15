import React, { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react-pro';
import Notificaciones, { mostrarNotificacion } from '../../components/Notification';
import axios from '../../conf/axiosConf';
import {  cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ConfirmModal from '../../components/ConfirmModal';

const Permisos = ({ visible, onClose, formData, rolId }) => {  
    const [isLoading, setIsLoading] = useState(false);
    const [permisosData, setPermisosData] = useState([]);
    const [nuevoSubmodulo, setNuevoSubmodulo] = useState({
        nombre_submodulo: '',
        modulo_id: null,
        created: false,
        read: false,
        updateperm: false,
        deleteperm: false,
        exportperm: false,
        printperm: false
    });
    const [submodulos, setSubmodulos] = useState([]);
    const [selectedSubmodulos, setSelectedSubmodulos] = useState([]);
    const [todosModulos, setTodosModulos] = useState([]);
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [filasTemporales, setFilasTemporales] = useState([]);
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        permisoId: null,
        nombreSubmodulo: '',
    });
   
    //obtiene los permisos del rol
    const fetchPermisos = async (rolId) => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`/permisos/per/${rolId}`); 
            setPermisosData(data);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };
    //obtiene los submodulos del modulo
    const fetchSubmodulos = async (modulo_id) => {
        try {
            const { data } = await axios.get(`/submodulos/sub/${modulo_id}`);
            setSubmodulos(data);
        } catch (error) {
            mostrarNotificacion('Error al cargar submódulos', 'error');
        }
    };
    //obtiene los modulos
    const fetchTodosModulos = async () => {
        try {
            const { data } = await axios.get('/modulos/mod');
            setTodosModulos(data);
        } catch (error) {
            mostrarNotificacion('Error al cargar módulos', 'error');
        }
    };
    useEffect(() => {
    }, [submodulos]);
    
    //agrupa los permisos por modulo
    const agruparPermisosPorModulo = (permisos) => {
        const gruposIniciales = todosModulos.reduce((acc, modulo) => {
            acc[modulo.id] = {
                nombre_modulo: modulo.nombre,
                modulo_id: modulo.id,
                permisos: []
            };
            return acc;
        }, {});
        //agrega los permisos a los modulos
        permisos.forEach(permiso => {
            const moduloKey = permiso.modulo_id;
            if (gruposIniciales[moduloKey]) {
                gruposIniciales[moduloKey].permisos.push(permiso);
            }
        });

        return Object.values(gruposIniciales).sort((a, b) => a.modulo_id - b.modulo_id);
    };

    const handleClose = () => {
        setPermisosData([]);
        setSelectedSubmodulos([]);
        setActiveModuleId(null);
        setFilasTemporales([]);
        onClose();
        setNuevoSubmodulo({
            nombre_submodulo: '',
            modulo_id: null,
            created: false,
            read: false,
            updateperm: false,
            deleteperm: false,
            exportperm: false,
            printperm: false
        });
    };
    //cambia el estado de los permisos
    const handlePermissionChange = (permisoId, field) => {
        setPermisosData(prevPermisos => 
            prevPermisos.map(permiso => 
                permiso.id_permiso === permisoId
                    ? { ...permiso, [field]: !Boolean(permiso[field]) }
                    : permiso
            )
        );
    };
    //agrega un nuevo submodulo al modulo
    const agregarNuevoSubmodulo = (moduloId) => {
        fetchSubmodulos(moduloId);
        setActiveModuleId(moduloId);
        setFilasTemporales(prev => [...prev, {
            id: `temp-row-${Date.now()}`,
            modulo_id: moduloId,
            submodulo_id: null,
            created: false,
            read: false,
            updateperm: false,
            deleteperm: false,
            exportperm: false,
            printperm: false
        }]);
    };
    //selecciona un submodulo
    const handleSubmoduloSelect = (filaId, e) => {
        const submoduloId = parseInt(e.target.value);
        
        if (!submoduloId) return;
        
        // Verificar si el submódulo ya existe
        const submoduloExistente = permisosData.some(
            permiso => permiso.id_submodulo === submoduloId
        );
        
        if (submoduloExistente) {
            mostrarNotificacion('Este submódulo ya tiene permisos asignados', 'error');
            e.target.value = '';
            return;
        }
        
        const submoduloSeleccionado = submodulos.find(
            sub => sub.id === submoduloId
        );
        //agrega el nuevo submodulo a los permisos
        if (submoduloSeleccionado) {
            const nuevoPermiso = {
                id_permiso: `temp-${Date.now()}`,
                nombre_submodulo: submoduloSeleccionado.nombre,
                modulo_id: activeModuleId,
                id_submodulo: submoduloId,
                created: false,
                read: false,
                updateperm: false,
                deleteperm: false,
                exportperm: false,
                printperm: false
            };

            setPermisosData(prevPermisos => [...prevPermisos, nuevoPermiso]);
            setFilasTemporales(prev => prev.filter(fila => fila.id !== filaId));
        }
    };

    const handleTemporaryPermissionChange = (filaId, field) => {
        setFilasTemporales(prev => prev.map(fila => 
            fila.id === filaId ? { ...fila, [field]: !fila[field] } : fila
        ));
    };

    const eliminarFilaTemporal = (filaId) => {
        setFilasTemporales(prev => prev.filter(fila => fila.id !== filaId));
    };

    useEffect(() => {
        if (rolId && visible) {
            fetchPermisos(rolId);
            fetchTodosModulos();
        }
        if (!visible) {
            setPermisosData([]);
        }
    }, [rolId, visible]);

    //actualiza los permisos
    const handleSubmit = async () => {
        if (filasTemporales.length > 0) {
            mostrarNotificacion('Debe seleccionar un submódulo para todas las filas agregadas o eliminarlas antes de actualizar', 'error');
            return;
        }

        setIsLoading(true);
        try {
            let permisosActualizados = permisosData.map(permiso => ({
                id_permiso: permiso.id_permiso?.toString().startsWith('temp-') ? null : permiso.id_permiso,
                id_rol: rolId,
                id_submodulo: permiso.id_submodulo,
                id_modulo: permiso.modulo_id,
                created: Boolean(permiso.created),
                read: Boolean(permiso.read),
                updateperm: Boolean(permiso.updateperm),
                deleteperm: Boolean(permiso.deleteperm),
                exportperm: Boolean(permiso.exportperm),
                printperm: Boolean(permiso.printperm)
            }));

            if (selectedSubmodulos.length > 0 && nuevoSubmodulo.modulo_id) {
                selectedSubmodulos.forEach(submoduloId => {
                    permisosActualizados.push({
                        id_permiso: null,
                        id_rol: rolId,
                        id_submodulo: submoduloId,
                        id_modulo: nuevoSubmodulo.modulo_id,
                        created: Boolean(nuevoSubmodulo.created),
                        read: Boolean(nuevoSubmodulo.read),
                        updateperm: Boolean(nuevoSubmodulo.updateperm),
                        deleteperm: Boolean(nuevoSubmodulo.deleteperm),
                        exportperm: Boolean(nuevoSubmodulo.exportperm),
                        printperm: Boolean(nuevoSubmodulo.printperm)
                    });
                });
            }

            await axios.put(`/permisos/per/`, {
                permisos: permisosActualizados
            });

            mostrarNotificacion('Permisos actualizados exitosamente', 'success');
            handleClose();
        } catch (error) {
            mostrarNotificacion('Error al actualizar los permisos', 'error');
            console.error('Error completo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const eliminarPermiso = async (permisoId, nombreSubmodulo) => {
        setConfirmModal({
            visible: true,
            permisoId,
            nombreSubmodulo,
        });
    };
    //elimina el permiso
    const handleConfirmDelete = async () => {
        const { permisoId, nombreSubmodulo } = confirmModal;
        try {
            if (String(permisoId).startsWith('temp-')) {
                setPermisosData(prev => prev.filter(p => p.id_permiso !== permisoId));
                setConfirmModal({ visible: false, permisoId: null, nombreSubmodulo: '' });
                return;
            }

            await axios.delete(`/permisos/per/${permisoId}`);
            setPermisosData(prev => prev.filter(p => p.id_permiso !== permisoId));
            mostrarNotificacion('Permiso eliminado exitosamente', 'success');
        } catch (error) {
            mostrarNotificacion('Error al eliminar el permiso', 'error');
            console.error('Error:', error);
        } finally {
            setConfirmModal({ visible: false, permisoId: null, nombreSubmodulo: '' });
        }
    };
    
    return (
        <div>
            <CModal 
                visible={visible}
                onClose={handleClose}
                size="lg" 
                backdrop="static"
                setPermisosData={setPermisosData}
            >
                <CModalHeader>
                    <CModalTitle>Permisos - {formData?.nombre}</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {isLoading ? (
                        <p>Cargando permisos...</p>
                    ) : (
                        agruparPermisosPorModulo(permisosData).map((grupo) => (
                            <div key={grupo.modulo_id} className="mb-4 mr-2">
                                <div className="d-flex align-items-center mb-3 justify-content-between">
                                    <h6 style={{fontWeight: 'bold', color: '#4a566d'}}>MODULO: {grupo.nombre_modulo}</h6>
                                    <CButton 
                                        color="warning" 
                                        size="sm"
                                        onClick={() => agregarNuevoSubmodulo(grupo.modulo_id)}
                                        style={{ backgroundColor: '#e5ce90', borderColor: '#e5ce90' }}
                                        title="Agregar un nuevo submodulo"
                                    >
                                        <CIcon icon={cilPlus} />
                                    </CButton>
                                </div>
                                {grupo.permisos.length === 0 && grupo.modulo_id !== activeModuleId ? (
                                    <div className="alert alert-info text-center">
                                        Sin permisos asignados
                                    </div>
                                ) : (
                                    <table className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th className='text-center'>SUBMÓDULOS</th>
                                                <th className='text-center'>Crear</th>
                                                <th className='text-center'>Ver</th>
                                                <th className='text-center'>Editar</th>
                                                <th className='text-center'>Eliminar</th>
                                                <th className='text-center'>Exportar</th>
                                                <th className='text-center'>Imprimir</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grupo.permisos.map((permiso) => (
                                                <tr key={permiso.id_permiso}>
                                                    <td style={{ backgroundColor: '#0381a1', color: 'white' }} className="d-flex justify-content-between align-items-center">
                                                        <span>{permiso.nombre_submodulo}</span>
                                                        <CButton
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => eliminarPermiso(permiso.id_permiso, permiso.nombre_submodulo)}
                                                            style={{ 
                                                                backgroundColor: 'transparent', 
                                                                border: 'none',
                                                                padding: '0 5px'
                                                            }}
                                                            title="Eliminar permiso"
                                                        >
                                                            <CIcon icon={cilTrash} style={{ color: 'white' }} />
                                                        </CButton>
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={permiso.created} 
                                                            onChange={() => handlePermissionChange(permiso.id_permiso, 'created')}
                                                            className="checkbox-custom"
                                                            title="Crear"
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={permiso.read} 
                                                            onChange={() => handlePermissionChange(permiso.id_permiso, 'read')}
                                                            className="checkbox-custom"
                                                            title="Ver"
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={Boolean(permiso.updateperm)} 
                                                            onChange={() => handlePermissionChange(permiso.id_permiso, 'updateperm')}
                                                            className="checkbox-custom"
                                                            title="Editar"
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={Boolean(permiso.deleteperm)} 
                                                            onChange={() => handlePermissionChange(permiso.id_permiso, 'deleteperm')}
                                                            className="checkbox-custom"
                                                            title="Eliminar"
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={Boolean(permiso.exportperm)} 
                                                            onChange={() => handlePermissionChange(permiso.id_permiso, 'exportperm')}
                                                            className="checkbox-custom"
                                                            title="Exportar"
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={Boolean(permiso.printperm)} 
                                                            onChange={() => handlePermissionChange(permiso.id_permiso, 'printperm')}
                                                            className="checkbox-custom"
                                                            title="Imprimir"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            {grupo.modulo_id === activeModuleId && filasTemporales
                                                .filter(fila => fila.modulo_id === grupo.modulo_id)
                                                .map((fila) => (
                                                    <tr key={fila.id}>
                                                        <td style={{ backgroundColor: '#f5f5f5', position: 'relative' }}>
                                                            <div className="d-flex align-items-center">
                                                                <select
                                                                    className="form-select"
                                                                    onChange={(e) => handleSubmoduloSelect(fila.id, e)}
                                                                    defaultValue=""
                                                                    style={{ backgroundColor: '#f5f5f5', flex: 1 }}
                                                                >
                                                                    <option value="">Seleccione..</option>
                                                                    {submodulos
                                                                        .filter(sub => !selectedSubmodulos.includes(sub.id) && 
                                                                                    !permisosData.some(permiso => permiso.id_submodulo === sub.id))
                                                                        .map(sub => (
                                                                            <option key={sub.id} value={sub.id}>
                                                                                {sub.nombre}
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                <div>
                                                              
                                                                <button
                                                                    className='btn'
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={() => eliminarFilaTemporal(fila.id)}
                                                                    style={{ marginLeft: '10px' }}
                                                                    title="Eliminar fila"
                                                                >
                                                                    <CIcon icon={cilTrash}
                                                                         className='btn-hover' />
                                                                </button>
                                                                </div>
                                                               
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={fila.created}
                                                                onChange={() => handleTemporaryPermissionChange(fila.id, 'created')}
                                                                className="checkbox-custom"
                                                                title="Crear"
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={fila.read}
                                                                onChange={() => handleTemporaryPermissionChange(fila.id, 'read')}
                                                                className="checkbox-custom"
                                                                title="Ver"
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={fila.updateperm}
                                                                onChange={() => handleTemporaryPermissionChange(fila.id, 'updateperm')}
                                                                className="checkbox-custom"
                                                                title="Editar"
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={fila.deleteperm}
                                                                onChange={() => handleTemporaryPermissionChange(fila.id, 'deleteperm')}
                                                                className="checkbox-custom"
                                                                title="Eliminar"
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={fila.exportperm}
                                                                onChange={() => handleTemporaryPermissionChange(fila.id, 'exportperm')}
                                                                className="checkbox-custom"
                                                                title="Exportar"
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={fila.printperm}
                                                                onChange={() => handleTemporaryPermissionChange(fila.id, 'printperm')}
                                                                className="checkbox-custom"
                                                                title="Imprimir"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        ))
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleClose}>
                        Cerrar
                    </CButton>
                    <CButton color="warning" onClick={handleSubmit}>
                        Actualizar 
                    </CButton>
                </CModalFooter>
                
            </CModal>
            <ConfirmModal
                visible={confirmModal.visible}
                onClose={() => setConfirmModal({ visible: false, permisoId: null, nombreSubmodulo: '' })}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={`¿Está seguro que desea eliminar los permisos del submódulo "${confirmModal.nombreSubmodulo}"?`}
            />
        </div>  
    )
}

export default Permisos;


