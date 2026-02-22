export function extractChannelId(feedLink: string): string {
    let channelId = feedLink
    if (channelId.includes('/')) {
        channelId = channelId.split('/').pop() || ''
    }
    return channelId
}

export function extractVideoId(videoGuid: string): string {
    return videoGuid.substring(videoGuid.lastIndexOf(':') + 1)
}

export async function generateYouTubeImageUrls(videoId: string) {
    const baseImageUrl = `https://i.ytimg.com/vi/${videoId}`
    let size = 'maxresdefault'
    let url = `${baseImageUrl}/${size}.jpg`
    const resp = await fetch(url)
    if (!resp.ok) {
        size = 'hqdefault'
        url = `${baseImageUrl}/${size}.jpg`
    }

    return {
        highRes: url
    }
}

export function generateYouTubeUrls(videoId: string, channelId: string) {
    return {
        channel: `https://youtube.com/channel/${channelId}`,
        embed: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`
    }
}
