import { database } from "./database.js";

function RecordEntry(props){
    return (
        <tr>
            <td>{props.record.id}</td>
            <td>{props.record.deliveryDate}</td>
            <td>{props.record.name}</td>
            <td>{ (props.record.payment == "cash").toString() }</td>
            <td>${props.record.price}</td>
            <td>{props.record.ingredients}</td>
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
    return (
        <Popup close={props.close}>
            <table id="record-inner">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>DueTime</th>
                        <th>Name</th>
                        <th>Cash</th>
                        <th>Price</th>
                        <th>Ingredients</th>
                    </tr>
                </thead>
                <tbody>
                    {database.records.map(record=><RecordEntry key={record.id} record={record} />)}
                </tbody>
            </table>
        </Popup>
    )
}

export default RecordTable;