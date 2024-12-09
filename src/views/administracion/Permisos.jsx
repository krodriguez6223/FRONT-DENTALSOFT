import React, { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react-pro';
import Notificaciones, { mostrarNotificacion } from '../../components/Notification';
import axios from '../../conf/axiosConf';
import { cilPencil, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Permisos = ({ visible, onClose, formData, isEdit, permisos, rolId }) => {  
    
    const [isLoading, setIsLoading] = useState(false);
    const [permisosData, setPermisosData] = useState([]);
    const [nuevoSubmodulo, setNuevoSubmodulo] = useState({
        nombre_submodulo: '',
        modulo_id: null,
        created: false,
        read: false,
        update: false,
        delete: false,
        export: false,
        print: false
    });
    const [submodulos, setSubmodulos] = useState([]);
    const [selectedSubmodulo, setSelectedSubmodulo] = useState('');

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
    const fetchSubmodulos = async (moduloId) => {
        console.log(moduloId);
        try {
            const { data } = await axios.get(`/submodulos/sub/1`);
            console.log(data);
            setSubmodulos(data);
        } catch (error) {
            mostrarNotificacion('Error al cargar submódulos', 'error');
        }
    };
    useEffect(() => {
        console.log(submodulos);
    }, [submodulos]);

    const agruparPermisosPorModulo = (permisos) => {
        const grupos = permisos.reduce((acc, permiso) => {
            const moduloKey = `${permiso.modulo_id}-${permiso.nombre_modulo}`;
            if (!acc[moduloKey]) {
                acc[moduloKey] = {
                    nombre_modulo: permiso.nombre_modulo,
                    modulo_id: permiso.modulo_id,
                    permisos: []
                };
            }
            acc[moduloKey].permisos.push(permiso);
            return acc;
        }, {});
        
        return Object.values(grupos).sort((a, b) => a.modulo_id - b.modulo_id);
    };

    const handleClose = () => {
        setPermisosData([]);
        onClose();
    };

    const handlePermissionChange = (permisoId, field) => {
        setPermisosData(prevPermisos => 
            prevPermisos.map(permiso => 
                permiso.id_permiso === permisoId
                    ? { ...permiso, [field]: !permiso[field] }
                    : permiso
            )
        );
    };



    const agregarNuevoSubmodulo = (moduloId) => {
        fetchSubmodulos(moduloId);
        setNuevoSubmodulo({
            ...nuevoSubmodulo,
            modulo_id: moduloId
        });
    };

    const handleSubmoduloSelect = (e) => {
        const submoduloSeleccionado = submodulos.find(
            sub => sub.id_submodulo === parseInt(e.target.value)
        );
        
        if (submoduloSeleccionado) {
            setNuevoSubmodulo({
                ...nuevoSubmodulo,
                nombre_submodulo: submoduloSeleccionado.nombre_submodulo,
                id_submodulo: submoduloSeleccionado.id_submodulo
            });
            setSelectedSubmodulo(e.target.value);
        }
    };

    useEffect(() => {
        if (rolId && visible) {
            fetchPermisos(rolId);
        }
        if (!visible) {
            setPermisosData([]);
        }
    }, [rolId, visible]);

    const handleSubmit = async () => {
        // Aquí irá la lógica para guardar los permisos
        console.log('Guardando permisos...');
    }
    
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
                    <CModalTitle>Permisos - {formData?.nombre_modulo}</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {isLoading ? (
                        <p>Cargando permisos...</p>
                    ) : (
                        agruparPermisosPorModulo(permisosData).map((grupo) => (
                            <div key={grupo.modulo_id} className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>{grupo.nombre_modulo}</h5>
                                    <CButton 
                                        color="primary" 
                                        size="sm"
                                        onClick={() => agregarNuevoSubmodulo(grupo.modulo_id)}
                                    >
                                        <CIcon icon={cilPlus} /> Agregar Submódulo
                                    </CButton>
                                </div>
                                <table className='table table-striped'>
                                    <thead className='sticky-top' style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0, zIndex: 100  }}>
                                        <tr>
                                            <th>SUBMÓDULOS</th>
                                            <th>Crear</th>
                                            <th>Ver</th>
                                            <th>Editar</th>
                                            <th>Eliminar</th>
                                            <th>Exportar</th>
                                            <th>Imprimir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grupo.permisos.map((permiso) => (
                                            <tr key={permiso.id_permiso}>
                                                <td>{permiso.nombre_submodulo}</td>
                                                <td><input 
                                                    type="checkbox" 
                                                    checked={permiso.created} 
                                                    onChange={() => handlePermissionChange(permiso.id_permiso, 'created')}
                                                /></td>
                                                <td><input 
                                                    type="checkbox" 
                                                    checked={permiso.read} 
                                                    onChange={() => handlePermissionChange(permiso.id_permiso, 'read')}
                                                /></td>
                                                <td><input 
                                                    type="checkbox" 
                                                    checked={permiso.update} 
                                                    onChange={() => handlePermissionChange(permiso.id_permiso, 'update')}
                                                /></td>
                                                <td><input 
                                                    type="checkbox" 
                                                    checked={permiso.delete} 
                                                    onChange={() => handlePermissionChange(permiso.id_permiso, 'delete')}
                                                /></td>
                                                <td><input 
                                                    type="checkbox" 
                                                    checked={permiso.export} 
                                                    onChange={() => handlePermissionChange(permiso.id_permiso, 'export')}
                                                /></td>
                                                <td><input 
                                                    type="checkbox" 
                                                    checked={permiso.print} 
                                                    onChange={() => handlePermissionChange(permiso.id_permiso, 'print')}
                                                /></td>
                                            </tr>
                                        ))}
                                        {grupo.modulo_id === nuevoSubmodulo.modulo_id && (
                                            <tr>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={selectedSubmodulo}
                                                        onChange={handleSubmoduloSelect}
                                                    >
                                                        <option value="">Seleccione un submódulo</option>
                                                        {submodulos.map(sub => (
                                                            <option key={sub.id_submodulo} value={sub.id_submodulo}>
                                                                {sub.nombre_submodulo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td><input type="checkbox" checked={nuevoSubmodulo.created} onChange={() => setNuevoSubmodulo({...nuevoSubmodulo, created: !nuevoSubmodulo.created})} /></td>
                                                <td><input type="checkbox" checked={nuevoSubmodulo.read} onChange={() => setNuevoSubmodulo({...nuevoSubmodulo, read: !nuevoSubmodulo.read})} /></td>
                                                <td><input type="checkbox" checked={nuevoSubmodulo.update} onChange={() => setNuevoSubmodulo({...nuevoSubmodulo, update: !nuevoSubmodulo.update})} /></td>
                                                <td><input type="checkbox" checked={nuevoSubmodulo.delete} onChange={() => setNuevoSubmodulo({...nuevoSubmodulo, delete: !nuevoSubmodulo.delete})} /></td>
                                                <td><input type="checkbox" checked={nuevoSubmodulo.export} onChange={() => setNuevoSubmodulo({...nuevoSubmodulo, export: !nuevoSubmodulo.export})} /></td>
                                                <td><input type="checkbox" checked={nuevoSubmodulo.print} onChange={() => setNuevoSubmodulo({...nuevoSubmodulo, print: !nuevoSubmodulo.print})} /></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleClose}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleSubmit}>
                        Guardar cambios
                    </CButton>
                </CModalFooter>
                
            </CModal>
        </div>  
    )
}

export default Permisos;


