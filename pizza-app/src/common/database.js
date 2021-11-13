import { sum } from "./utils"

// uses localstorage to store records
// TODO: change to use remote sql database
class Database{
    constructor(){
        this.records = JSON.parse(localStorage.getItem("records"))
        if(!this.records){ // localstorage didnt have a records entry
            this.records = [];
            this._saveRecords();
        }

        // beacuse they are storaged in json when the get parse out they are plain objects, not class objects
        // creates dummy OrderRecord instances and sets all attributes
        this.newRecords = []
        for(let record of this.records){
            const newRecord = new OrderRecord([], new Date(), false, -1)
            // Object.assign(newRecord, record)
            this.newRecords.push(newRecord);
        }
        this.records = this.newRecords;
    }
    addRecord(record){
        if( !(record instanceof OrderRecord)){
            throw "Tried to add non record"
        }
        if(this.getRecordFromUid(record.uid)){
            throw "Tried to add duplice uid"
        }
        this.records.push(record)
        this._saveRecords();
    }
    setRecord(idx, record){
        if( !(record instanceof OrderRecord)){
            throw "Tried to set non record"
        }
        this.records[idx] = record;
        this._saveRecords();
    }
    // gets record with uid, false otherwise
    getRecordFromUid(id){
        const matching = this.records.filter((record)=>record.id==id);
        if(matching.length == 0){
            return false;
        }else{
            return matching[0];
        }
    }
    // updates localstorage to reflect current class state
    _saveRecords(){
        localStorage.setItem("records", JSON.stringify(this.records))
    }
}


class OrderRecord {
    constructor(items, deliveryDate, cash){
        this.items = items; // array of pizzas
        this.ready_by = deliveryDate; // as js date object
        this.cash = cash; // boolean

        if(!this.validate()){
            throw "Invaid OrderRecord"
        }
    }

    // make sure all the data is in the correct format
    validate(){
        return (
            // all pizzas are valid
            this.items.every(item=>item instanceof Pizza && item.validate()) &&
            this.ready_by instanceof Date &&
            typeof this.cash == "boolean"
        )
    }

    getPrices(){
        return sum(this.items.map(x=>x.getPrice()))
    }
}

// represents a pizza in a order
class Pizza {
    constructor(ingredients, quantity, id){
        this.ingredients = ingredients
        this.quantity = quantity
        if(id == undefined){
            this.id = Math.random()*Number.MAX_SAFE_INTEGER
        }else{
            this.id = id
        }
    }
    validate(){
        return (
            // ingredients is an array
            Array.isArray(this.ingredients) &&
            // every item in ingredients array is in allIngredient's keys
            this.ingredients.every( x=>Object.keys(allIngredients).includes(x) )
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
    pineapple:   { name: "Pineapple", price: 9999 },
    prawn:       { name: "Prawns", price: 3 },
}

const orderBasePrice = 2; // delivery ect

// create single instance to share everywhere
const database = new Database();

export { database, OrderRecord, Pizza, allIngredients, basePizzaPrice, orderBasePrice };