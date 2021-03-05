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

        const searchWordsChecker = this.checkRecipe(searchReq.toLowerCase().split(' '))

        this.allRecipes.forEach(recipe => {
            if (
                !searchWordsChecker(recipe)
            ) {
                recipe.element.classList.add('hide')
                recipe.isFiltered = true
            } else {
                recipe.isFiltered = false
                if (recipe.tag.size === 0) recipe.element.classList.remove('hide')
            }
        })
    }

    /**
     *
     * @param {String[]} searchTab
     */
    checkRecipe(searchTab) {

        return (recipe) => {
            const res = searchTab.map(search => {
                return recipe.data.description.toLowerCase().includes(search) ||
                recipe.data.name.toLowerCase().includes(search) ||
                recipe.data.ingredients.some(({ ingredient }) => ingredient.toLowerCase().includes(search))
            })

            return res.every(r => r)
        }
    }
}