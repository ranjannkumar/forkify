import view from './view.js';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE} from '../config.js';

resultsPerPage=RES_PER_PAGE;



class paginationView extends view{
  _parentElement=document.querySelector('.pagination');

  addHandlerClick(handler){
    this._parentElement.addEventListener('click',function(e){
      const btn=e.target.closest('.btn--inline');

      if(!btn)return;

      const goToPage=+btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup(){
    const curPage=this._data.page;
    // console.log(curPage);
    // console.log(this._data.results.length);
    // console.log(resultsPerPage);

    const numPages=Math.ceil(this._data.results.length/resultsPerPage);
    //page 1, and there are other pages
    if(curPage===1 && numPages>1){
      return `
      <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
      <span>Page  ${curPage+1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
    }




    //last page
    if(curPage===numPages && numPages>1){
      return `
      <button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage-1}</span>
          </button>
      `;
    }

    //oyher page
    if(curPage<numPages){
      return `
      <button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage-1}</span>
    </button>
    <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
    <span>Page  ${curPage+1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>
      `;
    }
    // page1,and there are no other pages
    return '';

  }
}
export default new paginationView();