
const getElement = (selector) => document.querySelector(selector)
const getAllElements = (selector) => document.querySelectorAll(selector)
const orginalPositions = new Map()
function moveElements(selector, targetId) {
    let elements
    if (selector.includes('.'))
        elements = document.querySelectorAll(selector)
    else
        elements = [document.querySelector(selector)]
    const targetContainer = document.querySelector(targetId)
    if (!targetContainer) {
        console.error(`Element with id \"${targetId}"\ does not exist.`)
        return
    }
    elements.forEach(element => {
        if (!orginalPositions.has(element)) {
            orginalPositions.set(element,
                {
                    parent: element.parentElement,
                    nextSibling: element.nextElementSibling
                })
        }
        if (elements.length < 2)
            targetContainer.querySelector('.inner-transition').after(element)
        else
            targetContainer.appendChild(element)
    })
}

function returnElements(selector) {
    let elements;
    if (selector.includes('.'))
        elements = document.querySelectorAll(selector)
    else
        elements = [document.querySelector(selector)]
    elements.forEach(element => {
        if (orginalPositions.has(element)) {
            const { parent, nextSibling } = orginalPositions.get(element)
            if (nextSibling && elements.length > 1)
                parent.insertBefore(element, nextSibling)
            else
                parent.appendChild(element)
        }
    })
}
const infoMenu = document.querySelector("aside")
const mediaQuery = window.matchMedia('(max-width:676px)')
const mediaQuery32Column = window.matchMedia('(max-width:1095px')
const handleScreenSizeChange = () => {
    if (mediaQuery.matches || mediaQuery32Column.matches) {
        infoMenu.style.transform = "none"
        if (mediaQuery32Column.matches && mediaQuery.matches) {
            moveElements(".transition-row", "#transitionContainer")
            if (document.querySelector("#periodicTable").dataset.columns == "32")
                switchTo32Columns()
        }
        else {
            if (document.querySelector("#periodicTable").dataset.columns == "32")
                switchTo32Columns()
            returnElements(".transition-row")
        }
    }
    else {
        if (!mediaQuery.matches)
            returnElements(".transition-row")
    }
}
document.addEventListener('DOMContentLoaded', () => {
    mediaQuery.addEventListener('change', handleScreenSizeChange)
    mediaQuery32Column.addEventListener('change', handleScreenSizeChange)
    handleScreenSizeChange();
})

function switchTo32Columns() {
    if (document.querySelector("#periodicTable").dataset.columns == "18") {
        moveElements("#inner-transitionRow1", "#row6")
        moveElements("#inner-transitionRow2", "#row7")
        document.querySelector("#periodicTable").dataset.columns = "32"
    }
    else {
        returnElements("#inner-transitionRow1")
        returnElements("#inner-transitionRow2")
        document.querySelector("#periodicTable").dataset.columns = "18"
    }
}

let isdragging = false
let startX, startY
let xOffset = 0
let yOffset = 0
infoMenu.addEventListener('mousedown', (e) => {
    if (!mediaQuery.matches) {
        startX = e.clientX - xOffset
        startY = e.clientY - yOffset
        isdragging = true
    }
    else
        infoMenu.style.transform = "none"
    console.log(!mediaQuery.matches)
})
document.addEventListener('mousemove', (e) => {
    if (!isdragging)
        return
    e.preventDefault()
    xOffset = e.clientX - startX
    yOffset = e.clientY - startY
    infoMenu.style.transform = `translate(${xOffset}px,${yOffset}px)`
})
document.addEventListener('mouseup', () => {
    isdragging = false;
})