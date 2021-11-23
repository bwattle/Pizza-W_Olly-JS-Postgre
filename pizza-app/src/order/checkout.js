import React from "react";
import { database, OrderRecord, database_url } from '../common/database.js';
import Validate from "./validateWrapper";
import { sum } from "../common/utils"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./checkout.css"
import "../common/common.css"

// validate name input
// is a controlled component https://reactjs.org/docs/forms.html#controlled-components
// takes a name and a setName as props
function Name(props){
    return (<Validate valid={props.name.length>=1}>
        <label htmlFor="fname">First name:</label>
        <input type="text" id="fname" name="name" value={props.name} onChange={props.setName}></input>
    </Validate>)
}


// controlled component to display payment info inputs
function Payment(props){
    // if paying with cash dont display credit card inputs
    let ccInputs;
    if(props.cash){
        ccInputs = null
    }else{
        ccInputs = (
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
            </div>
        )
    }


    return (
        <div>
            <h4>Payment</h4>
            <label>
                Paying cash?
                <input type="checkbox" id="cash-checkbox" value={props.cash} onChange={props.setCash}></input>
            </label>

            {ccInputs}
        </div>
    )
}

// inputs to either pick where to deliver to or to do pickup
function Delivery(props){

    // returns wether a date is valid
    // takes time to test
    const getTimeValid = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        // getTime gets milliseconds since epoch
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
        <Validate valid={getTimeValid(props.ready)} text="Date too early">
            <label>
                {props.delivery?"Arrive at ":"Pickup ready at "}
                {/* this is the datepicker component defined in a library */}
                <DatePicker
                    selected={props.ready}
                    onChange={props.setReadyBy}
                    showTimeSelect
                    filterTime={getTimeValid}
                    minDate={new Date()}
                    timeIntervals={5}
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
            </label>
        </Validate>
        <br />
        {/* uses a ternary statement (which is basically shorthand for if)
        to not show address inputs if you're doing pickup */}
        {props.delivery?addressPicker:null}
    </div>
}



// takes string and filters out numbers
function filterNumbers(v){
    // uses a regex from here to filter only letters and spaces (\s)
    // https://stackoverflow.com/questions/58259610/how-do-i-filter-out-a-string-to-contain-only-letters-in-vanilla-javascript
    return v.replace(/[^a-z\s'.]+/gi, '')
}

// takes string and filters out letters
function filterLetters(v){
    return v.replaceAll(/\D+/g, "") // matches all non numbers
}

// gets what the datetime will be in plusMins time
function getDatePlus(plusMins){
    return new Date(new Date().getTime() + 1000*60*plusMins)
}


// Component to encapsulate checkout form (name, payment, delivery)
// takes the list of pizzas in the current order
export class Checkout extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {...new OrderRecord(-1, getDatePlus(20), true, "", "", false, "", "", ""), feedback: []}
    }

    render(){

        ///////// ONCHANGE HANDLERS //////////
        // mostly just sets state to the value
        // these are passed to the components so that they can call these and set state
        const handleCashChange = e=>this.setState({cash: e.target.checked})
        const handleAddrChange = e=>this.setState({address: e.target.value})
        const handleDeliveryChange = e=>this.setState({delivery: e.target.checked})
        // name dosent allow numbers
        const handleNameChange = e=>this.setState({name: filterNumbers(e.target.value)})
        // postcode dosent allow letters
        const handlePostChange = e=>this.setState({postcode: filterLetters(e.target.value).substring(0, 4)})
        const handleCcvChange = e=>this.setState({ccv: filterLetters(e.target.value).substring(0, 3)})
        const handleCcNumChange = e=>this.setState({credit_card: filterLetters(e.target.value).substring(0, 16)}) 
        const handleReadyByChange = date=>this.setState({ready_by: date})
        

        //////////// CALCULATE TOTAL /////////////
        const prices = this.props.pizzas.map(
            // each pizza has a method to calculate its individual price
            pizza=>pizza.getPrice()
        )
        const total = sum(prices)

        //////////// HANDLE SUBMIT /////////////
        const handleCreateOrder = ()=>{
            // get the next avalible id from database
            // passes createOrder as a callback that will be called after getting the id
            database.getId(createOrder)
            // adds loading to the feedback that will show up below the submit button
            this.setState({feedback: [...this.state.feedback, {text:"Loading...", status:true}]})
        }

        // callback after getting id
        const createOrder = order_id=>{
            // this.state has all the properties of OrderRecord but is not actually an instance of it
            // need to create a new orderRecord so you can call methods
            const order = Object.assign(new OrderRecord, this.state)
            order.id = order_id
            // sends order to database, has a callback which will set feedback
            database.addOrder(
                order,
                res=>{
                    console.log("added order, res:", res);
                    if(!res.startsWith("error")){
                        this.setState({feedback: [...this.state.feedback, {text:"Added order ", status:true}]})
                    }else{
                        this.setState({feedback: [...this.state.feedback, {text:`Failed to add order: ${res}`, status:false}]})
                    }
                }
            )
            // goes through sending each pizza
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

        // checks if all inputs are valid and we can create an order
        const validateInput = ()=>{
            return (
                Object.assign(new OrderRecord(), this.state).validate() &&
                this.props.pizzas.length >= 1 &&
                this.state.feedback.length == 0
            )
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
                <Validate valid={this.state.feedback.length==0} text="Submitted, check below for comfirmation">
                    <Validate valid={this.props.pizzas.length>=1} text="Must have at least one pizza">
                        <button onClick={handleCreateOrder} disabled={!validateInput()}>Order</button>
                    </Validate>
                </Validate>
                <br />
                {this.state.feedback.map((obj, idx)=>{return <p key={idx} className={obj.status?"green":"red"}>{obj.text}</p>})}
                {this.state.feedback.length==0?null:<button onClick={_=>location.reload()}>New order</button>}
            </div>
        )
    }
}

export default Checkout;