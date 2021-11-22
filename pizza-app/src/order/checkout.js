import React from "react";
import { database, OrderRecord, database_url } from '../common/database.js';
import Validate from "./validateWrapper";
import { sum } from "../common/utils"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./checkout.css"
import "../common/common.css"

function Name(props){
    return (<Validate valid={props.name.length>=1}>
        <label htmlFor="fname">First name:</label>
        <input type="text" id="fname" name="name" value={props.name} onChange={props.setName}></input>
    </Validate>)
}


function Payment(props){
    let content;
    if(props.cash){
        content = null
    }else{
        content = (
        <div>
            <Validate valid={props.ccNum.length >= 14}>
                <label>
                    Credit card number:
                    <input type="number" value={props.ccNum} onChange={props.setCcNum}></input>
                </label>
            </Validate>
            <br />
            <Validate valid={props.ccv.length == 3}>
                <label>
                    CVV:
                    <input type="number" value={props.ccv} onChange={props.setCcv}></input>
                </label>
            </Validate>
        </div>)
    }
    return (
        <div>
            <h4>Payment</h4>
            <label>
                Paying cash?
                <input type="checkbox" id="cash-checkbox" value={props.cash} onChange={props.setCash}></input>
            </label>
            {content}
        </div>
    )
}


function Delivery(props){
    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    };

    const addressPicker = (
        <div>
            <Validate valid={props.address.length>=1}>
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
        <label>
            Delivery?
            <input type="checkbox" id="delivery-checkbox" checked={props.delivery} onChange={props.setDelivery}></input>
        </label>
        <br />
        <Validate valid={props.ready.toISOString()>getDate().toISOString()} text="Date too early">
            <label>
                {props.delivery?"Arrive at ":"Pickup ready at "}
                {/* <input type="datetime-local" min={dateToString(minDate)} value={dateToString(props.ready)} onChange={props.setReadyBy}></input> */}
                <DatePicker
                    selected={props.ready}
                    onChange={props.setReadyBy}
                    showTimeSelect
                    filterTime={filterPassedTime}
                    minDate={new Date()}
                    timeIntervals={5}
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
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


export class Checkout extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {...new OrderRecord(-1, getDate(20), true, "", "", false, "", "", ""), feedback: []}
    }

    render(){

        ///////// ONCHANGE HANDLERS //////////
        // mostly just sets state to the value
        const handleCashChange = e=>this.setState({cash: e.target.checked})
        const handleAddrChange = e=>this.setState({address: e.target.value})
        const handleDeliveryChange = e=>this.setState({delivery: e.target.checked})
        // name dosent allow numbers
        const handleNameChange = e=>this.setState({name: filterNumbers(e.target.value)})
        // postcode dosent allow letters
        const handlePostChange = e=>this.setState({postcode: filterLetters(e.target.value).substring(0, 4)})
        const handleCcvChange = e=>this.setState({ccv: filterLetters(e.target.value).substring(0, 3)})
        const handleCcNumChange = e=>this.setState({credit_card: filterLetters(e.target.value).substring(0, 16)}) 
        const handleReadyByChange = date=>{
            console.log(date, date.toISOString());this.setState({ready_by: date})
        }

        //////////// CALCULATE TOTAL /////////////
        const prices = this.props.pizzas.map(
            pizza=>pizza.getPrice()
        )
        const total = sum(prices)

        //////////// HANDLE SUBMIT /////////////
        const handleCreateOrder = ()=>{
            database.getId(createOrder)
        }
        const createOrder = order_id=>{
            const order = Object.assign(new OrderRecord, this.state)
            order.id = order_id
            console.log("got id ", order_id);
            database.addOrder(
                order,
                res=>{
                    console.log("added order, res:", res);
                    if(!res.startsWith("error")){
                        this.setState({feedback: [...this.state.feedback, {text:"Added order ", status:true}]})
                    }else{
                        this.setState({feedback: [...this.state.feedback, {text:`Failed to add order: ${res}`, status:false}]})
                    }
                    sendPizzas(order_id)
                }
            )
        }
        const sendPizzas = order_id=>{
            for(const pizza of this.props.pizzas){
                database.addPizza(pizza, order_id, res=>{
                    console.log("added pizza, res:",res);
                    if(!res.startsWith("error")){
                        this.setState({feedback: [...this.state.feedback, {text:"Added pizza", status:true}]})
                    }else{
                        this.setState({feedback: [...this.state.feedback, {text:`Failed to add pizza: ${res}`, status:false}]})
                    }
                })
            }
        }

        // checks if all inputs are valid
        const validateInput = ()=>{
            return Object.assign(new OrderRecord(), this.state).validate() && this.props.pizzas.length >= 1
        }
        return (
            <div id="price-outer">
                Total: ${total}
                <h4>Customer Details</h4>
                <Name name={this.state.name} setName={handleNameChange} />
                <Payment
                    cash={this.state.cash} setCash={handleCashChange} ccNum={this.state.credit_card}
                    setCcNum={handleCcNumChange} ccv={this.state.ccv} setCcv={handleCcvChange}
                />
                <h4>Delivery Details</h4>
                <Delivery
                    postcode={this.state.postcode} setPost={handlePostChange}
                    address={this.state.address} setAddr={handleAddrChange}
                    delivery={this.state.delivery} setDelivery={handleDeliveryChange}
                    ready={this.state.ready_by} setReadyBy={handleReadyByChange}
                />
                <br />
                <Validate valid={this.props.pizzas.length>=1} text="Must have at least one pizza">
                    <button type="button" onClick={handleCreateOrder} disabled={!validateInput()}>Order</button>
                </Validate>
                <br />
                {this.state.feedback.map(obj=>{return <p className={obj.status?"green":"red"}>{obj.text}</p>})}
            </div>
        )
    }
}

export default Checkout;