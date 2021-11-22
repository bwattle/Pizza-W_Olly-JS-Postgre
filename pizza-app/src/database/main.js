import { getKeyByValue } from "../common/utils";
import React from "react";
import ReactDOM from "react-dom"
import { database } from "../common/database";

import "../common/topbar.css"
import "../common/common.css"
import "./style.css"


function Table(props){
    if(!props.res.fields){
        return <div>Loading...</div>
    }

    function checkRow(row, text){
        return Object.values(row).some(x=>x.toString().toLowerCase().includes(text))
    }

    let rows;
    if(props.filter.length > 1){
        rows = props.res.rows.filter(row=>checkRow(row, props.filter))
    }else{
        rows = props.res.rows
    }

    const fields = props.res.fields
    const colWidths = fields.map(field=>field.name.length) // create array 0's with length of fields
    for(const row of props.res.rows){
        for(let i=0; i<fields.length; i++){
            const key = Object.keys(row)[i];
            colWidths[i] = Math.max(row[key].toString().length, colWidths[i])
        }
    }

    return (
        <table>
            <thead><tr>
                {fields.map((val, idx)=>(<th key={idx} style={{width: `${colWidths[idx]}ch`}}>{val.name}</th>))}
            </tr></thead>
            <tbody onMouseLeave={()=>props.setHover(-1)}>
                {rows.map((row, idx)=>
                    <tr 
                        onMouseEnter={()=>props.setHover(row[props.hover_name])}
                        className={(row[props.hover_name] == props.hover_id)?"row-hovered":""}
                        key={row.id}
                    >
                        {fields.map((field, idx)=><td key={idx}>{row[field.name].toString()}</td>)}
                    </tr>
                )}
            </tbody>
        </table>
    )
}

function App(){
    const [ orders, setOrders ] = React.useState("loading...")
    const [ pizzas, setPizzas ] = React.useState("loading...")
    const [ hovering, setHovering ] = React.useState(-1)
    const [ filter, setFilter ] = React.useState("")

    const handleFilterChange = event=>{
        setFilter(event.target.value)
    }

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
            <label>
                Filter: 
                <input type="text" value={filter} onChange={handleFilterChange} ></input>
            </label>
            <br /><br />
            Pizzas
            <Table res={pizzas} hover_name="order_id" hover_id={hovering} setHover={setHovering} filter={filter} />
            <br />
            Orders
            <Table res={orders} hover_name="id" hover_id={hovering} setHover={setHovering} filter={filter} />
        </div>
    )
}

const domContainer = document.getElementById('outer-div');
ReactDOM.render(<App />, domContainer);