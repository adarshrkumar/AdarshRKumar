import getFName from './get-fname'
import type { PortfolioItem } from './types'

export default function filterVisibleContentItems(items: PortfolioItem[]): PortfolioItem[] {
    return items.filter(item => !getFName(item.file).startsWith('_'))
}