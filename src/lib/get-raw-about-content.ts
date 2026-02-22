import age from './get-age'

import * as $ from 'cheerio'

const aboutFile = await import('../../content/aboutContent.md')
const aboutContent = await aboutFile.compiledContent()

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

const dom = $.load(aboutContent)
const textContent = dom.text()
export default cleanAboutContent(textContent)