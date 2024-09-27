import React from 'react';
import ReactPaginate from 'react-paginate';
import { CIcon } from '@coreui/icons-react';
import { cilArrowLeft, cilArrowRight } from '@coreui/icons';

const PaginationAndSearch = ({
  searchTerm,
  setSearchTerm,
  usuariosPorPagina,
  setUsuariosPorPagina,
  setCurrentPage,
  totalUsuarios,
  currentPage, // Asegúrate de que currentPage se pase como prop
  data = [] // Inicializa data como un array vacío
}) => {
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleUsuariosPorPaginaChange = (e) => {
    setUsuariosPorPagina(Number(e.target.value));
    setCurrentPage(0); // Reiniciar a la primera página
  };

  // Filtrar los datos según la página actual
  const paginatedData = data.slice(currentPage * usuariosPorPagina, (currentPage + 1) * usuariosPorPagina);

  return (
    <div>
      <div className="row" style={{ marginTop: '10px'}}>
        <div className="col-1">
          <select
            id="usuariosPorPagina"
            value={usuariosPorPagina}
            onChange={handleUsuariosPorPaginaChange} // Cambiado aquí
            className="form-control"
          >
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
        <div className="col-10">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className='col-1' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <ReactPaginate
            previousLabel={<><CIcon icon={cilArrowLeft} /></>}
            nextLabel={<><CIcon icon={cilArrowRight} /></>}
            breakLabel={'...'}
            pageCount={Math.ceil(totalUsuarios / usuariosPorPagina)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination justify-content-start align-items-center '}
            activeClassName={'active '}
            pageClassName={'page-item '}
            pageLinkClassName={'page-link bg-secondary text-white'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationAndSearch;