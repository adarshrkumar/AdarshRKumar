var statsEle = document.querySelector('.channel-stats')
var props = [
    {
        name: 'id', 
        default: '', 
    }, 
    {
        name: 'layout', 
        default: 'full', 
    }, 
    {
        name: 'count', 
        default: 'default', 
    }, 
]
var channels = [
    {
        id: 'UCzhr23vdbi63nZGYqBM7Ofw', 
    }, 
    {
        id: 'UCb35v6VAVFI8Q0aIpwPoW1g', 
    }, 
    {
        id: 'UCLK0Lj3V864AbKfutfyztYA', 
    }, 
    {
        id: 'UC8cV2cdrp1ccBWzoi1R-UwQ', 
    }, 
    {
        id: 'UCpgY8iFp2Nkfu0jAwk2U94g'
    }
]

for (let i = 0; i < channels.length; i++) {
    var container = document.createElement('div')
    container.classList.add('channel-container')
    container.setAttribute('data-i', i)

    statsEle.appendChild(container)
}

channels.forEach(function(c, i) {
    props.forEach(function(p) {
        if (!!c[p.name] === false) c[p.name] = p.default
    })
    var container = statsEle.querySelectorAll('.channel-container')[i]

    var cEle = document.createElement('div')
    cEle.classList.add('g-ytsubscribe')
    cEle.setAttribute('data-channelid', c.id)
    cEle.setAttribute('data-layout', c.layout)
    cEle.setAttribute('data-count', c.count)

    container.appendChild(cEle)
    container.removeAttribute('data-i')
})