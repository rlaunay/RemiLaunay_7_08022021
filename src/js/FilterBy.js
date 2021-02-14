import closeSvg from './../assets/cross.svg'

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
        this.tagsEl = document.querySelector('.tags')

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

        this.inputEl.addEventListener('input', this.search)

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
        if (this.filter.classList.contains('open')) {
            if (this.logoEl.contains(e.target)) {
                return this.close()
            }
            return
        }
        this.filter.classList.add('open')

        if (this.allRecipes.find((recipe) => recipe.isFiltered)) {
            this.createItems()
        }
    }

    createItems() {
        this.itemsEl.innerHTML = ''
        const allItems = [...new Set(this.itemsPerRecipe.reduce((acc, curr) => {
            const recipe = this.allRecipes.find((r) => r.data.id === curr.id)
            if (recipe.isFiltered || recipe.tag.size !== 0) return [...acc]
            return [...acc, ...curr.items]
        }, []))]

        allItems.forEach(item => {
            const itemEl = document.createElement('li')
            itemEl.innerText = item
            itemEl.addEventListener('click', (e) => {
                this.addTag(e.target.innerText)
            })
            this.itemsEl.appendChild(itemEl)
        })
    }

    search(e) {

    }

    addTag(tagName) {

        if (this.allRecipes.find(r => r.tag.has(tagName))) return

        this.itemsPerRecipe.forEach(itemRecipe => {
            if(!itemRecipe.items.includes(tagName)) {
                const recipe = this.allRecipes.find(r => r.data.id === itemRecipe.id)
                recipe.tag.add(tagName)
                recipe.element.classList.add('hide')
            }
        })

        const tag = document.createElement('div')
        tag.classList.add('tag')
        if (this.filter.classList.length === 3) {
            tag.classList.add(this.filter.classList[1])
        }

        const p = document.createElement('p')
        p.classList.add('tag__content')
        p.innerText = tagName

        const logo = document.createElement('img')
        logo.src = closeSvg
        logo.alt = 'close icon'
        logo.classList.add('tag__logo')
        logo.addEventListener('click', () => {
            this.removeTag(tag, tagName)
        })

        tag.appendChild(p)
        tag.appendChild(logo)
        this.tagsEl.appendChild(tag)

        this.createItems()
    }

    removeTag(tagEl, tagName) {
        tagEl.remove()
        this.allRecipes.forEach(recipe => {
            const isDeleted = recipe.tag.delete(tagName)
            if (isDeleted && !recipe.isFiltered) {
                recipe.element.classList.remove('hide')
            }
        })
    }
}