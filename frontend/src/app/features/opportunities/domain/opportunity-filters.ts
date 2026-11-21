import Decimal from 'decimal.js';
import { Direction, LiquidityCategory } from './opportunity-types';
import { OpportunityScenario } from './opportunity-scenario.model';

export interface OpportunityFilter {
  search: string;
  costMin: number | null;
  costMax: number | null;
  marginMin: number | null;
  liquidityMin: LiquidityCategory | null;
  direction: Direction | null;
}

const liquidityRank: Record<LiquidityCategory, number> = { low: 0, medium: 1, high: 2 };

export function filterOpportunities(items: OpportunityScenario[], filter: OpportunityFilter, skinNames: Record<string, string>): OpportunityScenario[] {
  if (filter.costMin !== null && filter.costMax !== null && filter.costMin > filter.costMax) return [];
  const search = filter.search.trim().toLowerCase();
  return items.filter(item => {
    if (search && !skinNames[item.skinIdentityId]?.toLowerCase().includes(search)) return false;
    if (filter.direction && item.direction !== filter.direction) return false;
    if (filter.liquidityMin && liquidityRank[item.liquidityCategory] < liquidityRank[filter.liquidityMin]) return false;
    if (item.status !== 'valid') return false;
    if (filter.costMin !== null && new Decimal(item.costBasisBrl).lt(filter.costMin)) return false;
    if (filter.costMax !== null && new Decimal(item.costBasisBrl).gt(filter.costMax)) return false;
    if (filter.marginMin !== null && new Decimal(item.marginPercent).lt(filter.marginMin)) return false;
    return true;
  });
}
