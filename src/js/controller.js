import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';




import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

// if(module.hot){
//   module.hot.accept();
// }


const controlRecipes=async function(){
  try{
    const id=window.location.hash.slice(1);

    if(!id)return;

    recipeView.renderSpinner();

    //0) update results view yo mark selected search result
    resultsView.update(model.getSearchResultPage());
        //3)updating bookmarks view
        bookmarksView.update(model.state.bookmarks);

    //1) loading recipe
     await model.loadRecipe(id);
    //2) Rendering recipe
    recipeView.render(model.state.recipe);

  }catch (err){
    recipeView.renderError();
    console.error(err)
  }
};

const controlSearchResults=async function(){
  try{
    resultsView.renderSpinner();
    //1) Get search query
    const query=searchView.getQuery();
    if(!query)return;
    //2)load search results
    await model.loadSearchResults(query);
    //3) render results
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // 4)render initial pagination buttons
    paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
};

const controlPagination=function(goToPage){

    //3) render new results

  resultsView.render(model.getSearchResultPage(goToPage));

    // 4)rendernew pagination buttons

  paginationView.render(model.state.search);


};

const controlServings=function(newServings){
  //update the recipe servings(in state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);


};

const controlAddBookmark= function(){
  // 1)add/remove bookmark
  if(!model.state.recipe.bookmarked)
  model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe=async function(newRecipe){
 try{
  //show loading spinner
  addRecipeView.renderSpinner();
  //upload the new recipe data
   await model.uploadRecipe(newRecipe);
   console.log(model.state.recipe);

   // Rendr Recipe
   recipeView.render(model.state.recipe);

   //success message
   addRecipeView.renderMessage();

   //render bookmark view
   bookmarksView.render(model.state.bookmarks);

   //change id in url*
   window.history.pushState(null,'',`#${model.state.recipe.id}`);

   // close form window
   setTimeout(function(){
    // addRecipeView.toggleWindow();
   },MODAL_CLOSE_SEC * 1000);
 }catch(err){
  console.error('😤😤',err);
  addRecipeView.renderError(err.message);
 }

};


const newFeture=function(){
  console.log('welcome to the application');
};


const init=function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeture();
};
init();





/* 
controlRecipes function

The controlRecipes function is responsible for the following:

Retrieving the recipe ID from the URL hash.
Checking if the ID is valid; if not, it exits early.
Rendering a loading spinner to indicate that data is being fetched.
Calling the loadRecipe function to fetch the recipe data from the API.
Rendering the fetched recipe data in the UI.
Handling any errors that occur during this process and displaying an alert with the error message.
This function integrates various parts of the application, coordinating between the model (data fetching and state management) and the view (UI rendering).

*/