

    let atom = null
    let AtomDisplay = null
    function displayAtom(atomic_number) {
        if (atom == null) {
            atom = {
                containerId: "#atomDisplay",
                numElectrons:atomic_number,
                electronColor:'red',
                orbitalColor: 'gray',
                idNumber: 1
            }
             AtomDisplay = new Atom(atom)
        }
        AtomDisplay.setNumElectrons(atomic_number)

    }
