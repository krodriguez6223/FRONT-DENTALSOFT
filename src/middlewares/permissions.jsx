import { jwtDecode } from 'jwt-decode';
// Función para verificar permisos
export const checkPermission = (subModulePath, idSubmodulo, action) => {
    try {
        const permissions = localStorage.getItem('userPermissions');
        if (!permissions) {
            console.warn('No se encontraron permisos en localStorage');
            return false;
        }

        const parsedPermissions = JSON.parse(permissions);
        
        if (!Array.isArray(parsedPermissions)) {
            console.warn('Los permisos almacenados no son un array válido');
            return false;
        }

        const permission = parsedPermissions.find(
            p => p.ruta === subModulePath && p.id_submodulo === idSubmodulo
        );

        return permission ? !!permission[action] : false;

    } catch (error) {
        console.error('Error al verificar permisos:', error);
        return false;
    }
};

export const hasMultiplePermissions = (subModulePath, idSubmodulo, actions = []) => {
    return actions.every(action => checkPermission(subModulePath, idSubmodulo, action));
};

// Función para obtener todos los permisos
export const getAllPermissions = () => {
    try {
        const permissions = localStorage.getItem('userPermissions');
        if (!permissions) {
            console.warn('No se encontraron permisos en localStorage');
            return [];
        }

        const parsedPermissions = JSON.parse(permissions);
        
        if (!Array.isArray(parsedPermissions)) {
            console.warn('Los permisos almacenados no son un array válido');
            return [];
        }

        if (parsedPermissions.length === 0) {
            console.warn('El array de permisos está vacío');
        }

        return parsedPermissions;
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        return [];
    }
};