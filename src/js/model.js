import {async} from 'regenerator-runtime';
import { API_URL,RES_PER_PAGE,KEY } from './config.js';
// import { getJSON ,sendJSON} from './helper.js';
import { AJAX } from './helper.js';




export const state={
  recipe:{},
  search:{
    query:'',
    results:[],
    page:1,
    reultsPerPage:RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject=function(data){
  const {recipe}=data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key:recipe.key}),
  };
}

//loadRecipe function
//This function loadRecipe fetches a recipe from the Forkify API using the provided id, processes the received data, handles potential errors, stores the relevant recipe information in a state.recipe object, and logs it to the console. The function uses modern JavaScript features like async/await, destructuring, and template literals for clean and readable code.
export const loadRecipe=async function(id){
  try{
    const data=await AZAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe=createRecipeObject(data);



   if(state.bookmarks.some(bookmark=>bookmark.id===id))
    state.recipe.bookmarked=true;
  else state.recipe.bookmarked=false;

console.log(state.recipe);
  } catch(err){
    // temp error handling
    console.error(`${err}😤😤😤😤`);
    throw err;
  }
};

export const loadSearchResults=async function(query){
  try{
    state.search.query=query;
    const data=await AZAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.results=data.data.recipes.map(rec=>{
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key:rec.key}),
      };
    });
    state.search.page=1;

  }catch(err){
    console.error(`${err}😤😤😤😤`);
    throw err;
  }
};

export const getSearchResultPage=function(page=state.search.page){
  state.search.page=page;
  const start=(page-1)*state.search.reultsPerPage; //0;
  const end=page*state.search.reultsPerPage; //9
  return state.search.results.slice(start,end);
};

export const updateServings=function(newServings){
  state.recipe.ingredients.forEach(ing => {
    ing.quantity=(ing.quantity*newServings)/state.recipe.servings;
    // newqt=oldqt*newserving/oldserving
  });
  state.recipe.servings=newServings;
};

const persistBookmarks=function(){
  localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
};

export const addBookmark=function(recipe){
  // Add bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as bookmarked
  if(recipe.id===state.recipe.id)state.recipe.bookmarked=true;
persistBookmarks();
};

export const deleteBookmark=function(id){
  //delete bookmark
  const index=state.bookmarks.findIndex(el=>el.id===id);
  state.bookmarks.splice(index,1);

  //mark current recipe as NOT bookmark
  if(id===state.recipe.id)state.recipe.bookmarked=false;
  persistBookmarks();
};

const init=function(){
  const storage=localStorage.getItem('bookmarks');
  if(storage)state.bookmarks=JSON.parse(storage);
};
init();

const clearBookmarks=function(){
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe=async function(newRecipe){ 
   try{
        const ingredients=Object.entries(newRecipe)
       .filter(entry=>entry[0].startsWith('ingredient') && entry[1]!=='')
        .map(ing=>{
           const ingArr=ing[1].split(',').map(el=>el.trim());
          //  const ingArr=ing[1].replaceAll(' ','').split(',');

           if(ingArr.length !==3)
              throw new Error(
               'Wrong ingredient format! Please use the correct format :)'
              );
           const [quantity,unit,description]=ingArr;
           return {quantity: quantity? +quantity:null,unit,description};
         });
         const recipe={
          title:newRecipe.title,
          source_url: newRecipe.sourceUrl,
          image_url: newRecipe.image,
          publisher: newRecipe.publisher,
          cooking_time: +newRecipe.cookingTime,
          servings: +newRecipe.servings,
          ingredients,
        };

      const data= await AZAX(`${API_URL}?key=${KEY}`,recipe);
    state.recipe=createRecipeObject(data);
    addBookmark(state.recipe);

     } catch(err){
          throw err;
        }
};
//96e2c7b3-aa3c-4e01-9832-68d248de3f95



