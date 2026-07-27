import type { Post, DBPost } from './types'
import { db } from '../db/initialize.ts'
import { posts as postsTable } from '../db/schema.ts'

// Helper functions

// Helper function to extract clean site URL
export function getCleanSiteUrl(siteUrl: string | URL | undefined): string {
    let cleanUrl = siteUrl ? siteUrl.toString() : ''
    
    if (cleanUrl.includes('://')) {
        cleanUrl = cleanUrl.split('://')[1]
    }
    
    if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1)
    }
    
    return cleanUrl
}

// Helper function to extract slug from file path
export function extractSlugFromFilePath(filePath: string): string {
    // Normalize path separators
    const normalizedPath = filePath.replace(/\\/g, '/')

    // Look for the posts directory in the path
    const postsMarker = '/content/blog/posts/'
    let slug = normalizedPath

    const postsIndex = slug.indexOf(postsMarker)
    if (postsIndex !== -1) {
        slug = slug.slice(postsIndex + postsMarker.length)
    } else {
        // Fallback: just get the filename
        const parts = normalizedPath.split('/')
        slug = parts[parts.length - 1] || ''
    }

    // Remove .md extension
    if (slug.endsWith('.md')) {
        slug = slug.slice(0, -'.md'.length)
    }

    // Remove /index if present (for folder-based posts)
    if (slug.endsWith('/index')) {
        slug = slug.slice(0, -'/index'.length)
    }

    // Remove any remaining slashes at start/end
    slug = slug.replace(/^\/+|\/+$/g, '')

    return slug
}

/**
 * Helper function to clean and normalize text content
 */
export function cleanTextContent(text: string): string {
    let cleanText = text
    
    // Replace line breaks with spaces
    if (cleanText.includes('\n')) {
        cleanText = cleanText.split('\n').join(' ')
    }
    
    // Replace double spaces with single spaces
    if (cleanText.includes('  ')) {
        cleanText = cleanText.split('  ').join(' ')
    }
    
    return cleanText
}

/**
 * Helper function to create preview content with trimming
 */
export function createPreviewContent(text: string, maxLength: number = 50): string {
    let preview = text
    
    if (preview.length > maxLength) {
        preview = preview.slice(0, maxLength)
    }
    
    // Characters to trim from the end
    const trimChars = [' ', ',', ':', '(', '[', '{', '|', '~', '@', '*', '+', '=', '-', '^']
    
    while (trimChars.some(char => preview.endsWith(char))) {
        preview = preview.slice(0, -1)
    }
    
    return preview
}

/**
 * Helper function to generate screenshot image data
 */
export function generateScreenshotImage(postUrl: string, title: string, imageSize: number = 512, siteUrl?: string) {
    // Handle relative URLs by prefixing with site URL
    let fullUrl = postUrl
    if (postUrl.startsWith('/')) {
        const baseUrl = siteUrl || 'https://adarshrkumar.dev'
        fullUrl = `${baseUrl.replace(/\/$/, '')}${postUrl}`
    }

    const screenshotUrl = `https://webshot.adarshrkumar.dev/api/take?url=${encodeURIComponent(fullUrl)}&viewport_width=${imageSize}&viewport_height=${imageSize}`

    return {
        src: screenshotUrl,
        alt: `Screenshot of the "${title}" post.`,
        placeholder: `${screenshotUrl}&image_quality=50`
    }
}

// Main post functions

/**
 * Helper function to convert database post to Post format
 */
function convertDBPostToPost(dbPost: DBPost): Post {
    return {
        file: `db://${dbPost.slug}`,
        frontmatter: {
            title: dbPost.title,
            author: dbPost.author,
            date: dbPost.createdAt.toISOString(),
            pubDate: dbPost.createdAt.toISOString(),
            description: dbPost.content.substring(0, 150) + '...',
        },
        rawContent: () => dbPost.content,
        compiledContent: () => dbPost.content,
    }
}

/**
 * Helper function to get created date from a post
 */
