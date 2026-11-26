import db from '../db'
import { posts as postsTable } from '../db/schema'

interface Post {
    file: string;
    frontmatter: {
        title?: string;
        author?: string;
        date?: string;
        pubDate?: string;
        description?: string;
    };
    rawContent: () => string;
    compiledContent?: () => string;
    slug?: string;
    url?: string;
    screenshotImage?: ReturnType<typeof generateScreenshotImage>;
}

interface DBPost {
    id: string;
    slug: string;
    title: string;
    content: string;
    author: string;
    categories: string;
    createdAt: Date;
    updatedAt: Date;
}

export function extractSlugFromFilePath(filePath: string): string {
    let slug = filePath.replace(/\\/g, '/')

    const postsMarker = '/content/blog/posts/'
    const postsIndex = slug.indexOf(postsMarker)
    if (postsIndex !== -1) slug = slug.slice(postsIndex + postsMarker.length)
    else slug = slug.split('/').pop() || ''

    if (slug.endsWith('.md')) slug = slug.slice(0, -'.md'.length)

    if (slug.endsWith('/index')) slug = slug.slice(0, -'/index'.length)

    slug = slug.replace(/^\/+|\/+$/g, '')

    return slug
}

export function cleanTextContent(text: string): string {

    if (text.includes('\n')) text = text.split('\n').join(' ')

    if (text.includes('  ')) text = text.split('  ').join(' ')

    return text
}

export function createPreviewContent(text: string, maxLength: number = 50): string {
    if (text.length > maxLength) text = text.slice(0, maxLength)

    const trimChars = [' ', ',', ':', '(', '[', '{', '|', '~', '@', '*', '+', '=', '-', '^']

    while (trimChars.some(char => text.endsWith(char))) text = text.slice(0, -1)

    return text
}

export function generateScreenshotImage(postUrl: string, title: string, imageSize: number = 512, siteUrl?: string) {
    if (postUrl.startsWith('/')) {
        const baseUrl = siteUrl || 'https://adarshrkumar.dev'
        postUrl = `${baseUrl.replace(/\/$/, '')}${postUrl}`
    }

    const screenshotUrl = `https://webshot.adarshrkumar.dev/api/take?url=${encodeURIComponent(postUrl)}&viewport_width=${imageSize}&viewport_height=${imageSize}`

    return {
        src: screenshotUrl,
        alt: `Screenshot of the "${title}" post.`,
        placeholder: `${screenshotUrl}&image_quality=50`
    }
}

function getPostCreatedDate(post: Post): Date {
    return new Date(post.frontmatter.date || post.frontmatter.pubDate || 0)
}

export async function getDBPosts(): Promise<Post[]> {
    try {
        return (await db.select().from(postsTable)).map((dbPost: DBPost): Post => ({
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
        }))
    } catch (error) {
        console.error('Error fetching DB posts:', error)
        return []
    }
}

export function getLocalPosts(): Post[] {
    const publishedPosts: Post[] = Object.values(import.meta.glob('../../content/blog/posts/**/*.md', { eager: true }))
        .filter((item): item is Post => Boolean(item && typeof item === 'object' && 'file' in item && !item.file?.toString().split('/').pop()?.startsWith('_')))

    return publishedPosts
}

export async function getPosts(siteUrl?: string | URL): Promise<Post[]> {
    return addDisplayMetadata([...getLocalPosts(), ...(await getDBPosts())].sort((a, b) => getPostCreatedDate(b).getTime() - getPostCreatedDate(a).getTime()), siteUrl)
}

export function addDisplayMetadata(posts: Post[], siteUrl?: string | URL) {
    const siteLocation = {
        protocol: 'https:',
        host: siteUrl ? new URL(siteUrl).host : '',
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

export async function getFeaturedPosts(featuredSlugs: string[], siteUrl?: string | URL): Promise<Post[]> {
    const allPosts = await getPosts(siteUrl)
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

export async function findPostById(postId: string | undefined): Promise<Post | undefined> {
    return (await getPosts()).find(post =>
        !post.file.startsWith('_') &&
        post.file.includes(postId || '')
    )
}

export async function getPostsForRSS() {
    return (await getPosts()).map(post => {
        const postId = extractSlugFromFilePath(post.file)
        return {
            ...post,
            id: postId,
            link: `/post/${postId}/`
        }
    })
}
