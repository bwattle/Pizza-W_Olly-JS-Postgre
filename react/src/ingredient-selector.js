
const SelectedIngredient = (props)=>{
    return (
        <div className="ingredient-item" onClick={()=>{props.onClick(props.ing)}}>
            <span className="noselect">{allIngredients[props.ing].name}  ${allIngredients[props.ing].price}</span>
            <span className="red noselect">-</span>
        </div>
    )
}
const NonSelectedIngredient = (props)=>{
    return (
        <div className="ingredient-item"  onClick={()=>{props.onClick(props.ing)}}>
            <span className="noselect">{allIngredients[props.ing].name}  ${allIngredients[props.ing].price}</span>
            <span className="green noselect">+</span>
        </div>
    )
}

const IngredientsSelector = (props)=>{

    // on click handlers
    const handleRemoveIng = (ing)=>{
        // filter to remove ingredient
        const newIngs = props.ings.filter(item => item !== ing)
        props.setIngs(newIngs)
    }
    const handleAddIng = (ing)=>{
        // concat new ing to end
        const newIngs = props.ings.concat([ing])
        props.setIngs(newIngs)
    }

    // list of all selected ingredients
    const selected = props.ings;
    // all non selected ingredients
    const notSelected = Object.keys(allIngredients).filter(i=>!props.ings.includes(i))

    return (
        <div id="ingredients-selector">
            Base price ${basePrice}
            {selected.map((ing, idx)=>{
                return <SelectedIngredient onClick={handleRemoveIng} key={idx} ing={ing} />
            })}

            <hr></hr>

            {notSelected.map((ing, idx)=>{
                return <NonSelectedIngredient onClick={handleAddIng} key={idx} ing={ing} />
            })}
        </div>
    )
}

const basePrice = 6;
// provides a mapping between interal names and display names
const allIngredients = {
    cheese:      { name: "Cheese", price: 1 },
    beef:        { name: "Ground beef", price: 2 },
    ham:         { name: "Ham", price: 2 },
    pep:         { name: "Sliced Pepperoni", price: 2 },
    mushroom:    { name: "Mushrooms", price: 1 },
    tomato:      { name: "Tomato Chunks", price: 1 },
    spinach:     { name: "Spinach", price: 1 },
    bacon:       { name: "Bacon", price: 3 },
    onion:       { name: "Red Onion", price: 1 },
    pineapple:   { name: "Pineapple", price: 9999 },
    prawn:       { name: "Prawns", price: 3 },
}



export { allIngredients, basePrice };
export default IngredientsSelector;