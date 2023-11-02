let pageTitle = document.querySelector('.current-URL-not-found')
let aHTML = `<a href="${location.href}">${location.pathname}</a>`
if (location.pathname.startsWith('/404')) {
    aHTML = `<a href="${location.href}">the requested page</a>`
}
pageTitle.innerHTML = `${aHTML} Could not be found`

