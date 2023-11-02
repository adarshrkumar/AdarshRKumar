var modal = document.querySelector('dialog')
var aElement = document.querySelector('a[data-video]')
var vElement = document.getElementById('videos')
var hasRun = false

const cids = [
    'UCb35v6VAVFI8Q0aIpwPoW1g', 
    'UCLK0Lj3V864AbKfutfyztYA', 
    'UC8cV2cdrp1ccBWzoi1R-UwQ', 
]

let vidsNum = 9
let vidsPerChannel = vidsNum/cids.length

cids.forEach(cid => {
    let channelURL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`)
    let reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`
    
    fetch(reqURL)
        .then(response => response.json())
        .then(result => {
            let links = []
            let i = 0
            while (i < vidsPerChannel) {
                if (!!result.items[i].link) {
                    links.push(result.items[i].link)
                    i++
                }
            }
            links.forEach(link => {
                let id = link.substring(link.indexOf("=") + 1);
                let iframe = document.createElement('iframe')
                iframe.style.backgroundImage = `url('https://i.ytimg.com/vi/${id}/maxresdefault.jpg')`
                iframe.src = `https://youtube.com/embed/${id}`;
                vElement.appendChild(iframe)
            })
        })
        .catch(error => console.log('error', error));
})
