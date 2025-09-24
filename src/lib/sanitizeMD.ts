/**
 * Sanitizes markdown content by removing HTML comments
 * 
 * @param content - The markdown content to sanitize
 * @returns Clean markdown content without HTML comments
 */
export function sanitizeMD(content: string): string {
    if (!content) return content;
    
    // Remove HTML comments (<!-- comment -->)
    // This regex matches <!-- followed by any characters (including newlines) until -->
    return content.replace(/<!--[\s\S]*?-->/g, '');
}

export default sanitizeMD;