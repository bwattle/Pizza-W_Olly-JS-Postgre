import React from "react";
import { allIngredients, basePrice } from "./ingredient-selector";
import { database, OrderRecord } from './database.js';
import Validate from "./validateWrapper";

function sum(arr){
    console.log(arr)
    return arr.reduce((a, b)=>a+b, 0)
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
    const [ address, setAddress ] = React.useState("")
    const [ suburb, setSuburb ] = React.useState("")
    const [ postcode, setPostcode ] = React.useState("")

    ///////// ONCHANGE HANDLERS //////////
    // mostly just sets state to the value
    const handleCashChange = (event) => setCash(event.target.checked)
    const handleAddrChange = (event)=>setAddress(event.target.value)
    const handleSubrChange = (event)=>setSuburb(event.target.value)
    // name dosent allow numbers
    const handleNameChange = (event) => {
        // uses a regex from here to filter only letters and spaces (\s)
        // https://stackoverflow.com/questions/58259610/how-do-i-filter-out-a-string-to-contain-only-letters-in-vanilla-javascript
        setName(event.target.value.replace(/[^a-z\s'.]+/gi, ''))
    }
    // postcode dosent letters
    const handlePostChange = (event)=>{
        const re = /\D+/g; // regex to filter to match all nonnumbers
        const nums = event.target.value.replaceAll(re, "")
        const trimmed = nums.substring(0, 4)
        setPostcode(trimmed);
    }

    //////////// CALCULATE TOTAL /////////////
    const prices = props.pizzas.map(
        p=>sum(p.ingredients.map(i=>allIngredients[i].price))
    )
    const total = sum(prices) + basePrice;

    //////////// HANDLE SUBMIT /////////////
    const handleCreateOrder = ()=>{
        const uid = Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)

        database.addRecord(new OrderRecord(props.pizzas, 0, name, cash?"cash":"card", total, uid))
        console.log(database.records)
    }

    // checks if all inputs are valid
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

    const now = new Date(new Date().getTime() + 1000*60*5) // adds five minutes
    const day = now.getDay().toString().padStart(2, "0")
    const month = (now.getMonth()+1).toString().padStart(2, "0")
    const year = now.getFullYear().toString()
    const hour = now.getHours().toString().padStart(2, "0")
    const minute = now.getMinutes().toString().padStart(2, "0")

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
            <div id="delivery">
                <div>
                    <input type="datetime-local" min={`${year}-${month}-${day}T${hour}:${minute}:00.00`}></input>
                </div>
                <div>
                    <Validate valid={address.length>1}>
                        <label>Street address:
                            <input onChange={handleAddrChange} value={address} type="text"></input>
                        </label>
                    </Validate>
                    <br />
                    <Validate valid={suburb.length>=1}>
                        <label>Suburb:
                            <input onChange={handleSubrChange} value={suburb} type="text"></input>
                        </label>
                    </Validate>
                    <br />
                    <Validate valid={postcode.length==4}>
                        <label>Postcode:
                            <input onChange={handlePostChange} value={postcode} type="text"></input>
                        </label>
                    </Validate>
                </div>
            </div>
            <button type="button" onClick={handleCreateOrder} disabled={!validateInput()}>Order</button>
        </div>
    )
}

export default Checkout;