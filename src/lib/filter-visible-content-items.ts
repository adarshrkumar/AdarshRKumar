import type { PortfolioItem } from './types'
import getFName from './get-fname'

export default function filterVisibleContentItems(items: PortfolioItem[]): PortfolioItem[] {
    return items.filter(item => !getFName(item.file).startsWith('_'))
}