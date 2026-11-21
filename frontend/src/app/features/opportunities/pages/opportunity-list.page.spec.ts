import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OpportunityListPage } from './opportunity-list.page';

const makeEvent = (value: string): Event => ({ target: { value } } as unknown as Event);

function createPage(): OpportunityListPage {
  TestBed.configureTestingModule({ imports: [OpportunityListPage] });
  return TestBed.createComponent(OpportunityListPage).componentInstance;
}

describe('OpportunityListPage', () => {
  it('deriva indicadores sem criar cenários financeiros', () => {
    const page = createPage();
    expect(page.indicators().length).toBe(4);
    expect(page.indicators().map(item => item.id)).toEqual(['valid', 'profitable', 'margin', 'liquidity']);
  });

  it('combina filtros e rejeita faixa inválida', () => {
    const page = createPage();
    page.updateSearch(makeEvent('AK'));
    page.updateDirection(makeEvent('steam-to-csfloat'));
    page.updateLiquidity(makeEvent('medium'));
    page.updateMargin(makeEvent('0'));
    page.updateCostMin(makeEvent('600'));
    page.updateCostMax(makeEvent('500'));

    expect(page.rangeInvalid()).toBe(true);
    expect(page.visibleScenarios()).toHaveLength(0);
  });

  it('limpa filtros e ordenação', () => {
    const page = createPage();
    page.updateSearch(makeEvent('AK'));
    page.updateSort(makeEvent('margin'));
    page.clearFilters();

    expect(page.filter().search).toBe('');
    expect(page.filter().direction).toBeNull();
    expect(page.sortMode()).toBe('liquidity');
  });
});
