import React from 'react';
import ReactDOM from 'react-dom';
import Checkout from "./checkout.js";
import { Pizza } from '../common/database.js';
import PizzaCreator from './pizza-creator.js';

import "./index.css"
import "../common/topbar.css"
import "../common/common.css"

const App = ()=>{
    // order items is a list of pizzas in order
    const [ orderItems, setOrderItems ] = React.useState([]);

    // adds a new empty pizza to orderItems
    const addPizza = ()=>{
        setOrderItems( orderItems.concat(Pizza.newEmptyPizza()) )
    }

    // update a pizza, takes the local id of the pizza and a pizza object to replace it with
    const setPizza = (id, val)=>{
        // finds id of pizza with matching id
        const idx = orderItems.map(i=>i.localId==id).indexOf(true)
        if(idx == -1){
            console.log("Tried to set pizza with invalid id")
        }else{
            // creates a copy of pizzas and replace pizzza
            const newPizzas = [...orderItems]
            newPizzas[idx] = val
            // update state
            setOrderItems(newPizzas)
        }
    }

    return (
        <div id="app-main">
            <div id="order-form">
                {
                    // creates a PizzaCreator component for each pizza in orderItems array
                    orderItems.map((item, idx)=>{
                        // creates a func to remove this pizza and to update this pizza
                        // passes these functions to component so it can call them
                        const removeFunc = ()=>setOrderItems(orderItems.filter(removeItem=>removeItem.localId!=item.localId))
                        const setFunc = (val)=>setPizza(item.localId, val)
                        return <PizzaCreator close={removeFunc} key={item.localId} setPizza={setFunc} pizza={item}/>
                    })
                }
                <hr />
                <div id="pizza-adder" onClick={addPizza}>
                    Add pizza
                    <button id="pizza-creator-add" className="noselect">+</button>
                </div>
                <br />
                {/* Checkout has the customer details, delivery and payment forms */}
                <Checkout pizzas={orderItems} />
            </div>
        </div>
    )
}

// inserts all the html from App into 'outer-div'
const domContainer = document.getElementById('outer-div');
ReactDOM.render(<App />, domContainer);