console.log(database.records);

function createTable(orders){
    for(const order of orders){
        console.log(order)
    }
}

createTable(database.records)