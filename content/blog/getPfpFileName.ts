import fs from 'fs'
import path from 'path'

function getPfpFileName(username: string): string[] {
    const files = fs.readdirSync(path.join(__dirname, 'authors', username))
    return files.filter(file => file.startsWith('pfp'))
}

export default getPfpFileName