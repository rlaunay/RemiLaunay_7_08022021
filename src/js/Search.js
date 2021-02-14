/**
 * @property {HTMLElement} searchElement
 * @property {Array<{ isFiltered: boolean, tag: string[], data, element: HTMLElement}>} allRecipes
 */
export default class Search {

    /**
     *
     * @param {HTMLInputElement} searchElement
     * @param {Array<{ isFiltered: boolean, tag: string[], data, element: HTMLElement}>} allRecipes
     */
    constructor(searchElement, allRecipes) {
        this.searchElement = searchElement
        this.allRecipes = allRecipes
        this.delay = null

        this.bindEvents()
    }

    bindEvents() {
        this.searchElement.addEventListener('input', (e) => {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }
            this.delay = setTimeout(() => {
                this.search(e.target.value)
            }, 1000)
        })
    }

    /**
     *
     * @param {string} searchReq
     */
    search(searchReq) {

        const regex = new RegExp(`^(.*)(${searchReq})(.*)$`, 'i')
        console.log(regex)

        this.allRecipes.forEach(recipe => {
            if (
                !recipe.data.description.match(regex) &&
                !recipe.data.name.match(regex) &&
                !recipe.data.ingredients.find(({ ingredient }) => ingredient.match(regex))
            ) {
                recipe.element.classList.add('hide')
                recipe.isFiltered = true
            } else {
                if (recipe.isFiltered) {
                    recipe.isFiltered = false

                    if (recipe.tag) recipe.element.classList.remove('hide')
                }
            }
        })
    }
}