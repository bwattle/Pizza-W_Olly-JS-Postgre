import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ingredients } from "./ingredient-selector.js"

const ings = ingredients;
const presets = {
    "None": [],
    "Cheese": [ings.cheese],
    "Meatlovers": [ings.cheese, ings.beef, ings.ham, ings.pep, ings.onion],
    "Hawaiian": [ings.cheese, ings.tomato, ings.pineapple, ings.ham],
}

function BaseSelect(props) {
  const [lastPreset, setLastPreset] = React.useState(presets.None);

  const handleChange = (event) => {
      setLastPreset(event.target.value);
      props.setIngs(presets[event.target.value]);
  };

  return (
    <FormControl>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lastPreset}
            label="Preset"
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