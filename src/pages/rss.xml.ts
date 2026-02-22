// Imports
import rss from '@astrojs/rss'
import age from '../lib/get-age'
import sanitizeMD from '../lib/sanitize-md'
import { getPostsForRSS } from '../lib/get-posts'
import type { PostForRSS, AstroContext } from '../lib/types'

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

// RSS feed generation
export async function GET(context: AstroContext) {
    // Get posts for RSS
    const postsForRSS = await getPostsForRSS()

    return rss({
        title: 'Adarsh R. Kumar',
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
