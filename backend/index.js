const { Client } = require('pg')
const express = require('express')

const app = express()
const port = 3000

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})

/**
 * 
 * @param {string} where sql WHERE query
 * @param {*} res respose to send to once done
 */
function getOrders(where, reqRes){
    client.connect()
    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) =>{
        if(err){
            reqRes.send(err)
            throw err
        }
        for(let row of res.rows){
            console.log(JSON.stringify(row))
            reqRes.send(JSON.stringify(row))
        }
        cliend.end()
    })
}



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/list-pizzas", (req, res)=>{
    console.log("params ", req.params)
    getOrders(res)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})