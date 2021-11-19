import "../common/common.css"

function Validate(props){
    return (
        <div>
            {props.children}
            {props.valid?null:<span className="red noselect">*{props.text||""}</span>}
        </div>
    )
}

export default Validate;