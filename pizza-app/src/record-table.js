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
            (<td onClick={toggleExpanded} className="noselect">{props.record.ingredients.toString()}</td>)
            :
            (<td onClick={toggleExpanded} className="noselect">{props.record.ingredients.length}#</td>)
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
    // state is only used to make component update
    const [getter, setter] = React.useState(0)
    const [ showFilled, setShowFilled] = React.useState(false);

    const handleFilled = (record)=>{
        const newRecord = record;
        newRecord.filled = true;
        const idx = database.records.indexOf(record)
        console.log(record)
        database.setRecord(idx, newRecord);
        setter(Math.random())
    }

    const toggleShowFilled = ()=>{setShowFilled(!showFilled)}

    let shownRecords
    if(showFilled){
        shownRecords = database.records;
    }else{
        shownRecords = database.records.filter(r=>!r.filled);

    }
    
    return (
        <Popup close={props.close}>
            <input type="checkbox" name="filled-checkbox" value={showFilled} onClick={toggleShowFilled}></input>
            <label htmlFor="filled-checkbox" onClick={toggleShowFilled}>Show filled orders?</label>
            <br></br>
            <table id="record-inner">
                <thead>
                    <tr>
                        <th>Fill</th>
                        <th>Has filled</th>
                        <th>Id</th>
                        <th>DueTime</th>
                        <th>Name</th>
                        <th>Cash</th>
                        <th>Price</th>
                        <th>Ingredients (Click to expand)</th>
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