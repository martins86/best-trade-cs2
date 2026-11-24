import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OpportunityListPage } from './opportunity-list.page';
import { OpportunityScenario } from '../domain/opportunity-scenario.model';
import { OpportunityTableComponent } from '../ui/opportunity-table/opportunity-table.component';

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

  it('mantém cenários válidos positivos e negativos e exclui dados desatualizados do filtro disponível', () => {
    const page = createPage();
    const valid = page.scenarios.filter(item => item.status === 'valid');
    const stale = page.scenarios.filter(item => item.status === 'stale');

    expect(valid.some(item => Number(item.netResultBrl) > 0)).toBe(true);
    expect(valid.some(item => Number(item.netResultBrl) < 0)).toBe(true);
    expect(stale.length).toBeGreaterThan(0);
  });

  it('apresenta resultados positivo, nulo e negativo e estados desatualizado/incompleto', () => {
    TestBed.configureTestingModule({ imports: [OpportunityTableComponent] });
    const fixture = TestBed.createComponent(OpportunityTableComponent);
    const validBase: OpportunityScenario = {
      skinIdentityId: 'skin-test',
      direction: 'steam-to-csfloat',
      buyReferenceId: 'buy',
      sellReferenceId: 'sell',
      status: 'valid',
      liquidityCategory: 'medium',
      costBasisBrl: '100',
      netProceedsBrl: '100',
      netResultBrl: '0',
      marginPercent: '0',
      proceedsKind: 'cash',
      dataReferenceTime: '2026-01-15T12:00:00Z',
    };
    fixture.componentInstance.scenarios = [
      { ...validBase, netResultBrl: '10', netProceedsBrl: '110', marginPercent: '10' },
      { ...validBase },
      { ...validBase, netResultBrl: '-10', netProceedsBrl: '90', marginPercent: '-10' },
      { ...validBase, status: 'stale', costBasisBrl: '', netProceedsBrl: '', netResultBrl: '', marginPercent: '' },
      { ...validBase, status: 'incomplete', costBasisBrl: '', netProceedsBrl: '', netResultBrl: '', marginPercent: '' },
    ];
    fixture.componentInstance.skinNames = { 'skin-test': 'Skin simulada' };
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('+ R$');
    expect(text).toContain('+ R$ 0.00');
    expect(text).toContain('− R$');
    expect(text).toContain('Desatualizada');
    expect(text).toContain('Incompleta');
  });

  it('apresenta estado vazio e emite ação para limpar filtros', () => {
    TestBed.configureTestingModule({ imports: [OpportunityTableComponent] });
    const fixture = TestBed.createComponent(OpportunityTableComponent);
    let cleared = false;
    fixture.componentInstance.clear.subscribe(() => cleared = true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Nenhum resultado correspondente');
    fixture.nativeElement.querySelector('.empty-state button').click();
    expect(cleared).toBe(true);
  });
});
