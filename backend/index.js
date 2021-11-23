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

// for debugging
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
                $1,$2,$3,$4,$5,$6,$7,$8,$9
            );`
            const values = [
                req.query.id,
                new Date(parseFloat(req.query.ready_by)),
                req.query.delivery,
                req.query.address,
                req.query.postcode,
                req.query.cash,
                req.query.name,
                req.query.credit_card,
                req.query.ccv,
            ]
            pool.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query', err.stack)
                    res.send("error, "+err.stack)
                }
                res.send(result)
            })

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
                $1,$2,$3
            );`
            const values = [
                parseInt(req.query.order_id),
                req.query.ingredients,
                parseInt(req.query.quantity)
            ]
            console.log(query);
            pool.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query', err.stack)
                    res.send("error, "+err.stack)
                }
                res.send(result)
            })
        }else{
            res.send("error, incorrect data")
        }
    }catch(err){
        res.send("error, invaid data")
    }
})

// to allow manual queries for administrative purposes
// return file that provides a interface to send queries
app.get("/query", (req, res)=>{
    res.sendFile('query.html', {root: __dirname })
})
app.get("/_query", (req, res)=>{
    try{
        console.log(req.query.q, req.query.p);
        // password should be stored in an env variable in a real system
        if(req.query.q && req.query.p == "1234"){
            makeQuery(req.query.q, x=>res.send(x))
        }
    }catch(err){
        res.send(err)
    }
})
/*
to clear all tables:
delete tables
DROP TABLE "OrderItems";
DROP TABLE "Orders";
re-create them with what is in schema.sql
*/


/*
clients get an id to use before they create an order
if one client gets an id and in the time before it creates an order with that id another client gets an id
they will both get the same id and the order will get overwritten
to fix this we keep track of which ids we have send recently and dont send the same two
*/
let leasedIds = []
app.get("/get-id", (req, res)=>{
    makeQuery(`SELECT MAX(id) AS FirstId
    FROM "Orders";`, (sqlRes)=>{
        // gets the highest id the server has +1
        let responseId = parseInt(sqlRes.rows[0].firstid)+1
        if(responseId.toString() == "NaN"){ // a MAX() query returns NaN if there are no records
            responseId = 0
        }

        // incriment is untill we get a free one
        while(leasedIds.includes(responseId)){
            responseId++;
        }
        // add to leasedIds
        leasedIds.push(responseId)
        // sets timeout to remove id from leased list after 10 seconds
        setTimeout(()=>{console.log(`removed id: ${responseId}`);leasedIds=leasedIds.filter(x=>x!=responseId)}, 10000)
        console.log(`[${new Date().toISOString()}] gave out id ${responseId}\tleasedId's:${leasedIds}`);
        res.send(responseId.toString())
    });
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})