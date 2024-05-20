var largestWidth = 0
document.querySelectorAll('.nav-btn').forEach(function(b, i) {
    if (b.clientWidth > largestWidth) largestWidth = b.clientWidth
})
document.querySelector('.nav-btn').parentNode.style.setProperty('--min-width', `${largestWidth/16}rem`)

document.querySelectorAll('.nav-btn').forEach(function(b, i) {
    b.href = b.getAttribute('url')
    b.removeAttribute('url')

    var oTag = b.tagName.toLowerCase()
    var nTag = 'a'
    
    var html = b.outerHTML
    html = html
      .replace(`<${oTag}`, `<${nTag}`)
      .replace(`</${oTag}>`, `</${nTag}>`)
    b.outerHTML = html
    
    b = document.querySelectorAll('.nav-btn')[i]
})
