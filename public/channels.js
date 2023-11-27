var channel_ids = [
    'UCb35v6VAVFI8Q0aIpwPoW1g', 
    'UCLK0Lj3V864AbKfutfyztYA', 
    'UC8cV2cdrp1ccBWzoi1R-UwQ', 
    'UCpgY8iFp2Nkfu0jAwk2U94g'
]
channel_ids.forEach(function(cid, i) {
    var container = document.createElement('div')
    container.classList.add('channel-container')

    container.innerHTML = `<div class="g-ytsubscribe" data-channelid="${cid}" data-layout="full" data-count="default"></div>`

    document.querySelector('.channel-stats').appendChild(container)
})

console.log(document.querySelectorAll('iframe'))
document.querySelectorAll('iframe').forEach(function(frame) {
    var src = frame.src
    if (src.includes('://')) src = src.split('://')[1]
    if (src.startsWith('accounts.google.com/o/oauth2/postmessageRelay')) frame.style.display = 'none'
})