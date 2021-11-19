import { Pizza } from "../common/database"
import React from "react";
import Validate from "./validateWrapper"
import { allIngredients } from "../common/database";
import { arraysEqual } from "../common/utils"

import "./pizza-creator.css";


const presets = {
    "None": [],
    "Cheese": ["cheese"],
    "Meatlovers": ["cheese", "beef", "ham", "pep", "onion"],
    "Hawaiian": ["cheese", "tomato", "ham"],
    "Vegetarian": ["cheese", "tomato", "mushroom", "spinach", "onion", "olive"]
}

function PresetSelect(props) {
    const handleChange = (event) => {
        props.setIngs(presets[event.target.value]);
    }

    let selectedPreset = "None"
    for(const preset of Object.keys(presets)){
        if(arraysEqual(presets[preset], props.ings)){
            selectedPreset = preset
        }
    }

    return (
        <div>
            <label htmlFor="preset">Select preset: </label>
            <select value={selectedPreset} onChange={handleChange} name="preset" id="preset-selector">
                {Object.keys(presets).map((key, idx)=>{
                    return (
                        <option key={idx} value={key}>{key}</option>
                    )
                })}
            </select>
        </div>

    );
}


const Ingredient = (props)=>{
    return (
        <label >
            <input
                className="ingCheck" type="checkbox" hidden
                value={props.selected} onChange={e=>{props.onClick(props.ing, props.selected)}}
            ></input>
            <div className={`ingredient-item${props.selected?" ing-item-checked":""}`}>
                <span className="noselect">{allIngredients[props.ing].name}  ${allIngredients[props.ing].price}</span>
                {/* <span className={`noselect ${props.selected?"red":"green"}`}>{props.selected?"-":"+"}</span> */}
            </div>
        </label>
    )
}


const PizzaCreator = (props) => {
    const allNumbers = [...Array(10).keys()] // generate array of all numbers 1-10
    const numberOptions = allNumbers.map(idx=>{const val = idx+1; return <option key={val}>{val}</option>})

    const handleAmountChange = (event)=>{
        const quant = event.target.value
        props.setPizza(new Pizza(props.pizza.ingredients, quant))
    }

    const setIngredients = (ingredients) => {
        props.setPizza(new Pizza(ingredients, props.pizza.quantity))
    }

    // on click handlers
    const handleIngChange = (ing, val)=>{
        let newIngs;
        if(!val){
            // concat new ing to end
            newIngs = props.pizza.ingredients.concat([ing])
        }else{
            // filter to remove ingredient
            newIngs = props.pizza.ingredients.filter(item => item !== ing)
        }
        setIngredients(newIngs)
    }

    let ingredientElements = []
    for(const ing of Object.keys(allIngredients)){
        const selected = props.pizza.ingredients.includes(ing)
        ingredientElements.push(<Ingredient onClick={handleIngChange} key={ing} ing={ing} selected={selected} />)
    }

    return (
        <div className="pizza-creator-outer">
            <div className="creator-top-bar">
                <div className="pizza-creator-close" onClick={props.close}>×</div>
            </div>
            
            <div className="creator-content">
                
                <PresetSelect setIngs={setIngredients} ings={props.pizza.ingredients} />

                <Validate valid={!props.pizza.ingredients.includes("pineapple")} text="Thats gross">
                    <div id="ingredients-selector">
                        {ingredientElements}
                    </div>
                </Validate>

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