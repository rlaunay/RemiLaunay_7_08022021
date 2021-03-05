import closeSvg from './../assets/cross.svg'

/**
 * @property {HTMLElement} filter
 * @property {HTMLInputElement} inputEl
 * @property {HTMLUListElement} itemsEl
 * @property {HTMLUListElement} logoEl
 * @property {HTMLUListElement} tagsEl
 * @property {{data: *, isFiltered: boolean, tag: Set<string>, element: HTMLElement}[]} allRecipes
 */
export default class FilterBy {
    /**
     *
     * @param {Element} filter
     * @param {{data: *, isFiltered: boolean, tag: Set<string>, element: HTMLElement}[]} allRecipes
     */
    constructor(filter, allRecipes) {
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
        this.search = this.search.bind(this)

        this.filter = filter
        this.inputEl = filter.querySelector('.filter-by__input')
        this.itemsEl = filter.querySelector('.filter-by__items')
        this.allRecipes = allRecipes
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
        this.filter.querySelector('.filter-by__opener').addEventListener('click', this.open)

        this.inputEl.addEventListener('blur', this.close)

        this.inputEl.addEventListener('input', this.search)

        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                this.close()
            }
        })
    }

    close(e) {
        this.inputEl.value = ''
        this.filter.classList.remove('open')
    }

    open() {
        this.filter.classList.add('open')
        this.inputEl.value = ''
        this.inputEl.focus()

        if (this.allRecipes.find((recipe) => recipe.isFiltered || recipe.tag.size !== 0)) {
            this.createItems()
        } else {
            this.itemsEl.innerHTML = ''
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
            itemEl.addEventListener('mousedown', (e) => {
                this.addTag(e.target.innerText)
            })
            this.itemsEl.appendChild(itemEl)
        })
    }

    search(e) {
        console.time('filterTimer')
        if (e.target.value.length >= 3) {
            const searchWordsChecker = this.checkItems(e.target.value.split(' '))

            if (!this.itemsEl.childNodes.length > 0) {
                this.createItems()
            }

            this.itemsEl.childNodes.forEach(item => {
                if (
                    !searchWordsChecker(item)
                ) {
                    item.classList.add('hide')
                } else {
                    item.classList.remove('hide')
                }
            })
        } else {
            if (this.allRecipes.some(recipe => recipe.isFiltered || recipe.tag.size !== 0)) {
                this.createItems()
            } else {
                this.itemsEl.innerHTML = ''
            }
        }
        console.timeEnd('filterTimer')
    }

    /**
     *
     * @param {String[]} searchTab
     */
    checkItems(searchTab) {

        return (item) => {
            const res = searchTab.map(search => {
                return item.innerText.toLowerCase().includes(search)
            })
            return res.every(r => r)
        }
    }

    addTag(tagName) {

        if (this.allRecipes.some(r => r.tag.has(tagName))) return

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
    }

    removeTag(tagEl, tagName) {
        tagEl.remove()
        this.allRecipes.forEach(recipe => {
            recipe.tag.delete(tagName)
            if (recipe.tag.size === 0 && !recipe.isFiltered) {
                recipe.element.classList.remove('hide')
            }
        })
        if (this.filter.classList.contains('open')) {
            this.createItems()
        }
    }
}