let elements = null
let units = null
const convert = () => {
    if (!elements)
        elements = getData("../data/periodic_table_elements.json")
    if (!units)
        units = getData("../data/conversion_units.json")

    const elementSelector = document.querySelector("#elementSelector")
    if (elementSelector.options.length < 2 && document.querySelector("#fromUnit").options.length < 3) {
        for (let i = 0; i < elements.length; i++) {
            const option = document.createElement("option")
            option.value = elements[i].name
            option.text = elements[i].name
            elementSelector.appendChild(option)
        }
        let unitKeys = Object.keys(units)
        for (let i = 0; i < unitKeys.length; i++) {
            let currentUnits = Object.keys(units[unitKeys[i]])
            for (let j = 0; j < currentUnits.length; j++) {
                let option = document.createElement("option")
                option.value = currentUnits[j]
                option.text = currentUnits[j]
                document.querySelector("#fromUnit").appendChild(option)

                option = document.createElement("option")
                option.value = currentUnits[j]
                option.text = currentUnits[j]
                document.querySelector("#toUnit").appendChild(option)
            }
        }
    }
    let currentElement = elements.filter(element => element.name == elementSelector.value)[0]
    let fromUnit = document.querySelector("#fromUnit").value
    let toUnit = document.querySelector("#toUnit").value
    let value = document.querySelector("#value").value
    let state_at_stp = getStateAtTemperature(currentElement, 0)
    let properties = currentElement.properties

    let fromUnitType = ""
    let toUnitType = ""
    if (!isNaN(value) && value >= 0) {

        if (Object.keys(units['volume']).includes(toUnit))
            toUnitType = "volume"
        else if (Object.keys(units['mass']).includes(toUnit))
            toUnitType = "mass"
        else
            toUnitType = toUnit

        if (Object.keys(units['volume']).includes(fromUnit))
            fromUnitType = "volume"
        else if (Object.keys(units['mass']).includes(fromUnit))
            fromUnitType = "mass"
        else
            fromUnitType = fromUnit


        if (fromUnitType != "moles" && fromUnitType != "atoms")
            value /= units[fromUnitType][document.querySelector("#fromUnit").value]
        let result = molarConversions[fromUnitType][toUnitType](value,
            properties.atomic_properties.atomic_mass, state_at_stp, properties.physical_properties.density)
        result = Math.round(result * 1000) / 1000

        if (toUnitType != "moles" && toUnitType != "atoms")
            result *= units[toUnitType][document.querySelector("#toUnit").value]
        result = Math.round(result * 1000) / 1000

        document.querySelector("#output").value = result
        document.querySelector(".errorMessage").style.display = "none"
    }
    else
        document.querySelector(".errorMessage").style.display = "block"
}
const getStateAtTemperature = (element, temperature) => {
    let state = ""
    let meltingPoint = element.properties.physical_properties.melting_point
    let boilingPoint = element.properties.physical_properties.boiling_point

    if (temperature >= boilingPoint)
        state = "gas"
    else if (temperature < boilingPoint && temperature >= meltingPoint)
        state = "liquid"
    else if (temperature < meltingPoint)
        state = "solid"

    return state
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#value").addEventListener('input', convert)
})
const molarConversions =
{
    mass: {
        mass: (value, molar_mass) => value,
        moles: (value, molar_mass) => value / molar_mass,
        volume: (value, molar_mass, state_at_stp, density) => {
            let liters;
            if (state_at_stp == "gas") {
                let moles = value / molar_mass
                liters = moles * 22.4
            }
            else {
                liters = (value / density)
                liters /= 1000
            }
            return liters
        },
        atoms: (value, molar_mass) => (value / molar_mass) * 6.022e23
    },
    moles: {
        mass: (value, molar_mass) => value * molar_mass,
        moles: (value, molar_mass) => value,
        volume: (value, molar_mass, state_at_stp, density) => {
            let liters
            if (state_at_stp == "gas")
                liters = value * 22.4
            else {
                liters = (value * molar_mass) / density
                liters /= 1000
            }
            return liters
        },
        atoms: (value, molar_mass) => value * 6.022e23
    },
    volume:
    {
        mass: (value, molar_mass, state_at_stp, density) => {
            let mass;
            if (state_at_stp == "solid")
                mass = value * density * 1000
            else
                mass = (value / 22.4) * molar_mass
            return mass
        },
        moles: (value, molar_mass, state_at_stp, density) => {
            let moles;
            if (state_at_stp == "gas")
                moles = value / 22.4
            else {
                value *= 1000
                moles = (value * density) / molar_mass
            }
            return moles
        },
        volume: (value, molar_mass) => value,
        atoms: (value, molar_mass, state_at_stp, density) => {
            let atoms;
            if (state_at_stp == "gas")
                atoms = (value / 22.4) * 6.022e23
            else
                atoms = ((value * 1000 * density) / molar_mass) * 6.022e23
            return atoms
        }
    },
    atoms: {
        mass: (value, molar_mass) => (value / 6.022e23) * molar_mass,
        moles: (value, molar_mass) => value / 6.022e23,
        volume: (value, molar_mass, state_at_stp, density) => {
            let liters;
            if (state_at_stp == "gas") {
                let moles = value / 6.022e23
                liters = moles * 22.4
            }
            else {
                let moles = value / 6.022e23
                let grams = moles * molar_mass
                liters = grams / density
                liters /= 1000
            }
            return liters
        },
        atoms: (value, molar_mass) => value
    }
}