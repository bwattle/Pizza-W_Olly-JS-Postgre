
function notifyDecorator(message, func){
    return (value)=>{
        const ret = func(value)
        if(ret.length != value.length){
            console.log(message)
            notify(message)
        }
        return ret
    }
}

var notifyTimeout = 0;
function notify(message){
    const el = document.getElementById("popup")
    el.innerHTML = message;
    el.style.top = "1em";
    clearTimeout(notifyTimeout)
    notifyTimout = setTimeout(()=>{el.style.top="-3em"}, 1000)
}

const filterNumber = notifyDecorator("Numbers only", (value) => {
        const re = /\D+/g; // regex to filter to match all nonnumbers
        return value.replaceAll(re, "")
});
const filterFourDigits = notifyDecorator("Maxium four digits", (value) =>{
    return value.substring(0, 4)
});
const filterLetters = notifyDecorator("Letters only", (value) =>{
    const re = /[^a-zA-Z]+/g; // regex to filter to match all nonnumbers
    return value.replaceAll(re, "")
});

function filterAny(value){
    return value
}

// takes a id and gets the filter function for it
function getFilter(id){
    switch(id){
        case "onlyNums":
            return filterNumber
        break;
        case "onlyLets":
            return filterLetters
        break;
        case "onlyFour":
            return filterFourDigits
        break;
        default:
            return false;
    }
}

// takes an event from an input and filters it value
function changeValue(event){
    const classes = event.path[0].className.split(" ");
    for(let cls of classes){
        filterFunc = getFilter(cls)
        if(filterFunc){
            event.target.value = filterFunc(event.target.value)
        }
    }
}

const validateEls = document.getElementsByClassName("validate")
for(const el of validateEls){
    el.oninput = changeValue
}
