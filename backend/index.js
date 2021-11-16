const { Pool } = require('pg')
const express = require('express')
const fs = require("fs")

// push with
// git subtree push --prefix backend heroku master


const app = express()
const port = process.env.PORT || 3000

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

// creates tables from schema.sql
function createTables(){
    const data = fs.readFileSync('./schema.sql', 'utf8')
    console.log("trying to create tables")
    pool.query(data, (err, res)=>{
        if(err){
            console.log("error creating tables");
            console.log(err);
        }else{
            console.log("successfully created tables");
            console.log(res);
        }
    })
}


/**
 * 
 * @param {string} query sql query
 * @param {*} reqRes respose to send to once done
 */
function makeQuery(query, callback){
    pool.query(query, (err, result) => {
        if (err) {
            return console.error('Error executing query', err.stack)
        }
        callback(result)
    })
}

app.get('/', (req, res) => {
    console.log("params ", req.params)
    res.send('Hello World!')
})

app.get("/list-tables", (req, res)=>{
    console.log("list tables");
    // https://www.postgresqltutorial.com/postgresql-show-tables/
    makeQuery(`SELECT *
FROM pg_catalog.pg_tables
WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`,
    x=>res.send("rowCount: "+x.rowCount+"<br>"+JSON.stringify(x.rows)))
})

app.get("/list-orders", (req, res)=>{
    console.log("list orders");
    makeQuery(`SELECT * FROM "Orders"`, x=>res.send(x))
})
app.get("/list-pizzas", (req, res)=>{
    console.log("list pizzas");
    makeQuery(`SELECT * FROM "OrderItems"`, x=>res.send(x))
})

app.get("/get-order-fields", (req, res)=>{
    console.log("list order fields");
    makeQuery(
        `SELECT
            column_name,
            data_type
        FROM
            information_schema.columns
        WHERE
            table_name = 'Orders';`,
     x=>res.send(x.rows))
})
app.get("/get-pizza-fields", (req, res)=>{
    console.log("list pizza fields");
    makeQuery(
        `SELECT
            column_name,
            data_type
        FROM
            information_schema.columns
        WHERE
            table_name = 'OrdersItems';`,
     x=>res.send(x.rows))
})

const checkTwoDigit = (val, min, max)=>{
    return  val.length == 2 && parseInt(val) >= min && parseInt(val) <= max
}
// app.post("/create-order", (req, res)=>{
//     // validate data
//     if(req.query.year.length == 4 && 
//         req.query.month.length == 2 && parseInt(req.query.month) >= 1 && parseInt(req.query.month <= 12) &&
//         checkTwoDigit(req.query.month, 1, 12)
//         req.query.day.length == 2 && parseInt(req.query.day) >= 1 && parseInt(req.query.day) <= 31 &&
//         )
//     const query = `INSERT INTO "Orders" (
//             "ready_by",
//             "delivery",
//             "address",
//             "postcode",
//             "cash",
//             "name",
//             "credit_card",
//             "ccv")
//         VALUES (
//             make_timestamp(${req.query}, 7, 15, 8, 15, 23.5),
            
//         );`
// })

// app.post("/create-pizza", (req, res)=>{
    
// })

app.get("/query", (req, res)=>{
    res.sendFile('query.html', {root: __dirname })
})
app.get("/_query", (req, res)=>{
    console.log(req.query.q, req.query.p);
    if(req.query.q && req.query.p == "1234"){
        makeQuery(req.query.q, x=>res.send(x))
    }
})

/*
clean:
DROP TABLE OrderItems;
DROP TABLE Orders;
*/

// app.get("/create-tables", (req, res)=>{
//     if(req.query.pass == "123456789"){
//         console.log("creating tables");
//         createTables();
//         res.send("attempted making tables")
//     }else{
//         res.send(`Password incorrect, given password: ${JSON.stringify(req.query.pass)}`)
//     }
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})