import Vue from "vue";
export class RecipeFormApi extends Vue {
    static createRecipe($http, recipe) {
        return $http.post(`/recipes`, recipe)
            .then(response => response.data)
            .catch(() => null);
    }
    static getRecipesCount($http) {
        return $http.get('/recipes')
            .then(response => response.data.length)
            .catch(() => null);
    }
}
//# sourceMappingURL=recipe-form.api.js.map