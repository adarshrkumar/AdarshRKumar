import fs from 'fs'
import path from 'path'

export default function getPfpFileName(username: string): string[] {
    try {
        return fs.readdirSync(path.join('authors', username)).filter(file => file.startsWith('pfp'))
    } catch (error) {
        console.error(`Error reading profile pictures for user ${username}:`, error)
        return []
    }
}