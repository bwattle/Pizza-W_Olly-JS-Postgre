import React from "react"
import Validate from "./validateWrapper.js"

const Delivery = (props) => {
    const [ address, setAddress ] = React.useState("")
    const [ suburb, setSuburb ] = React.useState("")
    const [ postcode, setPostcode ] = React.useState("")

    const handleAddrChange = (event)=>{
        setAddress(event.target.value);
    }
    const handleSubrChange = (event)=>{
        setSuburb(event.target.value);
    }
    const handlePostChange = (event)=>{
        const re = /\D+/g; // regex to filter to match all nonnumbers
        const nums = event.target.value.replaceAll(re, "")
        const trimmed = nums.substring(0, 4)
        setPostcode(trimmed);
    }

    return (
        <div id="delivery">
            <div>
                date picker
            </div>
            <div>
                <Validate valid={address.length>1}>
                    <label>Street address:
                        <input onChange={handleAddrChange} value={address} type="text"></input>
                    </label>
                </Validate>
                <br />
                <Validate valid={suburb.length>=1}>
                    <label>Suburb:
                        <input onChange={handleSubrChange} value={suburb} type="text"></input>
                    </label>
                </Validate>
                <br />
                <Validate valid={postcode.length==4}>
                    <label>Postcode:
                        <input onChange={handlePostChange} value={postcode} type="text"></input>
                    </label>
                </Validate>
            </div>
        </div>
    )
}

export default Delivery;