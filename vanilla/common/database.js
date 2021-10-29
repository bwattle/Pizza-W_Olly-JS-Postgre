const basePrice = 6;
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


// uses localstorage to store records
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
    constructor(ingredients, deliveryDate, name, payment, price, id){
        this.ingredients = ingredients; // array of ingredient strings
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
            // ingredients is an array
            Array.isArray(this.ingredients) &&
            // every item in ingredients array is in allIngredient's keys
            this.ingredients.every( x=>Object.keys(allIngredients).includes(x) ) && 
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

// create single instance to share everywhere
const database = new Database();
