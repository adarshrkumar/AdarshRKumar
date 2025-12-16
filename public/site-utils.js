window.addEventListener('DOMContentLoaded', e => {
    var linkRels = document.querySelectorAll('link[rel]')
    linkRels.forEach(l => {
        let lHref = l.href
        if (lHref.startsWith('{baseDomain}')) {
            lHref = lHref.substring('{baseDomain}'.length)
            lHref = `https://adarshrkumar.dev/${lHref}`
            if (lHref.includes('//')) lHref = lHref.replace('//', '/')
            l.href = lHref
        }
    })
})