
import Vue from "vue";
import {AxiosStatic} from "axios";
import {IRecipeOverviewItem} from "@/types";

export class RecipeFormApi extends Vue {
    public static createRecipe($http: AxiosStatic, recipe: IRecipeOverviewItem) {
        return $http.post<IRecipeOverviewItem>(`/recipes`, recipe as IRecipeOverviewItem)
            .then(response => response.data)
            .catch(() => null)
    }

    public static getRecipesCount($http: AxiosStatic) {
        return $http.get<IRecipeOverviewItem[]>('/recipes')
            .then(response => response.data.length)
            .catch(() => null)
    }

}