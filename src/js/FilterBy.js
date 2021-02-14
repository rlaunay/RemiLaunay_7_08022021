/**
 * @property {HTMLElement} filter
 * @property {HTMLInputElement} input
 * @property {HTMLUListElement} items
 * @property {Array<{ isFiltered: boolean, tag: string[], data, element: HTMLElement}>} allRecipes
 */
import recipes from "../data/recipes";

export default class FilterBy {
    /**
     *
     * @param {Element} filter
     * @param {Array<{ isFiltered: boolean, tag: string[], data, element: HTMLElement}>} allRecipes
     */
    constructor(filter, allRecipes) {
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)

        this.filter = filter
        this.inputEl = filter.querySelector('.filter-by__input')
        this.itemsEl = filter.querySelector('.filter-by__items')
        this.allRecipes = allRecipes
        this.logoEl = filter.querySelector('.filter-by__logo')

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
        this.filter.addEventListener('click', this.open)

        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                this.close()
            }
        })
    }

    close() {
        this.filter.classList.remove('open')
    }

    open(e) {
        if (this.logoEl.contains(e.target) && this.filter.classList.contains('open')) {
            return this.close()
        }
        this.filter.classList.add('open')

        if (this.allRecipes.find((recipe) => recipe.isFiltered)) {
            this.createItems()
        }
    }

    createItems() {
        this.itemsEl.innerHTML = ''
        const allItems = [...new Set(this.itemsPerRecipe.reduce((acc, curr) => {
            return [...acc, ...curr.items]
        }, []))]
        allItems.forEach(item => {
            const itemEl = document.createElement('li')
            itemEl.innerText = item
            this.itemsEl.appendChild(itemEl)
        })
    }

    addTag(tagName) {

    }
}