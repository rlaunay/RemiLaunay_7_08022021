/**
 * @property {HTMLElement} searchElement
 * @property {{data: *, isFiltered: boolean, tag: Set<string>, element: HTMLElement}[]} allRecipes
 */
export default class Search {

    /**
     *
     * @param {HTMLInputElement} searchElement
     * @param {{data: *, isFiltered: boolean, tag: Set<string>, element: HTMLElement}[]} allRecipes
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
                console.time('searchTimer')
                this.search(e.target.value)
                console.timeEnd('searchTimer')
            }, 500)
        })
    }

    /**
     *
     * @param {string} searchReq
     */
    search(searchReq) {

        const regex = new RegExp(`^(.*)(${searchReq.split(' ').join('(.*)')})(.*)$`, 'i')

        this.allRecipes.forEach(recipe => {
            if (
                !recipe.data.description.match(regex) &&
                !recipe.data.name.match(regex) &&
                !recipe.data.ingredients.some(({ ingredient }) => ingredient.match(regex))
            ) {
                recipe.element.classList.add('hide')
                recipe.isFiltered = true
            } else {
                recipe.isFiltered = false
                if (recipe.tag.size === 0) recipe.element.classList.remove('hide')
            }
        })
    }
}