import Vue from "vue";
export class OverviewApi extends Vue {
    static getRecipes($http) {
        return $http.get('/recipes')
            .then(response => response.data)
            .catch((err) => {
            console.log(err.message);
            return [];
        });
    }
    static getFavoriteRecipes($http) {
        return $http.get('/favorites')
            .then(response => response.data);
    }
    static setFavoriteRecipe($http, recipe) {
        return $http.post(`/favorites`, { ...recipe, id: recipe.recipeId })
            .then(() => $http.put(`/recipes/${recipe.recipeId}`, recipe))
            .catch(err => console.log(err));
    }
    static removeFavoriteRecipe($http, recipe) {
        return $http.delete(`/favorites/${recipe.recipeId}`)
            .then(() => $http.put(`recipes/${recipe.recipeId}`, { ...recipe, isFavorite: false }))
            .then(res => res.data)
            .catch(err => console.log(err));
    }
}
//# sourceMappingURL=overview-api.js.map