const axios = require('axios');
const _isEmpty = require('lodash/isEmpty');

const fs = require('fs');
const dbMockPath = './recipes-db.json'
const recipesDbMock = require('./recipes-db');

axios.get('http://www.recipepuppy.com/api/')
    .then(res => {
        if (_isEmpty(recipesDbMock.recipes)) {
            recipesDbMock.recipes = [];
            const remappedRecipes = _assignRecipeIds(res.data.results);

            for (let recipe of remappedRecipes) {
                recipesDbMock.recipes.push(recipe);
            }
        }

        fs.writeFile(dbMockPath, JSON.stringify(recipesDbMock, null, 2), (err) => {
            if (err) {
                return console.log(err);
            }

            const jsonServer = require('json-server');
            const server = jsonServer.create();
            const router = jsonServer.router('recipes-db.json');
            const middlewares = jsonServer.defaults()

            console.log(`writing to ${dbMockPath}`);

            server.use(middlewares);
            server.use(router);


            server.listen(3000, () => {
                console.log('JSON Server is running')
            })
        });
    })
    .catch(err => {
        console.log(err)
    });

function _assignRecipeIds(recipes) {
    return recipes.map((recipes, index) => {
        return {
            ...recipes,
            id: index + 1,
            isFavorite: false,
            recipeId: index + 1
        };
    })
}