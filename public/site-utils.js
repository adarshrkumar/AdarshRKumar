window.addEventListener('DOMContentLoaded', function(e) {
    var linkRels = document.querySelectorAll('link[rel]')
    linkRels.forEach(function(l, i) {
        let lHref = l.href
        if (lHref.startsWith('{baseDomain}')) {
            lHref = lHref.substring('{baseDomain}'.length)
            lHref = `https://adarshrkumar.dev/${lHref}`
            if (lHref.includes('//')) lHref = lHref.replace('//', '/')
            l.href = lHref
        }
    })
})