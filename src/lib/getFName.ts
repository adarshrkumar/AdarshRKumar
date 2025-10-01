/**
 * Extracts a clean filename from a file path
 * Handles complex extensions and query parameters
 * 
 * @param name - The file path or filename to process
 * @returns Clean filename without path, query params, or complex extensions
 */

// Main filename processing function
function getFName(name: string): string {
    let fileName = name
    
    // Extract filename from path if it contains directory separators
    if (fileName.includes('/')) {
        fileName = fileName.split('/').slice(-1)[0]
        
        // Remove query parameters if present
        if (fileName.includes('?')) {
            fileName = fileName.split('?')[0]
        }
        
        // Handle complex file extensions (e.g., file.name.jpg -> file.jpg)
        if (fileName.includes('.')) {
            const nameParts = fileName.split('.')
            if (nameParts.length > 2) {
                fileName = `${nameParts.slice(0, -2).join('.')}.${nameParts.slice(-1).join('.')}`
            }
        }
    }
    
    return fileName
}

export default getFName
