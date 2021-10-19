import React from 'react';
import ReactDOM from 'react-dom';
import { Price } from "./price.js";
import BaseSelect from './pizza-preset';
import IngredientsSelector from './ingredient-selector';

const App = ()=>{
    const [ curIngredients, setIngredients ] = React.useState([]);
    return (
        <div id="app-main">
            <BaseSelect setIngs={setIngredients} />
            <IngredientsSelector ings={curIngredients} setIngs={setIngredients} />
            <Price ings={curIngredients} />
        </div>
    )
}

const domContainer = document.getElementById('outer-div');
ReactDOM.render(<App />, domContainer);