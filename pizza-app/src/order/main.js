import React from 'react';
import ReactDOM from 'react-dom';
import Checkout from "./checkout.js";
import { database, Pizza } from '../common/database.js';
import PizzaCreator from './pizza-creator.js';

import "./index.css"
import "../common/topbar.css"
import "../common/common.css"
import Validate from './validateWrapper.js';

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
                {/* <div onClick={()=>{console.log(showingOrders);setShowingOrders(!showingOrders)}} id="login-button" className="noselect">
                    View orders
                </div> */}
            {/* { showingOrders?<RecordTable close={()=>{setShowingOrders(false)}} records={database.records}/>:null} */}
            <div id="order-form">
                <Validate valid={orderItems.length!=0}>
                    { orderItems.map((item, idx)=>{
                        // creates a func to remove this pizza
                        const removeFunc = ()=>setOrderItems(orderItems.filter(removeItem=>removeItem.id!=item.id))
                        const setFunc = (val)=>setPizza(item.id, val)
                        return <PizzaCreator close={removeFunc} key={item.id} setPizza={setFunc} pizza={item}/>
                    })}
                </Validate>
                
                <hr />
                <div id="pizza-adder" onClick={addPizza}>
                    Add pizza
                    <div id="pizza-creator-add" className="noselect">+</div>
                </div>
                <br />
                <Checkout pizzas={orderItems} />
            </div>
        </div>
    )
}

const domContainer = document.getElementById('outer-div');
ReactDOM.render(<App />, domContainer);