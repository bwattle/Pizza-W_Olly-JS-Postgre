
function createIngredients(){
    const ingsDiv = document.getElementById("ingredients")
    const template = document.getElementById("ingredientItemTemplate")
    for(const key of Object.keys(allIngredients)){
        // set label text to be ingredient name
        const clone = template.content.cloneNode(true)
        const innerSpan = clone.getElementById("labelText")
        innerSpan.textContent = allIngredients[key].name

        // store ingredient name in its id
        const innerInput = clone.querySelector("input")
        innerInput.id = "ing-"+key

        ingsDiv.appendChild(clone)
    }
}


createIngredients();