import { describe, expect, it } from 'vitest';
import { filterOpportunities } from './opportunity-filters';
import { OpportunityScenario } from './opportunity-scenario.model';

const item: OpportunityScenario = { skinIdentityId: 's', direction: 'steam-to-csfloat', buyReferenceId: 'b', sellReferenceId: 'v', status: 'valid', liquidityCategory: 'medium', costBasisBrl: '500', netProceedsBrl: '520', netResultBrl: '20', marginPercent: '4', proceedsKind: 'cash', dataReferenceTime: '2026-01-15T12:00:00Z' };

describe('opportunity filters', () => {
  it('combina filtros com limite inclusivo', () => {
    expect(filterOpportunities([item], { search: 'AWP', costMin: 500, costMax: 500, marginMin: 4, liquidityMin: 'medium', direction: 'steam-to-csfloat' }, { s: 'AWP | Asiimov' })).toHaveLength(1);
  });
  it('rejeita faixa invertida', () => expect(filterOpportunities([item], { search: '', costMin: 600, costMax: 500, marginMin: null, liquidityMin: null, direction: null }, { s: 'AK' })).toHaveLength(0));
  it('rejeita cenários por busca, direção, liquidez, estado, custo e margem', () => {
    const filter = { search: 'awp', costMin: 500, costMax: 500, marginMin: 4, liquidityMin: 'medium' as const, direction: 'steam-to-csfloat' as const };
    const names = { s: 'AK-47' };

    expect(filterOpportunities([item], filter, names)).toHaveLength(0);
    expect(filterOpportunities([item], { ...filter, search: '' , direction: 'csfloat-to-steam' }, names)).toHaveLength(0);
    expect(filterOpportunities([item], { ...filter, search: '', liquidityMin: 'high' }, names)).toHaveLength(0);
    expect(filterOpportunities([{ ...item, status: 'stale' }], { ...filter, search: '' }, names)).toHaveLength(0);
    expect(filterOpportunities([{ ...item, costBasisBrl: '499' }], { ...filter, search: '' }, names)).toHaveLength(0);
    expect(filterOpportunities([{ ...item, costBasisBrl: '501' }], { ...filter, search: '' }, names)).toHaveLength(0);
    expect(filterOpportunities([{ ...item, marginPercent: '3.99' }], { ...filter, search: '' }, names)).toHaveLength(0);
    expect(filterOpportunities([item], { ...filter, search: '  awp  ' }, { s: 'AWP | Asiimov' })).toEqual([item]);
  });
});
