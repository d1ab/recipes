<template>
    <b-container>
        <h1>Favorite recipes</h1>

        <b-row>
            <b-col md="4" v-for="(recipeItem, index) of recipeFavItems" :key="index">
                <RecipeCard v-bind:recipe-item="recipeItem"
                            v-bind:is-favorite-view="true"
                            v-on:onFavoriteRecipeRemove="onFavoriteRecipeRemove($event)"/>
            </b-col>

            <b-col v-if="hasNoRecipesToShow()">
                <h3>There is no favorites recipes saved...</h3>
            </b-col>
        </b-row>

    </b-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import RecipeCard from "@/components/RecipeCard.vue";
    import {
        getFavoriteRecipes,
        dispatchFetchFavoriteRecipes,
        dispatchRemoveFavoriteRecipe
    } from "@/store/modules/overview.module";
    import {IRecipeOverviewItem} from "@/types";

    @Component({
        components: {
            RecipeCard
        }
    })
    export default class FavoriteRecipes extends Vue {
        mounted() {
            dispatchFetchFavoriteRecipes(this.$store, this.$axiosHttp)
        }

        get recipeFavItems(): IRecipeOverviewItem[] {
            return getFavoriteRecipes(this.$store);
        }

        hasNoRecipesToShow = () => this.recipeFavItems.length === 0;

        onFavoriteRecipeRemove = (recipeId: number) =>
            dispatchRemoveFavoriteRecipe(this.$store, {$http: this.$axiosHttp, payload: {recipeId}})

    }
</script>
