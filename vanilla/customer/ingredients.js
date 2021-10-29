
function createIngredients(){
    const ingsDiv = document.getElementById("ingredients")
    const template = document.getElementById("ingredientItemTemplate")
    for(const key of Object.keys(allIngredients)){
        console.log(allIngredients[key])
        const clone = template.content.cloneNode(true)
        const innerSpan = clone.getElementById("labelText")
        console.log(innerSpan)
        innerSpan.innerHtml = "test"+allIngredients[key].name
        ingsDiv.appendChild(clone)
    }
}

createIngredients();