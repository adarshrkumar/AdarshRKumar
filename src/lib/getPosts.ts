import type { Post } from './types'

// Helper functions

/**
 * Helper function to extract clean site URL
 */
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

/**
 * Helper function to extract slug from file path
 */
export function extractSlugFromFilePath(filePath: string): string {
    const pathPrefix = 'AdarshRKumar.dev/content/blog/posts/'
    let slug = filePath
    
    const prefixIndex = slug.indexOf(pathPrefix)
    if (prefixIndex !== -1) {
        slug = slug.slice(prefixIndex + pathPrefix.length)
    }
    
    if (slug.endsWith('.md')) {
        slug = slug.slice(0, -'.md'.length)
    }
    
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
export function generateScreenshotImage(postUrl: string, title: string, imageSize: number = 512) {
    const screenshotUrl = `https://webshot.adarshrkumar.dev/take?url=${encodeURIComponent(postUrl)}&viewport_width=${imageSize}&viewport_height=${imageSize}`
    
    return {
        src: screenshotUrl,
        alt: `Screenshot of the "${title}" post.`,
        placeholder: `${screenshotUrl}&image_quality=50`
    }
}

// Main post functions

/**
 * Main function to get all published blog posts
 */
export function getPosts(): Post[] {
    const blogPostItems = import.meta.glob('../../content/blog/posts/**/*.md', { eager: true })
    const publishedPosts: Post[] = Object.values(blogPostItems)
        .filter(item => {
            const fileName = (item as Post).file.split('/').pop() || ''
            return !fileName.startsWith('_')
        }) as Post[]
    
    return publishedPosts
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
export function getPostsForDisplay(siteUrl?: string | URL) {
    return addDisplayMetadata(getPosts(), siteUrl)
}

/**
 * Function to get featured posts by slug
 */
export function getFeaturedPosts(featuredSlugs: string[]) {
    const allPosts = getPosts()
    const featuredPosts: Post[] = []
    
    featuredSlugs.forEach(targetSlug => {
        const filename = targetSlug.endsWith('.md') ? targetSlug : `${targetSlug}.md`
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
export function getFeaturedPostsForDisplay(featuredSlugs: string[], siteUrl?: string | URL) {
    return addDisplayMetadata(getFeaturedPosts(featuredSlugs), siteUrl)
}

/**
 * Function to find a specific post by ID/slug
 */
export function findPostById(postId: string | undefined): Post | undefined {
    return getPosts().find(post => 
        !post.file.startsWith('_') && 
        post.file.includes(postId || '')
    )
}

/**
 * Function to get posts for RSS feed
 */
export function getPostsForRSS() {
    return getPosts().map(post => {
        const postId = extractSlugFromFilePath(post.file)
        return {
            ...post,
            id: postId,
            link: `/post/${postId}/`
        }
    })
}
