/**
 *
 * @param {Array} recipes
 * @param {HTMLElement} domRootList
 *
 * @return {Array<{ isFiltered: boolean, tag: string[], data, element: HTMLElement}>}
 */
export default function createRecipes(recipes, domRootList) {
    return recipes.map((recipe) => {
        const ingredients = recipe
            .ingredients
            .map(i => {
                const ingredient = i.ingredient
                const quantity = i.quantity ? `: ${i.quantity}` : ''
                const unit = i.unit ?? ''
                return `<li><strong>${ingredient}</strong> ${quantity}${unit}</li>`
            })

        const description = recipe.description.split(' ')

        if (description.length >= 35) {
            description.splice(34)
            description.push('...')
        }

        const recipeEl = document.createElement('article')
        recipeEl.classList.add('recipe')
        recipeEl.innerHTML = `
            <div class="recipe__thumbnail"></div>
            <div class="recipe__legend">
                <h2 class="recipe__legend--title">${recipe.name}</h2>
                <span class="recipe__legend--time">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill="black"/>
                    </svg>
                    ${recipe.time} min
                </span>
                <ul class="recipe__legend--ingredients">
                    ${ingredients.join('\n')}
                </ul>
                <p class="recipe__legend--desc">
                    ${description.join(' ')}
                </p>
            </div>
        `

        domRootList.append(recipeEl)
        return {
            isFiltered: false,
            tag: [],
            data: recipe,
            element: recipeEl
        }
    })
}