import React from 'react';
import { allIngredients } from "./ingredient-selector.js"

const ings = allIngredients;
const presets = {
    "None": [],
    "Cheese": ["cheese"],
    "Meatlovers": ["cheese", "beef", "ham", "pep", "onion"],
    "Hawaiian": ["cheese", "tomato", "pineapple", "ham"],
}

function BaseSelect(props) {
    const [lastPreset, setLastPreset] = React.useState("None");
    console.log(lastPreset)

    const handleChange = (event) => {
        setLastPreset(event.target.value);
        props.setIngs(presets[event.target.value]);
    };

    // https://mui.com/components/selects/#props
    return (
        <div>
            <label htmlFor="preset">Select preset: </label>
            <select value={lastPreset} onChange={handleChange} name="preset" id="preset-selector">
                {Object.keys(presets).map((key, idx)=>{
                    return (
                        <option key={idx} value={key}>{key}</option>
                    )
                })}
            </select>
        </div>

    );
}

export default BaseSelect;
export { presets };