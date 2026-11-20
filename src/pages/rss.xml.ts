import rss from '@astrojs/rss'

import { getPostsForRSS } from '../lib/get-posts'
import { cleanAboutContent } from '../lib/get-raw-about-content'
import sanitizeMD from '../lib/sanitize-md'

interface AstroContext {
    site: string | URL;
    trailingSlash: boolean;
    [key: string]: URL | string | boolean | undefined;
}

const aboutFile = await import('../../content/aboutContent.md')
const aboutContent = cleanAboutContent(sanitizeMD(aboutFile.rawContent()))

export async function GET(context: AstroContext) {
    return rss({
        title: 'Adarsh R. Kumar',
        description: aboutContent,
        site: context.site,
        trailingSlash: context.trailingSlash,
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
