document.addEventListener('DOMContentLoaded', () => {
    getElement("#periodicTable").addEventListener('click', getElementData)
    getElement("#periodicTable").addEventListener('focus', getElementData)
    getElement("#unitSelector").addEventListener('click', chnageElementUnits)
    getElement("#temperatureSelector").addEventListener("change", setTemperature)
    getElement("#menuMobileCloseButton").addEventListener('click', togglePropertiesMenu)
    getElement("#toggleLayout").addEventListener('click', switchTo32Columns)
})

const elementProperties =
{
    elements: [],
    PeriodicTableElement: class {
        name = ""
        symbol = ""
        atomic_number = 0
        properties =
            {
                atomic_properties:
                {
                    short_electron_config: "",
                    electron_config: []
                }
            }
        temperature_unit = "celsius"
        description =
            {
                summary: "",
                uses: [],
                physical_characteristics: ""
            }
        /**
         * @typedef summary
         * @property {string[]} summary
         * @property {string[]} uses
         * @property {string[]} appearance
         */
        /**
         * 
         * @param {string} name 
         * @param {string} symbol 
         * @param {number} atomic_number 
         * @param {number} atomic_mass 
         * @param {number} melting_point 
         * @param {number} boiling_point 
         * @param {number} electronegativity 
         * @param {string[]} electron_config 
         * @param {description } description  
         * @example 
         * let name = "Hydrogen"
         * let symbol = "H"
         * let atomic_number = 1
         * let atomic_mass = 1.008
         * let melting_point = -259.16
         * let boiling_point = -252.88
         * let electronegativity = 2.20
         * let electron_config = ["1s1"]
         * let description  ={
                "summary": [
                    "The lightest and most common element that makes up 90% to 92% of the universe.",
                    "It is a highly flammable, highly explosive gas."
                ],
                "uses": ["petroleum refining", "ammonia production for fertilizer", "chemical manufacturing"],
                "appearance": ["An invisible, odorless, and colorless gas."]
            }
         * let element = new elementProperties['PeriodicTableElement'](name, symbol, atomic_number, 
         * atomic_mass, melting_point, boiling_point, electronegativity, electron_config, summary)
         * console.log(element)
         */
        constructor(name, symbol, atomic_number, properties, description) {
            let propertiesList = Object.keys(properties)
            for (let i = 0; i < propertiesList.length; i++) {
                let catagory = properties[propertiesList[i]]
                let catagoryName = propertiesList[i]
                if (typeof catagory === "object") {
                    if (catagoryName != "atomic_properties")
                        this.properties[catagoryName] = {}
                    let catagorypropertiesList = Object.keys(catagory)
                    for (let j = 0; j < catagorypropertiesList.length; j++) {
                        if (catagorypropertiesList[j] != "electron_config")
                            this.properties[catagoryName][catagorypropertiesList[j]] = catagory[catagorypropertiesList[j]]
                    }
                }
                else
                    this.properties[catagoryName] = catagory
            }
            this.name = name
            this.atomic_number = atomic_number
            this.symbol = symbol

            if (isNaN(properties.physical_properties.sublimation_point)) {
                this.properties.physical_properties.melting_point = properties.physical_properties.melting_point
                this.properties.physical_properties.sublimation_point = "N/A"
                this.properties.physical_properties.boiling_point = properties.physical_properties.boiling_point
            }
            else {
                this.properties.physical_properties.sublimation_point = properties.physical_properties.sublimation_point
                this.properties.physical_properties.melting_point = "N/A"
                this.properties.physical_properties.boiling_point = "N/A"
            }

            this.properties.physical_properties.state_at_stp = this.getStateAt(0, "celsius")
            this.properties.physical_properties.state_at_room_temperature = this.getStateAt(21,"celsius")
            this.properties.atomic_properties.short_electron_config = properties.atomic_properties.electron_config

            for (let i = 0; i < properties.atomic_properties.electron_config.length; i++) {
                if (properties.atomic_properties.electron_config[i].includes("[") && properties.atomic_properties.electron_config[i].includes("]")) {
                    let relativeelectron_config = elementProperties.getElementelectron_configWithSymbol(properties.atomic_properties.electron_config[i].replace(/\[|]/g, ''))
                    for (let j = 0; j < relativeelectron_config.length; j++) {
                        this.properties.atomic_properties.electron_config.push(relativeelectron_config[j])
                    }
                }
                else
                    this.properties.atomic_properties.electron_config.push(properties.atomic_properties.electron_config[i])
            }
            let descriptionKeys = Object.keys(description)
            for (let i = 0; i < descriptionKeys.length; i++) {
                if (descriptionKeys[i] != "uses") {
                    for (let j = 0; j < description[descriptionKeys[i]].length; j++) {
                        this.description[descriptionKeys[i]] += description[descriptionKeys[i]][j] + " "
                    }
                    this.description[descriptionKeys[i]] = this.description[descriptionKeys[i]].trimEnd()
                }
                else
                    this.description[descriptionKeys[i]] = description[descriptionKeys[i]]
            }
        }
        convertToTemperatureUnit(toUnit) {
            if (isNaN(this.sublimation_point)) {
                this.properties.physical_properties.boiling_point = conversions[this.temperature_unit][toUnit](this.properties.physical_properties.boiling_point)
                this.properties.physical_properties.melting_point = conversions[this.temperature_unit][toUnit](this.properties.physical_properties.melting_point)
            }
            else
                this.properties.physical_properties.sublimation_point = conversions[this.temperature_unit][toUnit](this.properties.physical_properties.sublimation_point)
            this.temperature_unit = toUnit
        }
        getStateAt(temperature, fromUnit) {
            const temperatureUnitAbbreviations = { "celsius": "°C", "fahrenheit": "°F", "kelvin": "K" }
            temperature = conversions[fromUnit][this.temperature_unit](temperature)
            let state = ""
            let boiling_point = this.properties.physical_properties.boiling_point
            let melting_point = this.properties.physical_properties.melting_point
            let sublimation_point = this.properties.physical_properties.sublimation_point

            if (temperature >= boiling_point || temperature >= sublimation_point)
                state = "gas"

            else if (temperature < boiling_point && temperature >= melting_point && isNaN(sublimation_point))
                state = "liquid"

            else if (temperature < melting_point || temperature < sublimation_point)
                state = "solid"
            this.properties.physical_properties.stateAT = `${temperature} ${temperatureUnitAbbreviations[this.temperature_unit]}: ${state}`
            return state
        }
    },
    getElementelectron_configWithSymbol: function (symbol) {
        const element = this.elements.find(element => element.symbol === symbol)
        return element.properties.atomic_properties.electron_config
    },


    createElements: function () {
        if (this.elements.length < 1) {
            const data = getData("../resources/data/periodic_table_elements.json")
            for (let i = 0; i < data.length; i++) {
                let elementInfo = data[i]

                let periodicTableElement = new this.PeriodicTableElement(elementInfo.name, elementInfo.symbol, (i + 1),
                    elementInfo.properties, elementInfo.description)
                this.elements.push(periodicTableElement)
            }
        }
    },
    format: function (text, includeSeprators) {
        let formatedText = ""
        for (let i = 0; i < text.length; i++) {
            if (typeof text[i] === "number")
                formatedText += (text[i] > 0 ? '+' : "")
            if (includeSeprators) {
                if (typeof text[i].includes === "function" && text[i].includes(', '))
                    formatedText += text[i] + "; "
                else
                    formatedText += text[i] + ', '
            }
            else
                formatedText += text[i] + " "
        }
        formatedText = formatedText.trimEnd()
        if (formatedText.endsWith(',') || formatedText.endsWith(';'))
            formatedText = formatedText.slice(0, -1)
        return formatedText
    }
}
const conversions =
{
    celsius: {
        celsius: (temperature) => temperature,
        fahrenheit: (temperature) => Number((temperature * 1.8 + 32).toFixed(3)),
        kelvin: (temperature) => {
            let result = 0
            if (typeof (temperature + 273.15).toFixed === "function")
                result = Number((temperature + 273.15).toFixed(2))
            else
                result = Number((temperature + 273.15))
            return result
        }
    },
    fahrenheit:
    {
        celsius: (temperature) => Number(((temperature - 32) / 1.8).toFixed(3)),
        fahrenheit: (temperature) => temperature,
        kelvin: (temperature) => Number(((temperature - 32) / 1.8 + 273.15).toFixed(3))
    },
    kelvin: {
        celsius: (temperature) => Number((temperature - 273.15).toFixed(2)),
        fahrenheit: (temperature) => Number(((temperature - 273.15) * 1.8 + 32).toFixed(3)),
        kelvin: (temperature) => temperature
    }
}

