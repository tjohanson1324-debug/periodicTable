const togglePropertiesMenu = () =>
{
    if(document.querySelector("aside").classList.contains("visible"))
    {
    document.querySelector("aside").classList.remove("visible")
    document.querySelector("section").classList.remove("hidden")
    }
else
{
    document.querySelector("aside").classList.add("visible")
    document.querySelector("section").classList.add("hidden")
}
}