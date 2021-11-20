const { Pool } = require('pg')
const express = require('express')
const fs = require("fs")
const cors = require('cors')

// push with
// git subtree push --prefix backend heroku master


const app = express()
app.use(cors())
const port = process.env.PORT || 3000

console.log(process.env.DATABASE_URL);

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

function makeQuery(query, callback){
    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack)
            callback(err.stack)
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

app.get("/create-order", (req, res)=>{
    // validate data
    try{
        if(
            (
                (req.query.delivery == "true" && 
                req.query.address.length >= 1 &&
                req.query.postcode.length == 4)
            ||
                req.query.delivery == "false"
            ) && (
                (req.query.cash == "false" &&
                req.query.credit_card.length >= 14 && req.query.credit_card.length < 19 &&
                req.query.ccv.length == 3)
            ||
                req.query.cash == "true"
            ) &&
            req.query.name.length >= 1 &&
            parseInt(req.query.id) < 2**31
        ){
            const query = `INSERT INTO "Orders" (
                id,
                ready_by,
                delivery,
                address,
                postcode,
                cash,
                name,
                credit_card,
                ccv)
            VALUES (
                ${req.query.id},
                '${new Date(parseFloat(req.query.ready_by)).toISOString()}',
                '${req.query.delivery}',
                '${req.query.address}',
                '${req.query.postcode}',
                '${req.query.cash}',
                '${req.query.name}',
                '${req.query.credit_card}',
                '${req.query.ccv}'
            );`
            console.log(query);
            makeQuery(query, x=>res.send(x))
        }else{
            res.send("error, incorrect data")
        }
    }catch(err){
        res.send("error, invaid data")
    }
})

app.get("/create-pizza", (req, res)=>{
    try{
        if(
            parseInt(req.query.order_id) &&
            parseInt(req.query.quantity)

        ){
            const query = `INSERT INTO "OrderItems" (
                order_id,
                ingredients,
                quantity)
            VALUES (
                ${parseInt(req.query.order_id)},
                '${req.query.ingredients}',
                ${parseInt(req.query.quantity)}
            );`
            console.log(query);
            makeQuery(query, x=>res.send(x))
        }else{
            res.send("error, incorrect data")
        }
    }catch(err){
        res.send("error, invaid data")
    }
})

app.get("/query", (req, res)=>{
    res.sendFile('query.html', {root: __dirname })
})
app.get("/_query", (req, res)=>{
    try{
        console.log(req.query.q, req.query.p);
        if(req.query.q && req.query.p == "1234"){
            makeQuery(req.query.q, x=>res.send(x))
        }
    }catch(err){
        res.send(err)
    }
})

/*
clean:
DROP TABLE OrderItems;
DROP TABLE Orders;
*/


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})