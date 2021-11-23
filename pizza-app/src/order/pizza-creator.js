import { Pizza } from "../common/database"
import React from "react";
import Validate from "./validateWrapper"
import { allIngredients } from "../common/database";
import { arraysEqual } from "../common/utils"

import "./pizza-creator.css";

// you can add presets by just adding to this
// ingredients must be the ones defined in common/database.js
const presets = {
    "None": [],
    "Cheese": ["cheese"],
    "Meatlovers": ["cheese", "beef", "ham", "pep", "onion"],
    "Hawaiian": ["cheese", "tomato", "ham"],
    "Vegetarian": ["cheese", "tomato", "mushroom", "spinach", "onion", "olive"]
}

// provides a dropdown that displays options from presets ^
// takes ings and setIngs
function PresetSelect(props) {
    const handleChange = (event) => {
        props.setIngs(presets[event.target.value]);
    }

    // detects presets if you have selected ingredients with buttons
    let selectedPreset = "None"
    for(const preset of Object.keys(presets)){
        if(arraysEqual(presets[preset].sort(), props.ings.sort())){
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

// single ingredient button
// takes the ingredient internal name and uses allIngredients (from common/database.js)
// to find the price and display name
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
    // generate array of numbers 1-10 for quantity options
    const allNumbers = [...Array(10).keys()] 
    // creates option elements for each number
    const numberOptions = allNumbers.map(idx=>{const val = idx+1; return <option key={val}>{val}</option>})

    // replaces pizza with new one with new quantity or ingredients 
    const handleAmountChange = (event)=>{
        const quant = event.target.value
        props.setPizza(new Pizza(props.pizza.ingredients, quant))
    }
    const setIngredients = (ingredients) => {
        props.setPizza(new Pizza(ingredients, props.pizza.quantity))
    }

    // on click handlers
    // takes name of ingredients, ing
    // and value to set it to, val
    const handleIngChange = (ing, val)=>{
        let newIngs;
        if(!val){
            // concat new ing to end of selected ingredients array
            newIngs = props.pizza.ingredients.concat([ing])
        }else{
            // filter to remove ingredient
            newIngs = props.pizza.ingredients.filter(item => item !== ing)
        }
        setIngredients(newIngs)
    }

    // creates Ingredient element for each item in allIngredients
    let ingredientElements = []
    for(const ing of Object.keys(allIngredients)){
        const selected = props.pizza.ingredients.includes(ing) // wether this ingredient is selected
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
                Pizza cost ${props.pizza.getPrice()}
            </div>
        </div>
    )
}

export default PizzaCreator