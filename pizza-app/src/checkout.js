import React from "react";
import { allIngredients, basePrice } from "./ingredient-selector";
import { database, OrderRecord } from './database.js';
import Delivery from "./delivery.js"

function Validate(props){
    return (
        <div>
            {props.children}
            {props.valid?null:<span className="red">*</span>}
        </div>
    )
}

function OnlinePayment(props){
    return (
        <div>
            <p>Fake online payment stuff goes here</p>
        </div>
    )
}

export function Checkout(props){
    const [ cash, setCash ] = React.useState(false);
    const [ name, setName ] = React.useState("");

    const handleCashChange = (event) => {
        setCash(event.target.checked);
    };

    const handleNameChange = (event) => {
        // uses a regex from here to filter only letters and spaces (\s)
        // https://stackoverflow.com/questions/58259610/how-do-i-filter-out-a-string-to-contain-only-letters-in-vanilla-javascript
        setName(event.target.value.replace(/[^a-z\s'.]+/gi, ''))
    }

    const prices = props.ings.map(i=>allIngredients[i].price)
    const total = prices.reduce((a, b)=>a+b, 0) + basePrice;

    const handleCreateOrder = ()=>{
        const uid = Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)

        database.addRecord(new OrderRecord(props.ings, 0, name, cash?"cash":"card", total, uid))
        console.log(database.records)
    }

    const validateInput = ()=>{
        if(name.length == 0){
            return false
        }
        if(!cash){
            // if(check card details)
            return false
        }
        return true
    }

    return (
        <div id="price-outer">
            Total: ${total}
            <div>
                <Validate valid={name.length > 0}>
                    <label htmlFor="fname">First name:</label>
                    <input type="text" id="fname" name="fname" value={name} onChange={handleNameChange}></input>
                </Validate>
                <br/>
                <Validate valid={cash==true}>
                    <label htmlFor="payType">Paying cash?</label>
                    <input type="checkbox" id="cash-checkbox" name="payType" value={cash} onChange={handleCashChange}></input>
                </Validate>
                    {!cash?<OnlinePayment />:null}
               
            </div>
            <Delivery />
            <button type="button" onClick={handleCreateOrder} disabled={!validateInput()}>Order</button>
        </div>
    )
}

export default Checkout;