async function fetchFile(url) {
    try
    {
    const file = await fetch(url)
    const json = await file.json()
    localStorage.setItem(url,JSON.stringify(json))
    }
    catch (error)
    {
        console.error(error)
    }
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