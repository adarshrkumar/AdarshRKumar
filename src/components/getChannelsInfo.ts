interface VideoItem {
    link?: string
    title?: string
}

function getChannelsInfo(cids: string[]): VideoItem[] {
    let vidsAmt = cids.length
    let csAmt = cids.length
    let vidsPerChannel = Math.ceil(vidsAmt/csAmt)
    
        const items: VideoItem[] = []

    cids.forEach((cid, cI) => {
        const channelURL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`)
        const reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`
        
        fetch(reqURL)
            .then(response => response.json())
            .then(result => {
                let isBad = true
                if (!!result.items) {
                    const channelVids = result.items.length
                    if (channelVids > 0) {
                        isBad = false
                    }
                }
                if (isBad) {
                    csAmt--
                    cids.splice(cI, 1)
                    vidsPerChannel = Math.ceil(vidsAmt/csAmt)
                }
            })
    })
    
    cids.forEach(cid => {
        const channelURL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`)
        const reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`
        
        fetch(reqURL)
            .then(response => response.json())
            .then(result => {
                for (let i = 0; i < vidsPerChannel; i++) {
                    if (!!result.items) {
                        let channelVids = result.items.length
                        if (channelVids > 3) channelVids = 3
                        if (!!result.items[i]) {
                            const item: VideoItem = {}
                            if (!!result.items[i].link) {
                                item.link = result.items[i].link
                            }
                            else {
                                // console.error(`Error with: result.items[${i}].link`)
                                // console.error(result.items[i])
                            }
                            if (!!result.items[i].title) {
                                item.title = result.items[i].title
                            }
                            else {
                                // console.error(`Error with: result.items[${i}].title`)
                                // console.error(result.items[i])
                            }
                            items.push(item)
                        }
                        else {
                            // console.error(`Error with: result.items[${i}]`)
                            // console.error(result.items)
                        }
                    }
                    else {
                        // console.error(`Error with: result.items`)
                        // console.error(result)
                    }
                }
            })
            .catch(error => console.log('error', error));
    })

    return items
}

export { getChannelsInfo }