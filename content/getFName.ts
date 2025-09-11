function getFName(name: string): string {
    if (name.includes('/')) {
        name = name.split('/').slice(-1)[0]
        if (name.includes('?')) name = name.split('?')[0]
        if (name.includes('.')) {
            if (name.split('.').length > 2) {
                const nameParts = name.split('.')
                name = `${nameParts.slice(0, -2).join('.')}.${nameParts.slice(-1).join('.')}`
            }
        }
    }
    return name
}

export default getFName
