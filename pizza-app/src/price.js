import Payment from "./payment"

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
            <Payment />
            <button type="button">Order</button>
        </div>
    )
}

export default Price;
export { basePrice, ingredientPrices };