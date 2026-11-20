export function sanitizeMD(content: string): string {
    if (!content) return content;

    return content.replace(/<!--[\s\S]*?-->/g, '');
}

export default sanitizeMD;
