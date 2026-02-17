/**
 * Instagram data fetching utilities
 * Uses inflact.com API to fetch profile, posts, reels, and stories
 */

import type { InstagramData, InstagramMediaNode, InstagramProfile, InstagramStory } from './types';

// API configuration (tokens may expire and need refreshing)
const INSTAGRAM_USERNAME = 'adarsh.r.kumar';
const FORM_BOUNDARY = '----WebKitFormBoundaryhvlGBNAlLf6A7hTO';
const CLIENT_SIGNATURE = 'e7a80dcbf2c4c0c89fcc7bf4672f6bcfad307873aa6dbd95b4f219b4e1316476';
const CLIENT_TOKEN = btoa(JSON.stringify({
    "timestamp": 1771297108,
    "clientId": "01915f1ba872bbe1e9a6d2711482a96e",
    "nonce": "cab9791b3287051b3787552f2750cea0"
}))

// Helper functions

/**
 * Fetch a single Instagram endpoint from inflact API
 */
async function fetchInstagramEndpoint(endpoint: string): Promise<unknown> {
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

/**
 * Recursively search for media edges in API response
 */
function findEdges(obj: unknown, depth = 0): InstagramMediaNode[] {
    if (!obj || typeof obj !== 'object' || depth > 6) return [];

    const record = obj as Record<string, unknown>;

    // Check for edge_owner_to_timeline_media or edge_felix_video_timeline patterns
    for (const key of Object.keys(record)) {
        if (key.startsWith('edge_') && key.includes('media') || key.startsWith('edge_felix')) {
            const edge = record[key] as { edges?: Array<{ node: InstagramMediaNode }> } | undefined;
            if (edge?.edges?.length) {
                return edge.edges.map(e => e.node);
            }
        }
    }

    // Recurse into nested objects
    for (const val of Object.values(record)) {
        if (val && typeof val === 'object' && !Array.isArray(val)) {
            const result = findEdges(val, depth + 1);
            if (result.length > 0) return result;
        }
    }

    return [];
}

/**
 * Normalize a flat reel/post item (inflact format) into InstagramMediaNode
 */
interface InflactMediaItem {
    id?: string;
    shortCode?: string;
    shortcode?: string;
    imageUrl?: string;
    display_url?: string;
    mediaType?: number;
    is_video?: boolean;
    caption?: string;
    createdAt?: number;
    taken_at_timestamp?: number;
    thumbnail_src?: string;
    video_url?: string;
    edge_media_to_caption?: { edges: Array<{ node: { text: string } }> };
    edge_liked_by?: { count: number };
    edge_media_to_comment?: { count: number };
}

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

/**
 * Extract media nodes from API response data
 */
function extractMediaNodes(data: unknown): InstagramMediaNode[] {
    if (!data || typeof data !== 'object') return [];

    // Try to find edges recursively in the response (graph API format)
    const edges = findEdges(data);
    if (edges.length > 0) return edges;

    // Handle inflact flat array format (e.g. data.reels, data.posts)
    const record = data as Record<string, unknown>;
    for (const key of Object.keys(record)) {
        const val = record[key];
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
            return val.map((item: InflactMediaItem) => normalizeMediaNode(item));
        }
    }

    // Fallback: if data is an array of nodes directly
    if (Array.isArray(data)) {
        return (data as InflactMediaItem[]).map(normalizeMediaNode);
    }

    return [];
}

/**
 * Main function: fetch all Instagram data resiliently
 */
export async function getInstagramData(): Promise<InstagramData> {
    try {
        const endpoints = ['profile', 'posts', 'reels', 'stories'] as const;
        const results = await Promise.allSettled(
            endpoints.map(endpoint => fetchInstagramEndpoint(endpoint))
        );

        const data: Record<string, unknown> = {};
        for (let i = 0; i < endpoints.length; i++) {
            const result = results[i];
            if (result.status === 'fulfilled' && result.value) {
                data[endpoints[i]] = result.value;
            }
        }

        // Extract profile
        let profile: InstagramProfile | null = null;
        const profileData = data.profile as Record<string, unknown> | undefined;
        if (profileData?.profile) {
            const rawProfile = (profileData.profile as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
            const user = rawProfile?.user as InstagramProfile | undefined;
            profile = user || null;
        }

        // Extract posts
        const posts = extractMediaNodes(data.posts);

        // Extract reels
        const reels = extractMediaNodes(data.reels);

        // Extract stories
        let stories: InstagramStory[] = [];
        const storiesData = data.stories as Record<string, unknown> | undefined;
        if (storiesData) {
            // Stories may be nested under various keys
            const reel = storiesData.reel as Record<string, unknown> | undefined;
            const storyArray = (storiesData.stories ?? reel?.items ?? storiesData) as unknown;
            if (Array.isArray(storyArray)) {
                stories = storyArray as InstagramStory[];
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

/**
 * Extract caption text from a media node
 */
export function getInstagramCaption(node: InstagramMediaNode): string {
    const edges = node.edge_media_to_caption?.edges;
    if (edges && edges.length > 0) {
        return edges[0].node.text;
    }
    return '';
}

/**
 * Format Instagram timestamp to readable date
 */
export function formatInstagramDate(timestamp: number | undefined): string {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
