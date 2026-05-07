const togglePropertiesMenu = () =>
{
    if(document.querySelector("aside").classList.contains("visible"))
    {
    document.querySelector("aside").classList.remove("visible")
    document.querySelector("#menuMobileCloseButton").textContent = "View"
    document.querySelector("section").classList.remove("hidden")
    }
else
{
    document.querySelector("aside").classList.add("visible")
        document.querySelector("#menuMobileCloseButton").textContent = "Hide"
    document.querySelector("section").classList.add("hidden")
}
}