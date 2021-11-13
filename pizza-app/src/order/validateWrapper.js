
function Validate(props){
    return (
        <div>
            {props.children}
            {props.valid?null:<span className="red">*{props.text||""}</span>}
        </div>
    )
}

export default Validate;