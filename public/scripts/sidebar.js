
const cids = [
    'UCzhr23vdbi63nZGYqBM7Ofw', 
    'UCb35v6VAVFI8Q0aIpwPoW1g', 
    'UCLK0Lj3V864AbKfutfyztYA', 
    'UC8cV2cdrp1ccBWzoi1R-UwQ', 
]
var items = []
var vidsAmt = []

let vidsNum = cids.length
let csAmt = cids.length
let vidsPerChannel = Math.ceil(vidsNum/csAmt)

cids.forEach(function(cid, cI) {
    let channelURL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`)
    let reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`
    
    fetch(reqURL)
        .then(response => response.json())
        .then(result => {
            if (!!result.items) {
                let channelVids = result.items.length
                if (channelVids < 1) {
                    csAmt--
                    cids.splice(cI, 1)
                    vidsPerChannel = Math.ciel(vidsNum/csAmt)
                }
            }
        })
})

cids.forEach(function(cid, cI) {
    let channelURL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`)
    let reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`
    
    fetch(reqURL)
        .then(response => response.json())
        .then(result => {
            for (let i = 0; i < vidsPerChannel; i++) {
                if (!!result.items) {
                    let channelVids = result.items.length
                    if (channelVids > 3) channelVids = 3
                    if (!!result.items[i]) {
                        var item = {}
                        if (!!result.items[i].link) {
                            item.link = result.items[i].link
                        }
                        else {
                            console.error(`Error with: result.items[${i}].link`)
                            console.error(result.items[i])
                        }
                        if (!!result.items[i].title) {
                            item.title = result.items[i].title
                        }
                        else {
                            console.error(`Error with: result.items[${i}].title`)
                            console.error(result.items[i])
                        }
                        items.push(item)
                    }
                    else {
                        console.error(`Error with: result.items[${i}]`)
                        console.error(result.items)
                    }
                }
                else {
                    console.error(`Error with: result.items`)
                    console.error(result)
                }
            }
        })
        .catch(error => console.log('error', error));
})

console.log(items)