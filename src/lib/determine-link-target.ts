export default function determineLinkTarget(url: string, siteUrl: string | URL | undefined): string {
    let target = '_blank'

    if (url.startsWith('//')) url = `https:${url}`;

    let domain = url
    if (domain.includes('://')) {
        domain = domain.split('://')[1]
        if (domain.includes('/')) domain = domain.split('/')[0];
        if (domain.startsWith('www.')) domain = domain.slice('www.'.length);
        domain = `https://${domain}`
    }

    if (!url.includes(':') || domain === siteUrl?.toString()) target = '_self';

    return target
}
