import "../common/common.css"

// component that wraps another
// shows a red astrix if the 'valid' from evaluates to false
// you can also specity text to display with 'text'
function Validate(props){
    return (
        <div>
            {props.children}
            {props.valid?null:<span className="red noselect">*{props.text||""}</span>}
        </div>
    )
}

export default Validate;