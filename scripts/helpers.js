export function createElWithClass(tag, ...selectors) {
    let element = document.createElement(tag)
    for (let selector of selectors) {
        element.classList.add(selector)
    }
    return element
}
export function createElWithText(tag, text) {
    let element = document.createElement(tag)
    element.textContent = text
    return element
}
export function pickRandomFromArray(array) {
    let randomValue = array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    return randomValue[0]
}
