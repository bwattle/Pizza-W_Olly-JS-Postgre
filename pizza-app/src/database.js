import { allIngredients } from "./ingredient-selector";

// will use localstorage to store records
class Database{
    constructor(){
        this.records = JSON.parse(localStorage.getItem("records"))
        if(!this.records){ // localstorage didnt have a records entry
            this.records = [];
            this._saveRecords();
        }
        console.log(this.records);
    }
    addRecord(record){
        if(this.getRecordFromUid(record.uid)){
            throw "Tried to add duplice uid"
        }
        this.records.push(record)
        this._saveRecords();
    }
    setRecord(idx, record){
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

// create single instance to share everywhere
const database = new Database();

class OrderRecord {
    constructor(ingredients, deliveryDate, name, payment, price, id){
        this.ingredients = ingredients; // array of ingredient strings
        this.deliveryDate = deliveryDate; // number as seconds since epoch
        this.name = name; // string
        this.payment = payment; // either "cash" or "card"
        this.price = price;
        this.id = id;

        if(!this.validate()){
            throw "Invaid OrderRecord"
        }
    }

    // make sure all the data is in the correct format
    validate(){
        return (
            // ingredients is an array
            Array.isArray(this.ingredients) &&
            // every item in ingredients array is in allIngredient's keys
            this.ingredients.every( x=>Object.keys(allIngredients).includes(x) ) && 
            // self explanatory
            typeof this.name == "string" &&
            typeof this.deliveryDate == "number" &&
            (this.payment == "cash" || this.payment == "card") &&
            typeof this.price == "number" &&
            typeof this.id == "number"
        )
    }
}

export { database, OrderRecord };