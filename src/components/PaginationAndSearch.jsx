import React from 'react';
import ReactPaginate from 'react-paginate';
import { CIcon } from '@coreui/icons-react';
import { cilArrowLeft, cilArrowRight } from '@coreui/icons';

const PaginationAndSearch = ({
  display,
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
      <div className="row" style={{ marginTop: '8px', marginBottom: display == true ? '5px' : '0px' }}>
        <div className="col-1" style={{ display: display == true ? 'none' : 'normal' }}>
          <select
            id="usuariosPorPagina"
            value={usuariosPorPagina}
            onChange={handleUsuariosPorPaginaChange} // Cambiado aquí
            className="form-control custom-select"
          >
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
        <div className="col-10">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className='col-1' style={{ display: display == true ? 'none' : 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <ReactPaginate
            previousLabel={<><CIcon icon={cilArrowLeft} /></>}
            nextLabel={<><CIcon icon={cilArrowRight} /></>}
            breakLabel={'...'}
            pageCount={Math.ceil(totalUsuarios / usuariosPorPagina)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination justify-content-start align-items-center mb-2'}
            activeClassName={'active'}
            pageClassName={'page-item custom-page-item'}
            pageLinkClassName={'page-link custom-page-link'}
            previousClassName={'page-item custom-prev-item'}
            previousLinkClassName={'page-link custom-prev-link'}
            nextClassName={'page-item custom-next-item'}
            nextLinkClassName={'page-link custom-next-link'}
            breakClassName={'page-item custom-break-item'}
            breakLinkClassName={'page-link custom-break-link'}
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationAndSearch;