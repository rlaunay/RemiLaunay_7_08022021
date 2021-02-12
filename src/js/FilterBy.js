/**
 * @property {HTMLElement} filter
 * @property {HTMLInputElement} input
 * @property {HTMLUListElement} items
 * @property {Array<{ isFiltered: boolean,  data, element: HTMLElement}>} allRecipes
 */
export default class FilterBy {
    /**
     *
     * @param {Element} filter
     * @param {Array<{ isFiltered: boolean,  data, element: HTMLElement}>} allRecipes
     */
    constructor(filter, allRecipes) {
        this.filter = filter
        this.inputEl = filter.querySelector('.filter-by__input')
        this.itemsEl = filter.querySelector('.filter-by__items')
        this.allRecipes = allRecipes

        this.createItems()
        this.bindEvents()
    }

    get itemsPerRecipe() {
        const itemType = this.itemsEl.dataset.item
        return this.allRecipes.map((recipe) => {
            let itemsFiltered = [];

            switch (itemType) {
                case 'ingredients':
                    itemsFiltered = recipe.data[itemType].map(i => i.ingredient)
                    break
                case 'appliance':
                    itemsFiltered = [recipe.data[itemType]]
                    break
                case 'utensils':
                    itemsFiltered = recipe.data[itemType]
                    break
                default:
                    break
            }

            return {
                id: recipe.data.id,
                items: itemsFiltered.map(i => i.toLowerCase())
            }
        })
    }

    bindEvents() {
        this.filter.addEventListener('click', () => {
            this.filter.classList.toggle('open')
            this.inputEl.focus()
        })
    }

    createItems() {
        const allItems = [...new Set(this.itemsPerRecipe.reduce((acc, curr) => {
            return [...acc, ...curr.items]
        }, []))]
        console.log(allItems)
    }
}