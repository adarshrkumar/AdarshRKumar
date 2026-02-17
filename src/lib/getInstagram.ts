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
 * Extract media nodes from API response data
 */
function extractMediaNodes(data: Record<string, unknown>, endpoint: string): InstagramMediaNode[] {
    const endpointData = data?.[endpoint] as Record<string, unknown> | undefined;
    const user = (endpointData?.data as Record<string, unknown>)?.user as Record<string, unknown> | undefined;
    const timeline = user?.edge_owner_to_timeline_media as { edges: Array<{ node: InstagramMediaNode }> } | undefined;

    if (timeline?.edges) {
        return timeline.edges.map(e => e.node);
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
        let posts: InstagramMediaNode[] = [];
        const postsData = data.posts as Record<string, unknown> | undefined;
        if (postsData) {
            posts = extractMediaNodes(postsData as Record<string, unknown>, 'posts');
            // Fallback: try top-level array
            if (posts.length === 0 && Array.isArray(postsData.posts)) {
                posts = postsData.posts as InstagramMediaNode[];
            }
        }

        // Extract reels
        let reels: InstagramMediaNode[] = [];
        const reelsData = data.reels as Record<string, unknown> | undefined;
        if (reelsData) {
            reels = extractMediaNodes(reelsData as Record<string, unknown>, 'reels');
            if (reels.length === 0 && Array.isArray(reelsData.reels)) {
                reels = reelsData.reels as InstagramMediaNode[];
            }
        }

        // Extract stories
        let stories: InstagramStory[] = [];
        const storiesData = data.stories as Record<string, unknown> | undefined;
        if (storiesData?.stories && Array.isArray(storiesData.stories)) {
            stories = storiesData.stories as InstagramStory[];
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
