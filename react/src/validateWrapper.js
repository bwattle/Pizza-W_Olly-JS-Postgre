
function Validate(props){
    return (
        <div>
            {props.children}
            {props.valid?null:<span className="red">*</span>}
        </div>
    )
}

export default Validate;