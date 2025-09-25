// Imports
import rss from '@astrojs/rss'
import age from '../lib/getAge'
import sanitizeMD from '../lib/sanitizeMD'
import { getPostsForRSS } from '../lib/getPosts'
import type { PostForRSS } from '../lib/types'

// Helper functions
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

// Data loading and processing
// Load about content
const aboutFile = await import('../../content/aboutContent.md')
const aboutContent = cleanAboutContent(sanitizeMD(aboutFile.rawContent()))

// Get posts for RSS
const postsForRSS = getPostsForRSS()

// RSS feed generation
export async function GET(context: any) {
    return rss({
        title: 'Buzz\'s Blog',
        description: aboutContent,
        site: context.site,
        trailingSlash: context.trailingSlash,
        items: postsForRSS.map((post: PostForRSS) => {
            return {
                title: post.frontmatter.title || 'Untitled',
                pubDate: post.frontmatter.pubDate ? new Date(post.frontmatter.pubDate) : new Date(),
                description: post.frontmatter.description || '',
                link: post.link,
            }
        }),
    })
}
