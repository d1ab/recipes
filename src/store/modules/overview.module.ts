import {AxiosStatic} from "axios";
import {ActionContext} from "vuex";
import {IAppState, IRecipeForm, IRecipeOverview, IRecipeOverviewItem, IRecipesPayload} from "@/types";
import {getStoreAccessors} from "vuex-typescript";
import {OverviewApi} from "@/api/overview-api"

import _isEmpty from "lodash/isEmpty";
import {RecipeFormApi} from "@/api/recipe-form.api";

import _isUndefined from "lodash/isUndefined";

type RecipesContext = ActionContext<IRecipeOverview, IAppState>;

const INITIAL_STATE: IRecipeOverview = {
    overviewItems: [],
    favoriteRecipes: []
};

export const recipesOverview = {
    namespaced: true,
    state: INITIAL_STATE,
    getters: {
        getOverviewItems: (state: IRecipeOverview) => state.overviewItems,

        getFavoriteRecipes: (state: IRecipeOverview) => state.favoriteRecipes,

        getRecipeById: (state: IRecipeOverview) => {
            return (recipeId: number) => state.overviewItems
                .filter(recipe => recipe.recipeId === recipeId);
        }
    },
    mutations: {
        reset(state: IRecipeOverview) {
            state.overviewItems = [];
            state.favoriteRecipes = [];
        },

        fetchRecipesSuccess(state: IRecipeOverview, items: IRecipeOverviewItem[]) {
            items.forEach(recipe => {
                if (_recipeAlreadyExists(state.overviewItems, recipe)) {
                    return;
                }

                state.overviewItems.push(recipe)
            });
        },

        fetchFavoritesRecipesSuccess(state: IRecipeOverview, items: IRecipeOverviewItem[]) {
            items.forEach(recipe => {
                state.favoriteRecipes.push(recipe)
            });
        },

        addToFavorites(state: IRecipeOverview, favoriteRecipe: IRecipeOverviewItem) {
            state.favoriteRecipes.push(favoriteRecipe);

            _mutateRecipeItemFavoriteState(state.overviewItems, favoriteRecipe.recipeId, true);

            function _mutateRecipeItemFavoriteState(recipes: IRecipeOverviewItem[], recipeId: number, isFavorite: boolean) {
                recipes.forEach(item => {
                    if (item.recipeId === recipeId) {
                        item.isFavorite = isFavorite;
                    }
                });
            }
        },

        removeFromFavorites(state: IRecipeOverview, favoriteRecipeId: number) {
            const itemIndex = state.favoriteRecipes.findIndex(item => item.recipeId === favoriteRecipeId);

            if (_isUndefined(itemIndex)) {
                console.error(`Couldn't remove item from favorites. 
                Recipe with id ${favoriteRecipeId} in the store doesn't exist!`);

                return;
            }

            _mutateRecipeItemFavoriteState(state.overviewItems, favoriteRecipeId, false);
            _removeFavoriteRecipe(state.favoriteRecipes, itemIndex);
        },


        createRecipe(state: IRecipeOverview, recipe: IRecipeOverviewItem) {
            state.overviewItems.push(recipe);
        }
    },
    actions: {
        async getRecipes(context: RecipesContext, $http: AxiosStatic) {
            const recipes = await OverviewApi.getRecipes($http);

            commitFetchRecipesSuccess(context, recipes as IRecipeOverviewItem[]);
        },

        async getFavoriteRecipes(context: RecipesContext, $http: AxiosStatic) {
            let favoriteRecipes = getters.getFavoriteRecipes(context.state);

            if (_isEmpty(favoriteRecipes)) {
                favoriteRecipes = await OverviewApi.getFavoriteRecipes($http);
                commitFetchFavoriteRecipes(context, favoriteRecipes);
            }
        },

        addFavoriteRecipe(context: RecipesContext, payloadWrapper: IRecipesPayload<IRecipeOverviewItem>) {
            const [favoriteRecipe] = getters.getRecipeById(context.state)(payloadWrapper.payload.recipeId)
                .map(recipe => ({...recipe, isFavorite: true}));

            commitAddToFavoriteRecipes(context, favoriteRecipe);
            OverviewApi.setFavoriteRecipe(payloadWrapper.$http, favoriteRecipe)
        },

        async removeFavoriteRecipe(context: RecipesContext, payloadWrapper: IRecipesPayload<IRecipeOverviewItem>) {
            const [recipeToRemove] = getters.getRecipeById(context.state)(payloadWrapper.payload.recipeId);
            await OverviewApi.removeFavoriteRecipe(payloadWrapper.$http, recipeToRemove);

            commitRemoveFromFavorites(context, payloadWrapper.payload.recipeId)
        },

        async createRecipe(context: RecipesContext, payloadWrapper: IRecipesPayload<IRecipeForm>) {
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

function _createRecipe(params: IRecipeForm, id: number) {
    return {
        title: params.title,
        isFavorite: false,
        ingredients: params.ingredients,
        recipeId: id + 1,
        href: '',
        thumbnail: 'http://img.recipepuppy.com/9.jpg'
    } as IRecipeOverviewItem;
}

function _removeFavoriteRecipe(favoriteRecipes: IRecipeOverviewItem[], listIndex: number) {
    favoriteRecipes.splice(listIndex, 1);
}

function _mutateRecipeItemFavoriteState(recipes: IRecipeOverviewItem[], recipeId: number, isFavorite: boolean) {
    recipes.forEach(item => {
        if (item.recipeId === recipeId) {
            item.isFavorite = isFavorite;
        }
    });
}

function _recipeAlreadyExists(overviewItems: IRecipeOverviewItem[], recipe: IRecipeOverviewItem) {
    return overviewItems.some(item => item.recipeId === recipe.recipeId);
}

const {commit, read, dispatch} = getStoreAccessors<IRecipeOverview, IAppState>("recipesOverview");

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