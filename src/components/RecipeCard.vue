<template>
    <div class="card__container">
        <b-card v-bind:title="recipeItem.title"
                v-bind:img-src="recipeItem.thumbnail"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-4">
            <p class="card-text card-body__truncate"
               v-b-tooltip.hover v-bind:title="recipeItem.ingredients">
                <b>Ingredients:</b> {{recipeItem.ingredients}}
            </p>

            <b-col>
                <a v-bind:href="recipeItem.href">
                    Original recipe
                </a>
            </b-col>
            <b-col>
                <b-button v-if="!isFavoriteView"
                          v-bind:disabled="recipeItem.isFavorite"
                          @click="onFavoriteRecipeAdd(recipeItem.recipeId)">
                    {{recipeItem.isFavorite ? 'Already added!' : 'Add to favorite'}}
                </b-button>
                <b-button v-if="isFavoriteView"
                          @click="onFavoriteRecipeRemove(recipeItem.recipeId)">
                    Remove from fav
                </b-button>
            </b-col>
        </b-card>
    </div>
</template>

<script lang="ts">
    import {Vue, Prop, Emit} from "vue-property-decorator";
    import Component from "vue-class-component";
    import {IRecipeOverviewItem} from "@/types";

    @Component({
        props: {
            recipeItem: Object,
            isFavorite: Boolean,
            isFavoriteView: Boolean
            // onFavoriteRecipeAdd: Event
        }
    }) //functional component?
    export default class RecipeCard extends Vue {
        @Prop() recipeItem!: IRecipeOverviewItem;

        @Emit('onFavoriteRecipeAdd')
        onFavoriteRecipeAdd(recipeId: number) {
            return recipeId;
        }

        @Emit('onFavoriteRecipeRemove')
        onFavoriteRecipeRemove(recipeId: number) {
            return recipeId
        }
    }
</script>

<style scoped lang="scss">
    .card__container {
        h4 {
            min-height: 55px;
        }

        img {
            margin-top: 30px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        //overlap bootstrap class
        .card-img-top {
            width: auto;
        }

        .card-body {
            .card-body__truncate {
                width: 250px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

</style>
