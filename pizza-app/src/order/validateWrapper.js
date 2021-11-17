import "../common/common.css"

function Validate(props){
    return (
        <span>
            {props.children}
            {props.valid?null:<span className="red noselect">*{props.text||""}</span>}
        </span>
    )
}

export default Validate;