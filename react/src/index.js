import React from 'react';
import ReactDOM from 'react-dom';
import Checkout from "./checkout.js";
import BaseSelect from './pizza-preset';
import IngredientsSelector from './ingredient-selector';
import RecordTable from './record-table.js';
import { database } from './database.js';

const App = ()=>{
    const [ curIngredients, setIngredients ] = React.useState([]);
    const [ showingOrders, setShowingOrders ] = React.useState(false);

    return (
        <div id="app-main">
            <header>
                <div onClick={()=>{console.log(showingOrders);setShowingOrders(!showingOrders)}} id="login-button" className="noselect">
                    View orders
                </div>
            </header>
            { showingOrders?<RecordTable close={()=>{setShowingOrders(false)}} records={database.records}/>:null}
            <div id="order-form">
                <BaseSelect setIngs={setIngredients} />
                <IngredientsSelector ings={curIngredients} setIngs={setIngredients} />
                <Checkout ings={curIngredients} />
            </div>
        </div>
    )
}

const domContainer = document.getElementById('outer-div');
ReactDOM.render(<App />, domContainer);