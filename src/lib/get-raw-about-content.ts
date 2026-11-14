import * as $ from 'cheerio'

import age from './get-age'

const aboutFile = await import('../../content/aboutContent.md')
const aboutContent = await aboutFile.compiledContent()

export function cleanAboutContent(content: string): string {
    let cleanedContent = content
        .replaceAll('{ age }', age.toString())
        .replaceAll('  ', ' ')
        .replaceAll(' \n', ' ')
        .replaceAll('\n', ' ')

    while (cleanedContent.startsWith(' ')) cleanedContent = cleanedContent.slice(1)
    while (cleanedContent.endsWith(' ')) cleanedContent = cleanedContent.slice(0, -1)

    return cleanedContent
}

export default cleanAboutContent($.load(aboutContent).text())