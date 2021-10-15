import Button from '@mui/material/Button';

const basePrice = 6
const ingredientPrices = {
    "cheese": 1,
    "beef": 2,
    "ham": 2,
    "pep": 2,
    "mushroom": 1,
    "tomato": 1,
    "spinich": 1,
    "bacon": 3,
    "onion": 1,
    "pineapple": 9999,
    "prawn": 3,
}

export function Price(props){
    const prices = props.ings.map(i=>ingredientPrices[i])
    const total = prices.reduce((a, b)=>a+b, 0) + basePrice;
    return (
        <div id="price-outer">
            Total: ${total}
            <Button id="order-button" variant="contained">Order</Button>
        </div>
    )
}

export default Price;
export { basePrice, ingredientPrices };