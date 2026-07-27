import type { PageImport } from './types';

export default function getAllSitePages(): PageImport[] {
    const items = import.meta.glob('../pages/*.astro', { eager: true })
    const pages = Object.values(items);

    const links: { url: string; name: string, target?: string, primaryCls?: string }[] = []

    // Add Home page first
    pages.forEach(page => {
        var link = getLink(page)
        if (link && link.name === 'Home') links.push(link)
    })

    // Add other pages
    pages.forEach(page => {
        var link = getLink(page)
        if (link && link.name !== 'Home' && link.url) links.push(link)
    })

    // Helper functions

    function getLink(link: PageImport) {
        var lPath = link.url

        // Handle empty string URL (index.astro)
        if (lPath === '') {
            return { url: '/', name: 'Home' }
        }

        if (!lPath) return null

        var fileName = lPath
        if (fileName.startsWith('/')) fileName = fileName.slice(1)
        if (fileName === '') fileName = 'home'
        else if (fileName.startsWith('_')) return null
        else if (fileName.startsWith('[') && fileName.endsWith(']')) return null
        else if (parseInt(fileName)) return null

        if (fileName.endsWith('/')) fileName = fileName.slice(0, -1)

        var nameParts = fileName.includes('-') ? fileName.split('-') : [fileName]
        nameParts = nameParts.map(p => `${p.substring(0, 1).toUpperCase()}${p.slice(1)}`)
        var name = nameParts.join(' ')

        if (lPath.startsWith('//')) lPath = `https:${lPath}`
        else if (lPath === 'home' || !lPath) lPath = '/'
        else if (lPath && !lPath.includes('://') && !lPath.startsWith('/') && !lPath.endsWith('/')) lPath = `/${lPath}/`

        // Don't remove trailing slash from home page
        if (lPath.endsWith('/') && lPath !== '/') lPath = lPath.slice(0, -1)

        return { url: lPath, name }
    }
    return links
}