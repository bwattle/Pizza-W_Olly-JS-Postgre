import { allIngredients, basePrice, Pizza } from "../common/database"
import PresetSelect from './pizza-preset';
import IngredientsSelector from './ingredient-selector';
import React from "react";

import "./pizza-creator.css";

const PizzaCreator = (props) => {
    const allNumbers = [...Array(10).keys()] // generate array of all numbers 1-10
    const numberOptions = allNumbers.map(idx=>{const val = idx+1; return <option key={val}>{val}</option>})

    const handleAmountChange = (event)=>{
        const quant = event.target.value
        props.setPizza(new Pizza(props.pizza.ingredients, quant, props.pizza.id))
    }

    const setIngredients = (ingredients) => {
        props.setPizza(new Pizza(ingredients, props.pizza.quantity, props.pizza.id))
    }

    return (
        <div className="pizza-creator-outer">
            <div className="creator-top-bar">
                <div className="pizza-creator-close" onClick={props.close}>×</div>
            </div>
            
            <div className="creator-content">
                
                <PresetSelect setIngs={setIngredients} />

                <IngredientsSelector ings={props.pizza.ingredients} setIngs={setIngredients} />

                <label>
                    Amount: 
                    <select name="cars" id="cars" value={props.pizza.quantity.toString()} onChange={handleAmountChange}>
                        {numberOptions}
                    </select>
                </label>
                <br />
                Pizza cost ${
                    props.pizza.getPrice()
                }
            </div>
        </div>
    )
}

export default PizzaCreator