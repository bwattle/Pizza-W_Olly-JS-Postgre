import { allIngredients, basePrice } from "./ingredient-selector"
import BaseSelect from './pizza-preset';
import IngredientsSelector from './ingredient-selector';
import React from "react";

import "./pizza-creator.css";

const PizzaCreator = (props) => {
    const [ curIngredients, setIngredients ] = React.useState([]);
    return (
        <div className="pizza-creator-outer">
            <div className="creator-top-bar">
                <div className="pizza-creator-close" onClick={props.close}>×</div>
            </div>
            
            <div className="creator-content">
                
                <BaseSelect setIngs={setIngredients} />
                <IngredientsSelector ings={curIngredients} setIngs={setIngredients} />
                Pizza cost ${
                    curIngredients.map((a)=>allIngredients[a].price).reduce((a,b)=>a+b, 0) + basePrice
                }
            </div>
        </div>
    )
}

export default PizzaCreator