import path from 'node:path'

export default function getFName(name: string): string {
    if (name.includes('/')) {
        name = path.basename(new URL(name, 'http://localhost').pathname)

        if (name.includes('.')) {
            const nameParts = name.split('.')
            if (nameParts.length > 2) name = `${nameParts.slice(0, -2).join('.')}.${nameParts.at(-1) ?? ''}`
        }
    }

    return name
}
