document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("#elementSelector").addEventListener('click', getElementParticleCount)
})
let elements
function getElementParticleCount() {
    if (!elements)
        elements = getData("../data/periodic_table_elements.json")
    const elementSelector = document.querySelector("#elementSelector")
    if (elementSelector.options.length < 2) {
        for (let i = 0; i < elements.length; i++) {
            const option = document.createElement("option")
            option.value = elements[i].name
            option.text = elements[i].name
            elementSelector.appendChild(option)
        }
    }
    const currentElement = elements.filter(element => element.name == elementSelector.value)[0]
    let protons = elementSelector.options.selectedIndex
    let electrons = protons
    let neutrons = Math.round(currentElement.properties.atomic_properties.atomic_mass) - protons 
    document.querySelector("#protons").value = protons
    document.querySelector("#electrons").value = electrons
    document.querySelector("#neutrons").value = neutrons
}