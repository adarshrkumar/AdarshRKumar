/**
 * Converts HTML content to plain text
 * Removes HTML tags, scripts, styles, and normalizes whitespace
 * 
 * @param content - HTML content to convert
 * @returns Plain text version of the content
 */
function htmlToPlainText(content: string): string {
    let plainText = content
    
    // Remove existing newlines first
    plainText = plainText.replace(/\n/ig, '')
    
    // Remove script and style tags and their content
    plainText = plainText
        .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/ig, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/ig, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/ig, '')
    
    // Convert block elements to line breaks
    plainText = plainText
        .replace(/<\/\s*(?:p|div)>/ig, '\n')
        .replace(/<br[^>]*\/?>/ig, '\n')
    
    // Remove all remaining HTML tags
    plainText = plainText.replace(/<[^>]*>/ig, '')
    
    // Normalize whitespace and special characters
    plainText = plainText
        .replace('&nbsp;', ' ')
        .replace(/[^\S\r\n][^\S\r\n]+/ig, ' ')  // Replace multiple spaces with single space
    
    // Remove trailing newline if present
    if (plainText.endsWith('\n')) {
        plainText = plainText.slice(0, -1)
    }
    
    return plainText
}

export default htmlToPlainText