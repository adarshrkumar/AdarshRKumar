import rss from '@astrojs/rss'

const items = import.meta.glob('../../content/blog/posts/**/*.md', { eager: true })
const keys = Object.keys(items)
const posts = Object.values(items)

import age from '../../content/getAge'

const aboutFile = await import('../../content/aboutContent.md')
let aboutContent = aboutFile.rawContent().replaceAll('{ age }', age.toString()).replaceAll('  ', ' ').replaceAll(' \n', ' ').replaceAll('\n', ' ')
while (aboutContent.startsWith(' ')) aboutContent = aboutContent.slice(1)
while (aboutContent.endsWith(' ')) aboutContent = aboutContent.slice(0, -1)

export async function GET(context: any) {
    return rss({
        title: 'Buzz\'s Blog',
        description: aboutContent,
        site: context.site,
        trailingSlash: context.trailingSlash,
        items: posts.map((post: any, i: number) => {
            let id = keys[i]
            const sw = `../../content/blog/posts/`
            if (id) if (id.startsWith(sw)) id = id.slice(sw.length)
            return {
                title: post.frontmatter.title,
                pubDate: post.frontmatter.pubDate,
                description: post.frontmatter.description,
                // Compute RSS link from post `id`
                // This example assumes all posts are rendered as `/blog/[id]` routes
                link: `/post/${id}/`,
            }
        }),
    })
}
