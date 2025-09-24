import fs from 'fs'
import path from 'path'

/**
 * Gets profile picture filenames for a given username
 * Searches in the authors directory for files starting with 'pfp'
 * 
 * @param username - The username to search for profile pictures
 * @returns Array of profile picture filenames
 */
function getPfpFileName(username: string): string[] {
    try {
        const authorDirectory = path.join(__dirname, 'authors', username)
        const files = fs.readdirSync(authorDirectory)
        
        // Filter for profile picture files (starting with 'pfp')
        return files.filter(file => file.startsWith('pfp'))
    } catch (error) {
        console.error(`Error reading profile pictures for user ${username}:`, error)
        return []
    }
}

export default getPfpFileName