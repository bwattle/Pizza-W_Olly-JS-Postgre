
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

const presets = {
    "plain": [],
    "hawaiian": ["cheese", "tomato", "pineapple", "ham"],
    "meatlovers": ["cheese", "beef", "ham", "pep", "onion"],
    "veg": ["cheese", "tomato", "pineapple", "spinach", "onion", "mushroom"],
}

function setPreset(value){
    const matches = presets[value]
    const inputs = document.getElementsByClassName("ingredientInput")
    for(const input of inputs){
        const inputName = input.id.split("-")[1] // string name for the ingredient of the current input
        input.checked = matches.includes(inputName)
    }
}

createIngredients();
