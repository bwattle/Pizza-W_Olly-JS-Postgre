import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { allIngredients } from "./ingredient-selector.js"

const ings = allIngredients;
const presets = {
    "None": [],
    "Cheese": ["cheese"],
    "Meatlovers": ["cheese", "beef", "ham", "pep", "onion"],
    "Hawaiian": ["cheese", "tomato", "pineapple", "ham"],
}

function BaseSelect(props) {
    const [lastPreset, setLastPreset] = React.useState(presets.None);

    const handleChange = (event) => {
        setLastPreset(event.target.value);
        props.setIngs(presets[event.target.value]);
    };

    // https://mui.com/components/selects/#props
    return (
    <FormControl>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lastPreset}
            label="Preset"
            autoWidth
            onChange={handleChange}
        >
            {Object.keys(presets).map((key, idx)=>{
                return (
                    <MenuItem key={idx} value={key}>{key}</MenuItem>
                )
            })}
        </Select>
    </FormControl>
    );
}

export default BaseSelect;
export { presets };