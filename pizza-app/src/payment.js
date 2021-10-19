import React from 'react';

function OnlinePayment(props){
    return (
        <div>
            <p>Online payment stuff goes here</p>
        </div>
    )
}

function Payment(props){
    const [ cash, setCash ] = React.useState(false);

    const handleChange = (event) => {
        setCash(event.target.checked);
    };


    return (
        <div>
            <label htmlFor="payType">Paying cash?</label>
            <input type="checkbox" id="cash-checkbox" name="payType" value={cash} onChange={handleChange}></input>
            {cash?<OnlinePayment />:null}
        </div>
    )
}

export default Payment;