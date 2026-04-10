/**
 * 
 * @param {string} selector 
 * @returns {HTMLElement}
 */
document.querySelector("#mobileMenuButton").addEventListener('click', () => {
    let children = Array.from(document.querySelector('ul').children)
    children.forEach(child => {
        if (child.id != "mobileMenuButton" && !child.classList.contains('hidden')) {
            child.classList.add('hidden')
            document.querySelector('main').classList.remove('hidden')
        }
        else {
            child.classList.remove('hidden')
            document.querySelector('main').classList.add('hidden')
        }
    });
})