import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

import { getPostsForRSS } from '../lib/get-posts'
import { cleanAboutContent } from '../lib/get-raw-about-content'
import sanitizeMD from '../lib/sanitize-md'

const aboutFile = await import('../../content/aboutContent.md')
const aboutContent = cleanAboutContent(sanitizeMD(aboutFile.rawContent()))

export async function GET(context: APIContext) {
    return rss({
        title: 'Adarsh R. Kumar',
        description: aboutContent,
        site: context.site ?? context.url.origin,
        items: (await getPostsForRSS()).map(post => {
            return {
                title: post.frontmatter.title || 'Untitled',
                pubDate: post.frontmatter.pubDate ? new Date(post.frontmatter.pubDate) : new Date(),
                description: post.frontmatter.description || '',
                link: post.link,
            }
        }),
    })
}