function getPostCreatedDate(post: Post): Date {
    // Use frontmatter date (which is set to createdAt for DB posts)
    const dateStr = post.frontmatter.date || post.frontmatter.pubDate
    return dateStr ? new Date(dateStr) : new Date(0)
}

/**
 * Async function to get all posts from database
 */
export async function getDBPosts(): Promise<Post[]> {
    try {
        const dbPosts = await db.select().from(postsTable)
        return dbPosts.map(convertDBPostToPost)
    } catch (error) {
        console.error('Error fetching DB posts:', error)
        return []
    }
}

/**
 * Main function to get all published blog posts from files
 */
export function getLocalPosts(): Post[] {
    const blogPostItems = import.meta.glob('../../content/blog/posts/**/*.md', { eager: true })
    const publishedPosts: Post[] = Object.values(blogPostItems)
        .filter(item => {
            const fileName = (item as Post).file.split('/').pop() || ''
            return !fileName.startsWith('_')
        }) as Post[]

    return publishedPosts
}

/**
 * Main function to get all published blog posts (both local and DB)
 * Sorted by created date (most recent first)
 */
export async function getPosts(): Promise<Post[]> {
    const localPosts = getLocalPosts()
    const dbPosts = await getDBPosts()

    // Combine both sources
    const allPosts = [...localPosts, ...dbPosts]

    // Sort by created date (most recent first)
    allPosts.sort((a, b) => {
        const dateA = getPostCreatedDate(a)
        const dateB = getPostCreatedDate(b)
        return dateB.getTime() - dateA.getTime()
    })

    return allPosts
}

/**
 * Synchronous version that only returns local posts (for compatibility)
 */
export function getPostsSync(): Post[] {
    return getLocalPosts()
}

/**
 * Helper function to add display metadata to posts
 */
function addDisplayMetadata(posts: Post[], siteUrl?: string | URL) {
    const cleanSiteUrl = getCleanSiteUrl(siteUrl)
    const siteLocation = {
        protocol: 'https:', 
        host: cleanSiteUrl, 
    }
    
    return posts.map(post => {
        const postSlug = extractSlugFromFilePath(post.file)
        const postUrl = `${siteLocation.protocol}//${siteLocation.host}/post/${postSlug}?hideHeader=true`
        const screenshotImage = generateScreenshotImage(postUrl, post.frontmatter.title || 'Untitled Post')
        
        return {
            ...post,
            slug: postSlug,
            url: postUrl,
            screenshotImage
        }
    })
}

/**
 * Function to get posts with additional processing for display
 */
export async function getPostsForDisplay(siteUrl?: string | URL) {
    const posts = await getPosts()
    return addDisplayMetadata(posts, siteUrl)
}

/**
 * Function to get featured posts by slug
 */
export async function getFeaturedPosts(featuredSlugs: string[]) {
    const allPosts = await getPosts()
    const featuredPosts: Post[] = []

    featuredSlugs.forEach(targetSlug => {
        const matchingPosts = allPosts.filter(post => {
            const postSlug = extractSlugFromFilePath(post.file)
            return postSlug === targetSlug || postSlug === targetSlug.replace('.md', '')
        })
        featuredPosts.push(...matchingPosts)
    })

    return featuredPosts
}

/**
 * Function to get featured posts with display metadata
 */
export async function getFeaturedPostsForDisplay(featuredSlugs: string[], siteUrl?: string | URL) {
    const featured = await getFeaturedPosts(featuredSlugs)
    return addDisplayMetadata(featured, siteUrl)
}

/**
 * Function to find a specific post by ID/slug
 */
export async function findPostById(postId: string | undefined): Promise<Post | undefined> {
    const allPosts = await getPosts()
    return allPosts.find(post =>
        !post.file.startsWith('_') &&
        post.file.includes(postId || '')
    )
}

/**
 * Function to get posts for RSS feed
 */
export async function getPostsForRSS() {
    const allPosts = await getPosts()
    return allPosts.map(post => {
        const postId = extractSlugFromFilePath(post.file)
        return {
            ...post,
            id: postId,
            link: `/post/${postId}/`
        }
    })
}
