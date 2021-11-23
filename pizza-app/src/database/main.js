import React from "react";
import ReactDOM from "react-dom"
import { database } from "../common/database";

import "../common/topbar.css"
import "../common/common.css"
import "./style.css"

// takes a string and text to search for
// returns the string with any instances of text surrounded by <mark>
function TableItem(props){
    if(props.text.length >= 1){
        // uses dangerouslySetInnerHTML beacuse otherwise strings are not treated as html
        // this could cause xss
        return (<td
            dangerouslySetInnerHTML={{__html: props.string.toLowerCase().replace(props.text, `<mark>${props.text}</mark>`)}}
        ></td>)
    }else{
        return <td>{props.string}</td>
    }
}

// takes a row and text to search for
// return null if no matches and the row with text highlighted if there are matches 
function TableRow(props){
    // check if there are no matches first
    if(Object.values(props.row).some(x=>x.toString().toLowerCase().includes(props.filter))){
        return (
            <tr onMouseEnter={()=>props.setHover(props.row[props.hover_name])}
                className={(props.row[props.hover_name] == props.hover_id)?"row-hovered":""}
                key={props.row.id}
            >
                {Object.keys(props.row).map(
                    (field, idx)=><TableItem string={props.row[field].toString()} text={props.filter} key={idx} />
                )}
            </tr>
        )
    }else{
        return null
    }
}

// polymorphic component to display both tables
function Table(props){
    if(!props.res.fields){
        return <div>Loading...</div>
    }

    const fields = props.res.fields
    // find the maxium width of each field to set table widths
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
                {props.res.rows.map((row, idx)=>
                    <TableRow key={row.id} row={row} {...props} />
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
        setFilter(event.target.value.toLowerCase())
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