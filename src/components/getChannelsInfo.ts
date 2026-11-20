import type { RSSResponse } from '../lib/youtube'

interface VideoItem {
    link?: string;
    title?: string;
}

export default async function getChannelsInfo(channelIds: string[]): Promise<VideoItem[]> {
    const allVideoItems: VideoItem[] = []

    // Process each channel
    const channelPromises = channelIds.map(async channelId => {
        try {
            const channelURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
            const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(channelURL)}`
            const response = await fetch(rssUrl)
            const data: RSSResponse = await response.json()

            if (data.items && data.items.length > 0)
                return data.items.slice(0, 3).filter(Boolean)
                    .map(item => ({ link: item.link || undefined, title: item.title || undefined }))
            console.warn(`No valid data found for channel: ${channelId}`)
            return []
        } catch (error) {
            console.error(`Error fetching data for channel ${channelId}:`, error)
            return []
        }
    })

    // Wait for all channel requests to complete
    const channelResults = await Promise.all(channelPromises)

    // Flatten the results
    channelResults.forEach(videos => allVideoItems.push(...videos))

    return allVideoItems
}