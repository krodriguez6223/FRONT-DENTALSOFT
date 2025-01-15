import React from "react";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilSettings, cilWallet, cilBasket, cilCart, cilCalendar, cilDollar, cilMoney } from "@coreui/icons";
import { getAllPermissions } from '../../middlewares/permissions';
import { useDispatch } from 'react-redux';
import { setActiveModule } from '../../redux/slices/navigationSlice';


const Card = ({ title, route, bg, icon, onModuleSelect }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onModuleSelect(title);
    navigate(route);
  };

  return (
    <div
      className="dashboard-card"
      style={{ backgroundColor: bg }}
      onClick={handleClick}
    >
      <div className="dashboard-icon-column">
        <div className="dashboard-icon-container">
          <CIcon icon={icon} className="dashboard-icon d-none d-sm-block" size="xl" />
          <CIcon icon={icon} className="dashboard-icon d-block d-sm-none" size="sm" />
        </div>
      </div>

      <div className="dashboard-text-column">
        <div className="dashboard-title">{title}</div>
        <div className="dashboard-subtitle">
          <span>Not in Load </span>
          <span className="dashboard-stat">8</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [modulos, setModulos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  // Mapeo específico de colores por nombre de módulo
  const coloresPorModulo = {
    'ADMINISTRACION': '#8b84ff',    
    'CARTERA': '#ff9955',         
    'INVENTARIO': '#3da352',      
    'VENTAS': '#ff6b6b',          
    'AGENDAMIENTO': '#158384',     
    'COMPRAS': '#e04ff9',         
    'GASTOS': '#0381a1',          
  };

  const colorPorDefecto = '#6c63ff';

  // Agregar el mapeo de íconos por módulo
  const iconosPorModulo = {
    'ADMINISTRACION': cilSettings,    
    'CARTERA': cilWallet,            
    'INVENTARIO': cilBasket,         
    'VENTAS': cilCart,              
    'AGENDAMIENTO': cilCalendar,    
    'COMPRAS': cilDollar,           
    'GASTOS': cilMoney,             
  };

  
  const fetchModulos = async () => {
    setIsLoading(true);
    try {
      const userPermissions = getAllPermissions();
      
      const modulosPermitidos = Object.values(userPermissions
        .filter(permission => permission.read === true)
        .reduce((acc, permission) => ({
          ...acc,
          [permission.id_modulo]: {
            id: permission.id_modulo,
            nombre: permission.nombre_modulo,
            ruta: permission.ruta
          }
        }), {}));

      setModulos(modulosPermitidos);
    } catch (error) {
      mostrarNotificacion('Error al cargar módulos: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModuleSelect = (moduleName) => {
    dispatch(setActiveModule(moduleName));
  };

  React.useEffect(() => {
    fetchModulos();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card-container">
        {isLoading ? (
          <p>Cargando módulos...</p>
        ) : (
          modulos.map((modulo) => (
            <Card
              key={modulo.id}
              title={modulo.nombre}
              route={`/${modulo.ruta}`}
              bg={coloresPorModulo[modulo.nombre] || colorPorDefecto}
              icon={iconosPorModulo[modulo.nombre] || cilPencil}
              onModuleSelect={handleModuleSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
