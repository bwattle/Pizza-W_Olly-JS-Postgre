import { allIngredients } from "../order/ingredient-selector";

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
            const newRecord = new OrderRecord([], 0, "", "cash", 0, -1)
            Object.assign(newRecord, record)
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
    constructor(items, deliveryDate, name, payment, price, id){
        this.items = items; // array of pizzas
        this.deliveryDate = deliveryDate; // number as seconds since epoch
        this.name = name; // string
        this.payment = payment; // either "cash" or "card"
        this.price = price; // number
        this.id = id; // large number
        this.filled = false;

        if(!this.validate()){
            throw "Invaid OrderRecord"
        }
    }

    // make sure all the data is in the correct format
    validate(){
        return (
            // all pizzas are valid
            this.items.every(item=>item.validate()) &&
            // self explanatory
            typeof this.name == "string" &&
            typeof this.deliveryDate == "number" &&
            (this.payment == "cash" || this.payment == "card") &&
            typeof this.price == "number" &&
            typeof this.id == "number" &&
            typeof this.filled == "boolean"
        )
    }
}


// represents a pizza in a order
class OrderItem{
    constructor(ingredients){
        if(ingredients == undefined){
            this.ingredients = []
        }else{
            this.ingredients = ingredients
        }
        this.id = Math.random()*Number.MAX_SAFE_INTEGER
    }
    validate(){
        return (
            // ingredients is an array
            Array.isArray(this.ingredients) &&
            // every item in ingredients array is in allIngredient's keys
            this.ingredients.every( x=>Object.keys(allIngredients).includes(x) )
        )
    }
}

// create single instance to share everywhere
const database = new Database();

export { database, OrderRecord, OrderItem };