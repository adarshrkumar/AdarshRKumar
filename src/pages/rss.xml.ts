import rss from '@astrojs/rss'
import age from '../../content/getAge'
import type { Post, RSSItem } from '../lib/types'

// Helper function to clean and normalize about content
function cleanAboutContent(content: string): string {
    let cleanedContent = content
        .replaceAll('{ age }', age.toString())
        .replaceAll('  ', ' ')
        .replaceAll(' \n', ' ')
        .replaceAll('\n', ' ')
    
    // Remove leading and trailing spaces
    while (cleanedContent.startsWith(' ')) {
        cleanedContent = cleanedContent.slice(1)
    }
    while (cleanedContent.endsWith(' ')) {
        cleanedContent = cleanedContent.slice(0, -1)
    }
    
    return cleanedContent
}

// Helper function to extract post ID from file path
function extractPostId(filePath: string): string {
    const pathPrefix = '../../content/blog/posts/'
    let postId = filePath
    
    if (postId.startsWith(pathPrefix)) {
        postId = postId.slice(pathPrefix.length)
    }
    
    return postId
}

// Load posts and about content
const postItems = import.meta.glob('../../content/blog/posts/**/*.md', { eager: true })
const postKeys = Object.keys(postItems)
const allPosts: Post[] = Object.values(postItems) as Post[]

const aboutFile = await import('../../content/aboutContent.md')
const aboutContent = cleanAboutContent(aboutFile.rawContent())

export async function GET(context: any) {
    return rss({
        title: 'Buzz\'s Blog',
        description: aboutContent,
        site: context.site,
        trailingSlash: context.trailingSlash,
        items: allPosts.map((post: Post, index: number) => {
            const postId = extractPostId(postKeys[index])
            
            return {
                title: post.frontmatter.title || 'Untitled',
                pubDate: post.frontmatter.pubDate ? new Date(post.frontmatter.pubDate) : new Date(),
                description: post.frontmatter.description || '',
                link: `/post/${postId}/`,
            }
        }),
    })
}
