import {AxiosStatic} from "axios";
import {IRecipeOverviewItem} from "@/types";

export class OverviewApi {
    public static getRecipes($http: AxiosStatic) {
        return $http.get<IRecipeOverviewItem[]>('/recipes')
            .then(response => response.data)
            .catch((err) => {
                console.log(err.message);

                return [];
            });
    }

    public static getFavoriteRecipes($http: AxiosStatic) {
        return $http.get<IRecipeOverviewItem[]>('/favorites')
            .then(response => response.data)
    }

    public static setFavoriteRecipe($http: AxiosStatic, recipe: IRecipeOverviewItem) {
        return $http.post(`/favorites`, {...recipe, id: recipe.recipeId})
            .then(() => $http.put(`/recipes/${recipe.recipeId}`, recipe))
            .catch(err => console.log(err));
    }

    public static removeFavoriteRecipe($http: AxiosStatic, recipe: IRecipeOverviewItem) {
        return $http.delete(`/favorites/${recipe.recipeId}`)
            .then(() => $http.put(`recipes/${recipe.recipeId}`, {...recipe, isFavorite: false}))
            .then(res => res.data)
            .catch(err => console.log(err));
    }

}