import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Jonas Schmedtmann
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._getRecipeMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._getRecipeMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newEle = Array.from(newDOM.querySelectorAll('*'));
    const oldEle = Array.from(this._parentElement.querySelectorAll('*'));

    newEle.forEach((el, i) => {
      const currentEl = oldEle[i];

      //Update Changed TEXT content
      if (
        !el.isEqualNode(currentEl) &&
        el.firstChild?.nodeValue.trim() !== ''
      ) {
        currentEl.textContent = el.textContent;
      }

      //Update Changed ATTRIBUTES content
      if (!el.isEqualNode(currentEl)) {
        Array.from(el.attributes).forEach(attr =>
          currentEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    this._clear();
    const markup = `<div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMsg) {
    const markup = `<div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSuccess(message = this._successMsg) {
    const markup = `<div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
