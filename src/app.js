import FilterBy from "./js/FilterBy"
import Search from "./js/Search"

import createRecipes from "./js/createRecipes"

import recipes from "./data/recipes"

import "./scss/main.scss"

const allRecipes = createRecipes(recipes, document.getElementById('recipes'))

document.querySelectorAll('.filter-by').forEach((filter) => new FilterBy(filter, allRecipes))
new Search(document.querySelector('#search-global'), allRecipes)