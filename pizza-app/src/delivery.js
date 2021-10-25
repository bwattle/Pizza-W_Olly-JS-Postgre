import React from "react"

const Delivery = (props) => {
    const [ address, setAddress ] = React.useState("")
    const [ suburb, setSuburb ] = React.useState("")
    const [ postCode, setPostcode ] = React.useState("")

    return (
        <div id="delivery">
            <div>
                date picker
            </div>
            <div>
                <label>Street address:
                    <input onChange={handleAddrChange} value={address} type="text"></input>
                </label>
                <br />
                <label>Suburb:
                    <input onChange={handleSubrChange} value={suburb} type="text"></input>
                </label>
                <br />
                <label>Postcode:
                    <input onChange={handlePostChange} value={postcode} type="text"></input>
                </label>
            </div>
        </div>
    )
}

export default Delivery;