// Imports
import type { VideoItem, RSSResponse } from '../lib/types'

// Helper function to extract video items from response
function extractVideoItems(response: RSSResponse, maxVideos: number = 3): VideoItem[] {
    if (!response.items) return []

    const videoItems: VideoItem[] = []
    const videosToProcess = Math.min(response.items.length, maxVideos)

    for (let i = 0; i < videosToProcess; i++) {
        const item = response.items[i]
        if (item) {
            videoItems.push({
                link: item.link || undefined,
                title: item.title || undefined
            })
        }
    }

    return videoItems
}

// Main function to get channel information
async function getChannelsInfo(channelIds: string[]): Promise<VideoItem[]> {
    const allVideoItems: VideoItem[] = []

    // Process each channel
    const channelPromises = channelIds.map(async channelId => {
        try {
            const channelURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
            const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(channelURL)}`
            const response = await fetch(rssUrl)
            const data: RSSResponse = await response.json()

            if (data.items && data.items.length > 0) return extractVideoItems(data, 3)
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
    channelResults.forEach(videos => {
        allVideoItems.push(...videos)
    })

    return allVideoItems
}

export { getChannelsInfo }