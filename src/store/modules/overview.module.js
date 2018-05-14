import { getStoreAccessors } from "vuex-typescript";
import { OverviewApi } from "@/api/overview-api";
import _isEmpty from "lodash/isEmpty";
import { RecipeFormApi } from "@/api/recipe-form.api";
import _isUndefined from "lodash/isUndefined";
const INITIAL_STATE = {
    overviewItems: [],
    favoriteRecipes: []
};
export const recipesOverview = {
    namespaced: true,
    state: INITIAL_STATE,
    getters: {
        getOverviewItems: (state) => state.overviewItems,
        getFavoriteRecipes: (state) => state.favoriteRecipes,
        getRecipeById: (state) => {
            return (recipeId) => state.overviewItems
                .filter(recipe => recipe.recipeId === recipeId);
        }
    },
    mutations: {
        reset(state) {
            state.overviewItems = [];
            state.favoriteRecipes = [];
        },
        fetchRecipesSuccess(state, items) {
            items.forEach(recipe => {
                if (_recipeAlreadyExists(state.overviewItems, recipe)) {
                    return;
                }
                state.overviewItems.push(recipe);
            });
        },
        fetchFavoritesRecipesSuccess(state, items) {
            items.forEach(recipe => {
                state.favoriteRecipes.push(recipe);
            });
        },
        addToFavorites(state, favoriteRecipe) {
            state.favoriteRecipes.push(favoriteRecipe);
            _mutateRecipeItemFavoriteState(state.overviewItems, favoriteRecipe.recipeId, true);
            function _mutateRecipeItemFavoriteState(recipes, recipeId, isFavorite) {
                recipes.forEach(item => {
                    if (item.recipeId === recipeId) {
                        item.isFavorite = isFavorite;
                    }
                });
            }
        },
        removeFromFavorites(state, favoriteRecipeId) {
            const itemIndex = state.favoriteRecipes.findIndex(item => item.recipeId === favoriteRecipeId);
            if (_isUndefined(itemIndex)) {
                console.error(`Couldn't remove item from favorites. 
                Recipe with id ${favoriteRecipeId} in the store doesn't exist!`);
                return;
            }
            _mutateRecipeItemFavoriteState(state.overviewItems, favoriteRecipeId, false);
            _removeFavoriteRecipe(state.favoriteRecipes, itemIndex);
        },
        createRecipe(state, recipe) {
            state.overviewItems.push(recipe);
        }
    },
    actions: {
        async getRecipes(context, $http) {
            const recipes = await OverviewApi.getRecipes($http);
            commitFetchRecipesSuccess(context, recipes);
        },
        async getFavoriteRecipes(context, $http) {
            let favoriteRecipes = getters.getFavoriteRecipes(context.state);
            if (_isEmpty(favoriteRecipes)) {
                favoriteRecipes = await OverviewApi.getFavoriteRecipes($http);
                commitFetchFavoriteRecipes(context, favoriteRecipes);
            }
        },
        addFavoriteRecipe(context, payloadWrapper) {
            const [favoriteRecipe] = getters.getRecipeById(context.state)(payloadWrapper.payload.recipeId)
                .map(recipe => ({ ...recipe, isFavorite: true }));
            commitAddToFavoriteRecipes(context, favoriteRecipe);
            OverviewApi.setFavoriteRecipe(payloadWrapper.$http, favoriteRecipe);
        },
        async removeFavoriteRecipe(context, payloadWrapper) {
            const [recipeToRemove] = getters.getRecipeById(context.state)(payloadWrapper.payload.recipeId);
            await OverviewApi.removeFavoriteRecipe(payloadWrapper.$http, recipeToRemove);
            commitRemoveFromFavorites(context, payloadWrapper.payload.recipeId);
        },
        async createRecipe(context, payloadWrapper) {
            const recipesCount = await RecipeFormApi.getRecipesCount(payloadWrapper.$http);
            if (recipesCount === null) {
                console.error("Unable to commit recipe");
                return;
            }
            const recipe = _createRecipe(payloadWrapper.payload, recipesCount);
            await RecipeFormApi.createRecipe(payloadWrapper.$http, recipe);
            commitCreateRecipe(context, recipe);
        }
    }
};
function _createRecipe(params, id) {
    return {
        title: params.title,
        isFavorite: false,
        ingredients: params.ingredients,
        recipeId: id + 1,
        href: '',
        thumbnail: 'http://img.recipepuppy.com/9.jpg'
    };
}
function _removeFavoriteRecipe(favoriteRecipes, listIndex) {
    favoriteRecipes.splice(listIndex, 1);
}
function _mutateRecipeItemFavoriteState(recipes, recipeId, isFavorite) {
    recipes.forEach(item => {
        if (item.recipeId === recipeId) {
            item.isFavorite = isFavorite;
        }
    });
}
function _recipeAlreadyExists(overviewItems, recipe) {
    return overviewItems.some(item => item.recipeId === recipe.recipeId);
}
const { commit, read, dispatch } = getStoreAccessors("recipesOverview");
const getters = recipesOverview.getters;
export const getRecipeItems = read(getters.getOverviewItems);
export const getFavoriteRecipes = read(getters.getFavoriteRecipes);
const actions = recipesOverview.actions;
export const dispatchFetchRecipes = dispatch(actions.getRecipes);
export const dispatchAddFavoriteRecipe = dispatch(actions.addFavoriteRecipe);
export const dispatchFetchFavoriteRecipes = dispatch(actions.getFavoriteRecipes);
export const dispatchRemoveFavoriteRecipe = dispatch(actions.removeFavoriteRecipe);
export const dispatchCreateRecipe = dispatch(actions.createRecipe);
const mutations = recipesOverview.mutations;
export const commitFetchRecipesSuccess = commit(mutations.fetchRecipesSuccess);
export const commitFetchFavoriteRecipes = commit(mutations.fetchFavoritesRecipesSuccess);
export const commitCreateRecipe = commit(mutations.createRecipe);
export const commitReset = commit(mutations.reset);
export const commitAddToFavoriteRecipes = commit(mutations.addToFavorites);
export const commitRemoveFromFavorites = commit(mutations.removeFromFavorites);
//# sourceMappingURL=overview.module.js.map