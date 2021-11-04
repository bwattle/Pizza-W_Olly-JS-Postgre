import React from 'react';
import ReactDOM from 'react-dom';
import Checkout from "./checkout.js";
import RecordTable from './record-table.js';
import { database, OrderItem } from './database.js';
import PizzaCreator from './pizza-creator.js';

import "./index.css"

const App = ()=>{
    const [ orderItems, setOrderItems ] = React.useState([]);

    const addPizza = ()=>{
        setOrderItems( orderItems.concat(new OrderItem([])) )
    }

    return (
        <div id="app-main">
            <header>
                {/* <div onClick={()=>{console.log(showingOrders);setShowingOrders(!showingOrders)}} id="login-button" className="noselect">
                    View orders
                </div> */}
            </header>
            {/* { showingOrders?<RecordTable close={()=>{setShowingOrders(false)}} records={database.records}/>:null} */}
            <div id="order-form">

                { orderItems.map((item, idx)=>{
                    const closeFunc = ()=>setOrderItems(orderItems.splice(idx, 1))
                    return <PizzaCreator close={closeFunc} key={item.id} pizza={item}/>
                })}
                
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