import { sum, httpGetAsync } from "./utils"

let database_url;
if(window.location.hostname == "localhost"){
    database_url = "http://localhost:3000"
}else{
    database_url = "https://pizza-db.herokuapp.com"
}
console.log("api", database_url)

// uses localstorage to store records
// TODO: change to use remote sql database
class Database{
    constructor(){
        this.orders = [];
        this.pizzas = [];
    }
    addOrder(record, callback){
        if( !(record instanceof OrderRecord)){
            console.log(record);
            throw "Tried to add non record"
        }
        if(!record.validate()){
            console.log(record);
            throw "Tried to add invaid order"
        }
        const queryString = new URLSearchParams([
            ["id", record.id.toString()],
            ["ready_by", record.ready_by.getTime().toString()],
            ["delivery", record.delivery],
            ["address", record.address || "null"],
            ["postcode", record.postcode || "null"],
            ["cash", record.cash],
            ["name", record.name],
            ["credit_card", record.credit_card || "null"],
            ["ccv", record.ccv || "null"],
        ])
        let url = `${database_url}/create-order?${queryString}`
        console.log(url);
        httpGetAsync(url, callback)
    }
    addPizza(pizza, order_id, callback){
        if( !(pizza instanceof Pizza) ){
            throw "Tried to add non pizza"
        }
        if(!pizza.validate()){
            throw "Tried to add invalid pizza"
        }
        const queryString = new URLSearchParams([
            ["ingredients", pizza.ingredients],
            ["quantity", pizza.quantity],
            ["order_id", order_id],
        ]).toString()
        let url = `${database_url}/create-pizza?${queryString}`
        console.log(url);
        httpGetAsync(url, callback)
    }
    getPizzas(callback){
        httpGetAsync(`${database_url}/list-pizzas`, res=>callback(JSON.parse(res)))
    }
    getOrders(callback){
        httpGetAsync(`${database_url}/list-orders`, res=>callback(JSON.parse(res)))
    }
    getId(callback){
        httpGetAsync(`${database_url}/get-id`, res=>callback(parseInt(res)))
    }
}

class OrderRecord {
    // set id as undefined for temp records
    constructor(id, readyBy, delivery, address, postcode, cash, name, credit_card, ccv){
        this.id = id
        this.ready_by = readyBy; // as js date object
        this.delivery = delivery;
        this.address = address;
        this.postcode = postcode;
        this.cash = cash;
        this.name = name;
        this.credit_card = credit_card;
        this.ccv = ccv;
    }

    // make sure all the data is in the correct format
    validate(){
        return (
            this.ready_by instanceof Date &&
            typeof this.delivery == "boolean" &&
            ((!this.delivery) || (
                typeof this.address == "string" && this.address.length >= 1 &&
                typeof this.postcode == "string" && this.postcode.length == 4)) &&
            typeof this.cash == "boolean" &&
            typeof this.name == "string" && this.name.length >= 1 &&
            ( this.cash || (typeof this.credit_card == "string" && this.credit_card.length >= 14 &&
                typeof this.ccv == "string" && this.ccv.length == 3)) &&
            (typeof this.id == "number" || this.id == undefined)
        )
    }
}

// represents a pizza in a order
class Pizza {
    constructor(ingredients, quantity, id, orderId){
        this.ingredients = ingredients
        this.quantity = quantity
        this.id = id
        this.orderId = orderId
        this.localId = Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);
    }
    validate(){
        return (
            // ingredients is an array
            Array.isArray(this.ingredients) &&
            // every item in ingredients array is in allIngredient's keys
            this.ingredients.every( x=>Object.keys(allIngredients).includes(x) ) &&
            typeof this.quantity == "number" &&
            (typeof this.id == "number" || this.id == undefined) &&
            (typeof this.orderId == "number" || this.orderId == undefined)
        )
    }
    getPrice(){
        const singlePrice = sum(this.ingredients.map(i=>allIngredients[i].price))
        return (singlePrice + basePizzaPrice) * this.quantity
    }
}

// staic factory method
Pizza.newEmptyPizza = ()=>new Pizza([], 1) 


const basePizzaPrice = 6;
// provides a mapping between interal names and display names
const allIngredients = {
    cheese:      { name: "Cheese", price: 1 },
    beef:        { name: "Ground beef", price: 2 },
    ham:         { name: "Ham", price: 2 },
    pep:         { name: "Sliced Pepperoni", price: 2 },
    mushroom:    { name: "Mushrooms", price: 1 },
    tomato:      { name: "Tomato Chunks", price: 1 },
    spinach:     { name: "Spinach", price: 1 },
    bacon:       { name: "Bacon", price: 3 },
    onion:       { name: "Red Onion", price: 1 },
    pineapple:   { name: "Pineapple", price: 1/0 },
    prawn:       { name: "Prawns", price: 3 },
    olive:       { name: "Olives", price: 2 },
}

// create single instance to share everywhere
const database = new Database();

export { database, OrderRecord, Pizza, allIngredients, basePizzaPrice, database_url };