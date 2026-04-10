async function fetchFile(url) {
    const file = fetch(url)
    file.then(response => response.json())
        .then(data => {
            let stringifyiedData = JSON.stringify(data)
            localStorage.setItem(url, stringifyiedData)
        })
        .catch(error => {
            console.log(error)
        })
}
localStorage.clear()
function getData(url) {
    let data = null
    if (!localStorage.getItem(url)) {
         fetchFile(url)
        data = localStorage.getItem(url)
        data = JSON.parse(data)
    }
    else {
        data = localStorage.getItem(url)
        data = JSON.parse(data)
    }
    return data
}