import { allIngredients } from "../common/database" 
import Validate from "./validateWrapper"

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
    console.log(allIngredients)
    const notSelected = Object.keys(allIngredients).filter(i=>!props.ings.includes(i))

    return (
        <Validate valid={!selected.includes("pineapple")} text="No pineapple allowed">
            <div id="ingredients-selector">
                <div className="ingredients-yes">
                    {selected.map((ing, idx)=>{
                        return <SelectedIngredient onClick={handleRemoveIng} key={idx} ing={ing} />
                    })}
                </div>
                <div className="ingredients-no">
                    {notSelected.map((ing, idx)=>{
                        return <NonSelectedIngredient onClick={handleAddIng} key={idx} ing={ing} />
                    })}
                </div>
            </div>
        </Validate>
    )
}

export default IngredientsSelector;