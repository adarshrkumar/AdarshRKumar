import path from 'node:path'

// Extracts a clean filename from a file path
export default function getFName(name: string): string {
    let fileName = name

    if (fileName.includes('/')) {
        fileName = path.basename(new URL(name, 'http://localhost').pathname)

        if (fileName.includes('.')) {
            const nameParts = fileName.split('.')
            if (nameParts.length > 2) fileName = `${nameParts.slice(0, -2).join('.')}.${nameParts.at(-1) ?? ''}`
        }
    }

    return fileName
}
