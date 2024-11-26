
import React, { useState, useEffect } from 'react';
import axios from '../../conf/axiosConf';
import Table from '../../components/Table';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import { mostrarNotificacion } from '../../components/Notification';

const Submodulos = ({ moduloId }) => {
    const [dataSubmodulos, setDataSubmodulos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (moduloId) {
            fetchSubmodulos(moduloId);
        }
    }, [moduloId]);

    const fetchSubmodulos = async (id) => {
        setIsLoading(true);
        setDataSubmodulos([]);
        try {
            const { data } = await axios.get(`/modulos/mod/${id}`);
            setDataSubmodulos(data);
        } catch (error) {
            const message = error.response.data.message;
            mostrarNotificacion('Este modulo no tiene submodulos asociados', 'error');
        } finally {
            setIsLoading(false);
        }
    };

};

export default Submodulos;
