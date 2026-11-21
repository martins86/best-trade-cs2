import { describe, expect, it } from 'vitest';
import { filterOpportunities } from './opportunity-filters';
import { OpportunityScenario } from './opportunity-scenario.model';

const item: OpportunityScenario = { skinIdentityId: 's', direction: 'steam-to-csfloat', buyReferenceId: 'b', sellReferenceId: 'v', status: 'valid', liquidityCategory: 'medium', costBasisBrl: '500', netProceedsBrl: '520', netResultBrl: '20', marginPercent: '4', proceedsKind: 'cash', dataReferenceTime: '2026-01-15T12:00:00Z' };

describe('opportunity filters', () => {
  it('combina filtros com limite inclusivo', () => {
    expect(filterOpportunities([item], { search: 'AWP', costMin: 500, costMax: 500, marginMin: 4, liquidityMin: 'medium', direction: 'steam-to-csfloat' }, { s: 'AWP | Asiimov' })).toHaveLength(1);
  });
  it('rejeita faixa invertida', () => expect(filterOpportunities([item], { search: '', costMin: 600, costMax: 500, marginMin: null, liquidityMin: null, direction: null }, { s: 'AK' })).toHaveLength(0));
});
