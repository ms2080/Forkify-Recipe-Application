import * as model from './model.js';
import recipeView from './views/recipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//polyfilling everything else
import 'core-js/stable';

//polyfilling async /await
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.searchRecipePageCount());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearch = async function (query) {
  try {
    //Render Spinner

    resultsView.renderSpinner();

    //Get query
    const query = searchView.getQuery();
    if (!query) return;
    //Seach Recipes
    await model.searchRecipe(query);
    //Render Recipes
    resultsView.render(model.searchRecipePageCount());
    //Show Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log('query is empty' + err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.searchRecipePageCount(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateRecipe(servings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(data);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderSuccess();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};
//Event Handling with Publisher-Subscriber Pattern

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome to Forkify Application !');
};
init();
