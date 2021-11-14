const { Pool } = require('pg')
const express = require('express')
const fs = require("fs")


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
    // let bodyText = ""
    // console.log("got database reponse, rows", res.rowCount)
    // for(const row of res.rows){
    //     bodyText += JSON.stringify(row);
    //     bodyText += "\n"
    // }
    // reqRes.send(bodyText)
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
    x=>res.send(x))
})

app.get("/list-orders", (req, res)=>{
    console.log("list orders");
    makeQuery(`SELECT * FROM "Orders"`, x=>res.send(x))
})

app.post("/create-order", (req, res)=>{

})

app.post("/create-pizza", (req, res)=>{
    
})

app.get("/clean", (req, res)=>{
    console.log("dropping tables");
    makeQuery(`DROP TABLE "OrderItems";
DROP TABLE "Orders";
DROP TABLE "Customers";`, x=>res.send(x))
    // createTables()
})

app.get("/create-tables", (req, res)=>{
    console.log("creating tables");
    createTables();
    res.send("success!")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})