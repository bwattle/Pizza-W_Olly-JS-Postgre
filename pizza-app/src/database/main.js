import { getKeyByValue } from "../common/utils";
import React from "react";
import ReactDOM from "react-dom"
import { database } from "../common/database";

import "../common/topbar.css"
import "../common/common.css"
import "./style.css"


function Table(props){
    if(props.res == "loading..."){
        return <div>Loading</div>
    }
    console.log(props.res);
    // const fieldsTypes = props.res.fields.map(val=>getKeyByValue(props.res._types._types.builtins, val.dataTypeId))
    const rows = props.res.rows
    const colWidths = props.res.fields.map(field=>field.name.length) // create array 0's with length of fields
    for(const row of props.res.rows){
        for(let i=0; i<props.res.fields.length; i++){
            const key = Object.keys(row)[i];
            colWidths[i] = Math.max(row[key].toString().length, colWidths[i])
        }
    }

    return (
        <table>
            <thead><tr>
                {props.res.fields.map((val, idx)=>(<th key={idx} style={{width: `${colWidths[idx]}ch`}}>{val.name}</th>))}
            </tr></thead>
            <tbody>
                {rows.map((pizza, idx)=>(
                    <tr className={"pizza-"+pizza.order_id} key={pizza.id}>
                        {props.res.fields.map((field, idx)=><td key={idx}>{pizza[field.name].toString()}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function App(){
    const [ orders, setOrders ] = React.useState("loading...")
    const [ pizzas, setPizzas ] = React.useState("loading...")

    React.useEffect(()=>{
        database.getOrders((res)=>{
            setOrders(res)
        })
        database.getPizzas((res)=>{
            setPizzas(res)
        })
    }, [])

    return (
        <div id="tables-div">
            Pizzas
            <Table res={pizzas} />
            <br />
            Orders
            <Table res={orders} />
        </div>
    )
}

const domContainer = document.getElementById('outer-div');
ReactDOM.render(<App />, domContainer);