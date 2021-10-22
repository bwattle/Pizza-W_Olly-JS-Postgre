import { database } from "./database.js";
import React from "react";

function RecordEntry(props){
    const [ expanded, setExpanded ] = React.useState(false)
    const toggleExpanded = ()=>{setExpanded(!expanded)}
    return (
        <tr>
            <td><button onClick={()=>props.onFilled(props.record)}>Fill</button></td>
            <td>{props.record.filled.toString()}</td>
            <td>{props.record.id}</td>
            <td>{props.record.deliveryDate}</td>
            <td>{props.record.name}</td>
            <td>{ (props.record.payment == "cash").toString() }</td>
            <td>${props.record.price}</td>
            {expanded?
            (<td onClick={toggleExpanded} className="noselect hoverable">{props.record.ingredients.toString()}</td>)
            :
            (<td onClick={toggleExpanded} className="noselect hoverable">{props.record.ingredients.length}#</td>)
            }
        </tr>
    )
}

function Popup(props){
    return (
        <div className="popup-outer">
            <div className="popup-background" onClick={props.close}></div>
            <div className="popup-window">
                {props.children}
            </div>
        </div>
    )
}

// component to display a list of records in a popup
function RecordTable(props){
    // this state is only used to make component update
    const [_, update] = React.useState(0)
    const [ showFilled, setShowFilled] = React.useState(false);
    const [ sortingBy, setSortingBy ] = React.useState("deliveryDate")
    const [ sortReverse, setSortReverse ] = React.useState(false)

    const handleFilled = (record)=>{
        const newRecord = record;
        newRecord.filled = true;
        const idx = database.records.indexOf(record)
        console.log(record)
        database.setRecord(idx, newRecord);
        update(Math.random())
    }

    const toggleShowFilled = ()=>{setShowFilled(!showFilled)}

    let shownRecords
    if(showFilled){
        shownRecords = database.records;
    }else{
        shownRecords = database.records.filter(r=>!r.filled);
    }

    // you can access class attributes with square bracket notation
    const compareFunc = (a, b)=>{
        if(sortReverse){
            return (a[sortingBy]>b[sortingBy])?1:-1 // have to convert bool to -1 and 1
        }else{
            return (a[sortingBy]<b[sortingBy])?1:-1
        }
    }
    shownRecords.sort(compareFunc)
    const sortSymbol = sortReverse?"▴":"▾"

    // name prop has to match OrderRecord attributes
    const TableHeader = (props)=>{
        const handleClick = event => {
            if(sortingBy == props.name){
                setSortReverse(!sortReverse)
            }else{
                setSortingBy(props.name)
            }
        }
        return <th className="hoverable table-sortable noselect" onClick={handleClick}>{props.display} {sortingBy==props.name?sortSymbol:null}</th>
    }
    
    return (
        <Popup close={props.close}>
            <input type="checkbox" name="filled-checkbox" value={showFilled} onChange={toggleShowFilled}></input>
            <label htmlFor="filled-checkbox">Show filled orders?</label>
            <br></br>
            <table id="record-inner">
                <thead>
                    <tr>
                        <th>Fill</th>
                        <TableHeader display="Has filled" name="filled" />
                        <th>Id</th>
                        <TableHeader display="DueTime" name="deliveryDate" />
                        <th>Name</th>
                        <TableHeader display="Cash" name="payment" />
                        <TableHeader display="Price" name="price" />
                        <th>Ingredients</th>
                    </tr>
                </thead>
                <tbody>
                    {shownRecords.map(record=><RecordEntry onFilled={handleFilled} key={record.id} record={record} />)}
                </tbody>
            </table>
        </Popup>
    )
}

export default RecordTable;