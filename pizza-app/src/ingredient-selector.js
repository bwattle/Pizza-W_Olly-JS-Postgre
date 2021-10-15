import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const SelectedIngredient = (props)=>{
    return (
        <div className="ingrident-item">
            <p>{allIngredients[props.name]}</p>
            <IconButton aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </div>
    )
}
const NonSelectedIngredient = (props)=>{
    return (
        <div className="ingrident-item">
            <p>{allIngredients[props.name]}</p>
            <IconButton aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </div>
    )
}

const IngredientsSelector = (props)=>{
    const selected = props.ings;
    const notSelected = Object.keys(allIngredients).filter(i=>!props.ings.includes(i))
    console.log(selected, notSelected)
    return (
        <div id="ingredients-selector">
            {selected.map((ing, idx)=>{
                console.log("mapped", ing);
                return <SelectedIngredient key={idx} name={ing} />
            })}
            <hr></hr>
            {notSelected.map((ing, idx)=>{
                return <NonSelectedIngredient key={idx} name={ing} />
            })}
        </div>
    )
}

// provides a mapping between interal names and display names
const allIngredients = {
    "cheese": "Cheese",
    "beef": "Ground beef",
    "ham": "Ham",
    "pep": "Sliced Pepperoni",
    "mushroom": "Mushrooms",
    "tomato": "Tomato Chunks",
    "spinich": "Spinich",
    "bacon": "Bacon",
    "onion": "Red Onion",
    "pineapple": "Pineapple",
    "prawn": "Prawns",
}


export { allIngredients };
export default IngredientsSelector;