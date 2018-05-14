import Vue from "vue";
import Router from "vue-router";
import RecipesOverview from "./views/RecipesOverview.vue";
import FavoriteRecipes from "./views/FavoriteRecipes.vue";
import CreateRecipe from "./views/CreateRecipe.vue";
import Login from "./views/Login.vue";
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: "/",
            name: "overview",
            component: RecipesOverview
        },
        {
            path: "/favs",
            name: "favs",
            component: FavoriteRecipes
        },
        {
            path: "/add",
            name: "add",
            component: CreateRecipe
        },
        {
            path: "/login",
            name: "login",
            component: Login
        }
    ]
});
//# sourceMappingURL=router.js.map