function getElementData(event) {
    const temperatureUnitAbbreviations = { "celsius": "°C", "fahrenheit": "°F", "kelvin": "K" }
    const densityUnitStates = { "gas": "g/l", "liquid": "g/cm³", "solid": "g/cm³" }
    if (event.target.parentElement.classList.contains('element')) {
        if (elementProperties.elements.length < 1)
            elementProperties.createElements()
        else {
            let elementIndex = event.target.parentElement.id
            let elementInfo = elementProperties.elements[elementIndex]
            let targetElementProperties = elementInfo.properties
            let elementDescription = elementInfo.description
            let elementDescriptionKeys = Object.keys(elementDescription)
            let temperature_unit = elementInfo.temperature_unit
            const units = {
                "atomic_mass": "u", "boiling_point": temperatureUnitAbbreviations[temperature_unit], "melting_point":
                    temperatureUnitAbbreviations[temperature_unit], "sublimation_point": temperatureUnitAbbreviations[temperature_unit],
                "density": densityUnitStates[targetElementProperties.physical_properties.state_at_stp]
            }
            displayAtom(elementInfo.atomic_number)

            let elementInfoCatagoryKeys = Object.keys(targetElementProperties)
            for (let i = 0; i < elementInfoCatagoryKeys.length; i++) {
                if (elementInfoCatagoryKeys[i] != "unknownProperties") {
                    let catagory = targetElementProperties[elementInfoCatagoryKeys[i]]
                    let catagoryKeys = Object.keys(catagory)
                    for (let j = 0; j < catagoryKeys.length; j++) {
                        if (catagoryKeys[j] == "electron_config" || catagoryKeys[j] == "short_electron_config")
                            document.querySelector(`#${catagoryKeys[j]}`).innerText = elementProperties.format(catagory[catagoryKeys[j]], false)
                        else {
                            if (catagoryKeys[j] == "oxidation_states")
                                document.querySelector(`#${catagoryKeys[j]}`).innerText = elementProperties.format(catagory[catagoryKeys[j]], true)
                            else
                                document.querySelector(`#${catagoryKeys[j]}`).innerText = `${catagory[catagoryKeys[j]]}${Object.keys(units).includes(catagoryKeys[j]) ?
                                    units[catagoryKeys[j]] : ""} `
                        }
                    }
                }
            }
            for (let i = 0; i < elementDescriptionKeys.length; i++) {
                if (elementDescriptionKeys[i] == "uses")
                    document.querySelector(`#${elementDescriptionKeys[i]}`).innerText = elementProperties.format(elementDescription[elementDescriptionKeys[i]], true)
                else
                    document.querySelector(`#${elementDescriptionKeys[i]}`).innerText = elementDescription[elementDescriptionKeys[i]]
            }
            document.querySelector('#name').innerText = elementInfo.name
            document.querySelector("#symbol").innerText = elementInfo.symbol
            document.querySelector("#atomic_number").innerText = elementInfo.atomic_number

            if (targetElementProperties.unknown_properties) {
                document.querySelector("#unknown_properties").style.display = "block"
                document.querySelector("#unknown_properties").innerText = `*Most, if not all of ${elementInfo.name}'s real properites are unknown, and its displayed properites are estimated due to its high radioactivity and/or scarcity.
                This element may have arbitrary boiling and/or melting points choosen by me for preventing inaccurate states at certain temperatures.
                `
            }
            else
                document.querySelector("#unknown_properties").style.display = "none"
        }
    }
}

function chnageElementUnits() {
    let unit = document.querySelector("#unitSelector").value
    for (let i = 0; i < elementProperties.elements.length; i++) {
        elementProperties.elements[i].convertToTemperatureUnit(unit)
    }
    const temperatureSelector = document.querySelector("#temperatureSelector")
    temperatureSelector.min = conversions['celsius'][unit](-273.15)
    temperatureSelector.max = conversions['celsius'][unit](5930.0)
    temperatureSelector.value = conversions[unit]['celsius'](temperatureSelector.value)
}

function setTemperature() {
    const temperatureSelector = document.querySelector("#temperatureSelector")
    let temperature = temperatureSelector.value
    let unit = document.querySelector("#unitSelector").value
    for (let i = 0; i < elementProperties.elements.length; i++) {
        document.getElementById(i).dataset.state = elementProperties.elements[i].getStateAt(temperature, unit)
    }
}