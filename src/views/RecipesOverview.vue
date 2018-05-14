<template>
    <b-container>
        <h1>Recipe list</h1>

        <b-row>
            <b-col md="4" v-for="(recipeItem, index) of recipeItems" :key="index">
                <RecipeCard v-bind:recipe-item="recipeItem"
                            v-on:onFavoriteRecipeAdd="onFavoriteRecipeAdd($event)"/>
            </b-col>

            <b-col v-if="this.hasNoRecipesToShow()">
                <h3>No recipes to show...</h3>
            </b-col>
        </b-row>

    </b-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {
        dispatchFetchRecipes,
        getRecipeItems,
        dispatchAddFavoriteRecipe
    } from "@/store/modules/overview.module";
    import {IRecipeOverviewItem} from "../types";
    import BootstrapVue from "bootstrap-vue";
    import RecipeCard from "@/components/RecipeCard.vue";

    Vue.use(BootstrapVue);

    @Component({
        components: {RecipeCard}
    })
    export default class RecipesOverview extends Vue {
        mounted() {
            dispatchFetchRecipes(this.$store, this.$axiosHttp);
        }

        get recipeItems(): IRecipeOverviewItem[] {
            return getRecipeItems(this.$store);
        }

        onFavoriteRecipeAdd(recipeId: number) {
            dispatchAddFavoriteRecipe(this.$store, {$http: this.$axiosHttp, payload: {recipeId}});
        }

        hasNoRecipesToShow = () => this.recipeItems.length === 0;

    }
</script>
