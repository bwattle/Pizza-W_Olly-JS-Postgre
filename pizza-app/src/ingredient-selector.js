import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
// https://mui.com/components/material-icons/

// https://mui.com/components/buttons/
const SelectedIngredient = (props)=>{
    return (
        <div className="ingredient-item">
            <p>{allIngredients[props.name]}</p>
            <IconButton onClick={()=>{props.onClick(props.name)}} aria-label="delete" sx={{
                color: 'red',
            }}>
                <RemoveIcon />
            </IconButton>
        </div>
    )
}
const NonSelectedIngredient = (props)=>{
    return (
        <div className="ingredient-item">
            <p>{allIngredients[props.name]}</p>
            <IconButton onClick={()=>{props.onClick(props.name)}} aria-label="delete" sx={{
                color: 'green',
            }}>
                <AddIcon />
            </IconButton>
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
            {selected.map((ing, idx)=>{
                return <SelectedIngredient onClick={handleRemoveIng} key={idx} name={ing} />
            })}

            <hr></hr>

            {notSelected.map((ing, idx)=>{
                return <NonSelectedIngredient onClick={handleAddIng} key={idx} name={ing} />
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