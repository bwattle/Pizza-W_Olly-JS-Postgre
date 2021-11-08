import { allIngredients, basePrice } from "./ingredient-selector"
import BaseSelect from './pizza-preset';
import IngredientsSelector from './ingredient-selector';
import React from "react";

import "./pizza-creator.css";

const PizzaCreator = (props) => {
    const [ curIngredients, setIngredients ] = React.useState([]);
    const [ number, setNumber ] = React.useState(1);

    const allNumbers = [...Array(10).keys()] // generate array of all numbers 1-10
    const numberOptions = allNumbers.map(idx=>{const val = idx+1; return <option key={val}>{val}</option>})

    const handleAmountChange = event=>{
        console.log(event.target.value, number);
        setNumber(event.target.value)
    }

    return (
        <div className="pizza-creator-outer">
            <div className="creator-top-bar">
                <div className="pizza-creator-close" onClick={props.close}>×</div>
            </div>
            
            <div className="creator-content">
                
                <BaseSelect setIngs={setIngredients} />
                <IngredientsSelector ings={curIngredients} setIngs={setIngredients} />

                <label>
                    Amount
                    <select name="cars" id="cars" value={number.toString()} onChange={handleAmountChange}>
                        {numberOptions}
                    </select>
                </label>
                <br />
                Pizza cost ${
                    curIngredients.map((a)=>allIngredients[a].price).reduce((a,b)=>a+b, 0) + basePrice
                }
            </div>
        </div>
    )
}

export default PizzaCreator