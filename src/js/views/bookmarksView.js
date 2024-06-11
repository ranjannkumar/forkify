import view from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends view{
  _parentElement=document.querySelector('.bookmarks__list');
  _errorMessage='No bookmarks yet. Find a niche recipe and bookmark it;)';
  _message='';

  addHandlerRender(handler){
    window.addEventListener('load',handler);
  }

  _generateMarkup(){
    return this._data.map(bookmark=>previewView.render(bookmark,false)).join('');

  }
}
export default new BookmarksView();