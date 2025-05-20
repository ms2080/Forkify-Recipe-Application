import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _getRecipeMarkup() {
    const page = this._data.currentPage;
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //if 1st page , others
    if (page === 1 && totalPages > 1) {
      return ` <button data-goto="${
        page + 1
      }" class="btn--inline pagination__btn--next">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            <span>Page ${page + 1}</span>
          </button>`;
    }

    //If some other page between

    if (page < totalPages) {
      return ` <button class="btn--inline pagination__btn--prev" data-goto="${
        page - 1
      }" >
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>
          <button  data-goto="${
            page + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
          `;
    }

    //if Last page

    if (page === totalPages && totalPages > 1) {
      return `<button   data-goto="${
        page - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>`;
    }

    //If only 1 page
    return ``;
  }
}

export default new PaginationView();
