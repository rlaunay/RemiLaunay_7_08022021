/**
 * @property {HTMLElement} searchElement
 * @property {Array} allRecipes
 */
export default class Search {

    /**
     *
     * @param {HTMLInputElement} searchElement
     * @param {Array} allRecipes
     */
    constructor(searchElement, allRecipes) {
        this.searchElement = searchElement
        this.allRecipes = allRecipes
    }

}