import React from "react";
import { database, OrderRecord } from '../common/database.js';
import Validate from "./validateWrapper";
import { sum } from "../common/utils"


function Name(props){
    return (<div>
        <label htmlFor="fname">First name:</label>
        <input type="text" id="fname" name="name" value={props.name} onChange={props.setName}></input>
    </div>)
}


function Payment(props){
    let content;
    if(props.cash){
        content = null
    }else{
        content = (<div>
            <label>
                Credit card number:
                <input type="number" value={props.ccNum} onChange={props.setCcNum}></input>
            </label>
            <label>
                CVV:
                <input type="number" value={props.ccv} onChange={props.setCcv}></input>
            </label>
        </div>)
    }
    return (
        <div>
            <h4>Payment</h4>
            <label htmlFor="payType">Paying cash?</label>
            <input type="checkbox" id="cash-checkbox" value={props.cash} onChange={props.setCash}></input>
            {content}
        </div>
    )
}


function Delivery(props){
    const minDate = getDate()

    const addressPicker = (
        <div>
            <Validate valid={props.address.length>1}>
                <label>Street address:
                    <input onChange={props.setAddr} value={props.address} type="text"></input>
                </label>
            </Validate>
            <br />
            <Validate valid={props.postcode.length==4}>
                <label>Postcode:
                    <input onChange={props.setPost} value={props.postcode} type="text"></input>
                </label>
            </Validate>
        </div>
    )

    return <div>
        Delivery?
        <input type="checkbox" id="delivery-checkbox" value={props.delivery} onChange={props.setDelivery}></input>
        <br />
        <Validate valid={props.ready>getDate()} text="Date to early">
            <label>
                {props.delivery?"Arrive at ":"Pickup ready at "}
                <input type="datetime-local" min={dateToString(minDate)} value={dateToString(props.ready)} onChange={props.setReadyBy}></input>
            </label>
        </Validate>
        <br />
        {props.delivery?addressPicker:null}
    </div>
}



// filters out numbers
function filterNumbers(v){
    // uses a regex from here to filter only letters and spaces (\s)
    // https://stackoverflow.com/questions/58259610/how-do-i-filter-out-a-string-to-contain-only-letters-in-vanilla-javascript
    return v.replace(/[^a-z\s'.]+/gi, '')
}

// filters out letters
function filterLetters(v){
    return v.replaceAll(/\D+/g) // matches all non numbers
}

function getDate(plusMins=5){
    return new Date(new Date().getTime() + 1000*60*plusMins)
}
function dateToString(dateObj){
    return dateObj.toISOString().substring(0, 16)
}



export function Checkout(props){
    const [ readyBy, setReadyBy ] = React.useState(getDate(20))
    const [ delivery, setDelivery ] = React.useState(false)
    const [ address, setAddress ] = React.useState("");
    const [ postcode, setPostcode ] = React.useState("")
    const [ cash, setCash ] = React.useState(false)
    const [ name, setName ] = React.useState("")
    const [ ccNum, setCcNum ] = React.useState("")
    const [ ccv, setCcv ] = React.useState("")

    ///////// ONCHANGE HANDLERS //////////
    // mostly just sets state to the value
    const handleCashChange = e=>setCash(e.target.checked)
    const handleAddrChange = e=>setAddress(e.target.value)
    const handleDeliveryChange = e=>setDelivery(e.target.checked)
    // name dosent allow numbers
    const handleNameChange = e=>setName(filterNumbers(e.target.value))
    // postcode dosent letters
    const handlePostChange = e=>setPostcode(filterLetters(e.target.value).substring(0, 4))
    const handleCcvChange = e=>setCcv(filterLetters(e.target.value).substring(0, 3))
    const handleCcNumChange = e=>setCcNum(filterLetters(e.target.value).substring(0, 16)) 
    const handleReadyByChange = e=>{console.log(new Date(e.target.value));setReadyBy(new Date(e.target.value))}

    //////////// CALCULATE TOTAL /////////////
    const prices = props.pizzas.map(
        pizza=>pizza.getPrice()
    )
    const total = sum(prices)

    //////////// HANDLE SUBMIT /////////////
    const handleCreateOrder = ()=>{
        database.addRecord(new OrderRecord(props.pizzas, 0, name, cash?"cash":"card", total))
        console.log(database.records)
    }

    // checks if all inputs are valid
    const validateInput = ()=>{
        if(name.length > 0 &&
            cash &&
            postcode.length == 4 &&
            address.length > 0 &&
            suburb.length > 0){
            return true
        }
        return false
    }

    return (
        <div id="price-outer">
            Total: ${total}
            <h4>Customer Details</h4>
            <Name name={name} setName={handleNameChange} />
            <br/>
            <Payment
                cash={cash} setCash={handleCashChange} ccNum={ccNum}
                setCcNum={handleCcNumChange} ccv={ccv} setCcv={handleCcvChange}
            />
            <h4>Delivery Details</h4>
            <Delivery
                postcode={postcode} setPost={handlePostChange}
                address={address} setAddr={handleAddrChange}
                delivery={delivery} setDelivery={handleDeliveryChange}
                ready={readyBy} setReadyBy={handleReadyByChange}
            />
            <button type="button" onClick={handleCreateOrder} disabled={!validateInput()}>Order</button>
        </div>
    )
}

export default Checkout;