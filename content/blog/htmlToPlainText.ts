// Converts HTML content to plain text
function htmlToPlainText(content: string): string {
    let plainText = content

    plainText = plainText.replace(/\n/ig, '')

    plainText = plainText
        .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/ig, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/ig, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/ig, '')

    plainText = plainText
        .replace(/<\/\s*(?:p|div)>/ig, '\n')
        .replace(/<br[^>]*\/?>/ig, '\n')

    plainText = plainText.replace(/<[^>]*>/ig, '')

    plainText = plainText
        .replace('&nbsp;', ' ')
        .replace(/[^\S\r\n][^\S\r\n]+/ig, ' ')

    if (plainText.endsWith('\n')) plainText = plainText.slice(0, -1)

    return plainText
}

export default htmlToPlainText