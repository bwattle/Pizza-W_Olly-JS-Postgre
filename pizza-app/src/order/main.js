import React from 'react';
import ReactDOM from 'react-dom';
import Checkout from "./checkout.js";
import { Pizza } from '../common/database.js';
import PizzaCreator from './pizza-creator.js';

import "./index.css"
import "../common/topbar.css"
import "../common/common.css"

const App = ()=>{
    // order items is a list of pizzas
    const [ orderItems, setOrderItems ] = React.useState([]);

    const addPizza = ()=>{
        setOrderItems( orderItems.concat(Pizza.newEmptyPizza()) )
    }

    const setPizza = (id, val)=>{
        const matches = orderItems.filter(i=>i.id==id)
        if(matches.length == 0){
            console.log("Tried to set pizza with invalid id")
        }else{
            const newPizzas = [...orderItems]
            const idx = newPizzas.map(i=>i.id==id).indexOf(true)
            newPizzas[idx] = val
            console.log("set pizza to ", val)
            setOrderItems(newPizzas)
        }
    }

    return (
        <div id="app-main">
            <div id="order-form">
                { orderItems.map((item, idx)=>{
                    // creates a func to remove this pizza
                    const removeFunc = ()=>setOrderItems(orderItems.filter(removeItem=>removeItem.id!=item.id))
                    const setFunc = (val)=>setPizza(item.id, val)
                    return <PizzaCreator close={removeFunc} key={item.id} setPizza={setFunc} pizza={item}/>
                })}
                <hr />
                <div id="pizza-adder" onClick={addPizza}>
                    Add pizza
                    <button id="pizza-creator-add" className="noselect">+</button>
                </div>
                <br />
                <Checkout pizzas={orderItems} />
            </div>
        </div>
    )
}

const domContainer = document.getElementById('outer-div');
ReactDOM.render(<App />, domContainer);