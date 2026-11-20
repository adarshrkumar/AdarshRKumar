import getFName from './get-fname'

export interface PortfolioItem {
    file: string;
    frontmatter: {
        url: string;
        name: string;
        target?: string;
        image?: string;
        projectsCategory?: string;
    };
    rawContent: () => string;
}

export function filterVisibleContentItems(items: PortfolioItem[]): PortfolioItem[] {
    return items.filter(item => !getFName(item.file).startsWith('_'))
}