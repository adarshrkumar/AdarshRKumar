// Instagram data fetching utilities
/* global btoa */

import type { InflactMediaItem, InflactEndpoints, InstagramData, InstagramMediaNode, InstagramProfile, InstagramStory } from './types';

// API configuration (tokens may expire and need refreshing)
const INSTAGRAM_USERNAME = 'adarsh.r.kumar';
const FORM_BOUNDARY = '----WebKitFormBoundaryhvlGBNAlLf6A7hTO';
const CLIENT_SIGNATURE = 'e7a80dcbf2c4c0c89fcc7bf4672f6bcfad307873aa6dbd95b4f219b4e1316476';
const CLIENT_TOKEN = btoa(JSON.stringify({
    "timestamp": Math.floor(Date.now() / 1000),
    "clientId": "01915f1ba872bbe1e9a6d2711482a96e",
    "nonce": "cab9791b3287051b3787552f2750cea0"
}))

// Helper functions

// Fetch a single Instagram endpoint from inflact API
async function fetchInstagramEndpoint(endpoint: string): Promise<object> {
    const response = await fetch(`https://inflact.com/downloader/api/viewer/${endpoint}/?lang=en`, {
        method: 'POST',
        headers: {
            'content-type': `multipart/form-data; boundary=${FORM_BOUNDARY}`,
            'priority': 'u=1, i',
            'x-client-signature': CLIENT_SIGNATURE,
            'x-client-token': CLIENT_TOKEN,
        },
        body: `------WebKitFormBoundaryhvlGBNAlLf6A7hTO\r\nContent-Disposition: form-data; name="url"\r\n\r\n${INSTAGRAM_USERNAME}\r\n------WebKitFormBoundaryhvlGBNAlLf6A7hTO--\r\n`,
    });

    if (!response.ok) {
        throw new Error(`Instagram API returned ${response.status}`);
    }

    const json = await response.json();
    if (json?.status !== 'success') {
        throw new Error(`Instagram API returned status: ${json?.status}`);
    }

    return json?.data;
}

// Recursively search for media edges in API response
function findEdges(obj: object, depth = 0): InstagramMediaNode[] {
    if (!obj || typeof obj !== 'object' || depth > 6) return [];

    // Check for edge_owner_to_timeline_media or edge_felix_video_timeline patterns
    const entries = Object.entries(obj);
    for (let i = 0; i < entries.length; i++) {
        if ((entries[i][0].startsWith('edge_') && entries[i][0].includes('media')) || entries[i][0].startsWith('edge_felix')) {
            if (typeof entries[i][1] === 'object' && entries[i][1] !== null && 'edges' in entries[i][1] && Array.isArray(entries[i][1].edges) && entries[i][1].edges.length > 0) {
                const nodes: InstagramMediaNode[] = [];
                for (let j = 0; j < entries[i][1].edges.length; j++) {
                    const edge = entries[i][1].edges[j];
                    if (edge && typeof edge === 'object' && 'node' in edge) {
                        nodes.push(edge.node);
                    }
                }
                return nodes;
            }
        }
    }

    // Recurse into nested objects
    for (const val of Object.values(obj)) {
        if (val && typeof val === 'object' && !Array.isArray(val)) {
            const result = findEdges(val, depth + 1);
            if (result.length > 0) return result;
        }
    }

    return [];
}

// Normalize a flat reel/post item (inflact format) into InstagramMediaNode
function normalizeMediaNode(item: InflactMediaItem): InstagramMediaNode {
    return {
        display_url: item.display_url || item.imageUrl || item.thumbnail_src || '',
        shortcode: item.shortcode || item.shortCode || '',
        is_video: item.is_video ?? (item.mediaType === 2),
        taken_at_timestamp: item.taken_at_timestamp || item.createdAt,
        thumbnail_src: item.thumbnail_src || item.imageUrl,
        video_url: item.video_url,
        edge_media_to_caption: item.edge_media_to_caption || (item.caption
            ? { edges: [{ node: { text: item.caption } }] }
            : undefined),
        edge_liked_by: item.edge_liked_by,
        edge_media_to_comment: item.edge_media_to_comment,
    };
}

// Extract media nodes from API response data
function extractMediaNodes(data: object): InstagramMediaNode[] {
    if (!data || typeof data !== 'object') return [];

    // Try to find edges recursively in the response (graph API format)
    const edges = findEdges(data);
    if (edges.length > 0) return edges;

    // Handle inflact flat array format (e.g. data.reels, data.posts)
    const entries = Object.entries(data);
    for (let i = 0; i < entries.length; i++) {
        const val = entries[i][1];
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
            const results: InstagramMediaNode[] = [];
            for (let j = 0; j < val.length; j++) {
                results.push(normalizeMediaNode(val[j]));
            }
            return results;
        }
    }

    // Fallback: if data is an array of nodes directly
    if (Array.isArray(data)) {
        return data.map(normalizeMediaNode);
    }

    return [];
}

// Main function: fetch all Instagram data resiliently
export async function getInstagramData(): Promise<InstagramData> {
    try {
        const endpoints: (InflactEndpoints)[] = ['profile', 'posts', 'reels', 'stories'];
        const results = await Promise.allSettled(
            endpoints.map(endpoint => fetchInstagramEndpoint(endpoint))
        );

        const data: Record<string, object> = {};
        for (let i = 0; i < endpoints.length; i++) {
            const result = results[i];
            if (result.status === 'fulfilled' && result.value) {
                data[endpoints[i]] = result.value;
            }
        }

        // Extract profile
        let profile: InstagramProfile | null = null;

        // Extract posts
        const postsData = data && typeof data === 'object' && 'posts' in data ? data.posts : null;
        const posts = postsData ? extractMediaNodes(postsData) : [];

        // Extract reels
        const reelsData = data && typeof data === 'object' && 'reels' in data ? data.reels : null;
        const reels = reelsData ? extractMediaNodes(reelsData) : [];

        // Extract stories
        let stories: InstagramStory[] = [];
        const storiesData = data && typeof data === 'object' && 'stories' in data ? data.stories : null;
        if (storiesData && typeof storiesData === 'object') {
            const reel = 'reel' in storiesData ? storiesData.reel : null;
            const storyArray = ('stories' in storiesData ? storiesData.stories : (reel && typeof reel === 'object' && 'items' in reel ? reel.items : storiesData));
            if (Array.isArray(storyArray)) {
                stories = storyArray;
            }
        }

        return { profile, posts, reels, stories, error: null };
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
        return {
            profile: null,
            posts: [],
            reels: [],
            stories: [],
            error: error instanceof Error ? error.message : 'Failed to fetch Instagram data',
        };
    }
}

// Extract caption text from a media node
export function getInstagramCaption(node: InstagramMediaNode): string {
    const edges = node.edge_media_to_caption?.edges;
    if (edges && edges.length > 0) {
        return edges[0].node.text;
    }
    return '';
}

// Format Instagram timestamp to readable date
export function formatInstagramDate(timestamp: number | undefined): string {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
