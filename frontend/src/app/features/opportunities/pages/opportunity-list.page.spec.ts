import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { OpportunityListPage } from './opportunity-list.page';
import { OpportunityScenario } from '../domain/opportunity-scenario.model';
import { OpportunityTableComponent } from '../ui/opportunity-table/opportunity-table.component';
import { MatDialog } from '@angular/material/dialog';
import { OpportunityMockRepository } from '../data/opportunity-mock.repository';

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

  it('ordena pelos modos de margem e resultado e aceita filtros vazios', () => {
    const page = createPage();
    const byMargin = page.visibleScenarios();
    page.updateSort(makeEvent('margin'));
    const marginSorted = page.visibleScenarios();
    expect(Number(marginSorted[0].marginPercent)).toBeGreaterThanOrEqual(Number(marginSorted.at(-1)!.marginPercent));
    expect(marginSorted).toHaveLength(byMargin.length);

    page.updateSort(makeEvent('result'));
    const resultSorted = page.visibleScenarios();
    expect(Number(resultSorted[0].netResultBrl)).toBeGreaterThanOrEqual(Number(resultSorted.at(-1)!.netResultBrl));

    page.updateDirection(makeEvent(''));
    page.updateLiquidity(makeEvent(''));
    page.updateMargin(makeEvent(''));
    page.updateCostMin(makeEvent(''));
    page.updateCostMax(makeEvent(''));
    expect(page.filter()).toMatchObject({ direction: null, liquidityMin: null, marginMin: null, costMin: null, costMax: null });
  });

  it('renderiza filtros e encaminha eventos da interface', () => {
    TestBed.configureTestingModule({ imports: [OpportunityListPage] });
    const fixture = TestBed.createComponent(OpportunityListPage);
    fixture.detectChanges();

    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'AWP';
    search.dispatchEvent(new Event('input'));

    const selects = fixture.nativeElement.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;
    selects[0].value = 'csfloat-to-steam';
    selects[0].dispatchEvent(new Event('change'));
    selects[1].value = 'high';
    selects[1].dispatchEvent(new Event('change'));
    selects[2].value = 'result';
    selects[2].dispatchEvent(new Event('change'));

    const numbers = fixture.nativeElement.querySelectorAll('input[type="number"]') as NodeListOf<HTMLInputElement>;
    numbers[0].value = '5';
    numbers[0].dispatchEvent(new Event('input'));
    numbers[1].value = '100';
    numbers[1].dispatchEvent(new Event('input'));
    numbers[2].value = '200';
    numbers[2].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.filter()).toMatchObject({
      search: 'AWP', direction: 'csfloat-to-steam', liquidityMin: 'high',
      marginMin: 5, costMin: 100, costMax: 200,
    });

    fixture.nativeElement.querySelector('.clear-button').click();
    expect(fixture.componentInstance.filter().search).toBe('');
  });

  it('gera estados incompletos, stale e não equivalentes nos dados de origem', () => {
    const repository = new OpportunityMockRepository();
    const sourceReferences = repository.getReferences();
    const steamReference = sourceReferences.find(reference => reference.id === 'awp-steam')!;
    const references = sourceReferences
      .filter(reference => reference.id !== 'load-1-steam')
      .map(reference => {
        if (reference.id === 'stale-csfloat') return { ...reference, collectedAt: '2026-01-15T11:00:00Z' };
        if (reference.id === 'load-2-steam') return { ...reference, collectedAt: '2026-01-13T11:00:00Z' };
        return reference;
      });
    references.push({ ...steamReference, id: 'stale-steam', skinIdentityId: 'skin-stale' });
    const getReferences = vi.spyOn(OpportunityMockRepository.prototype, 'getReferences').mockReturnValue(references);
    const page = createPage();
    getReferences.mockRestore();

    expect(page.scenarios.find(item => item.skinIdentityId === 'skin-load-1')?.status).toBe('incomplete');
    expect(page.scenarios.find(item => item.skinIdentityId === 'skin-load-2')?.status).toBe('stale');
    expect(page.scenarios.some(item => item.skinIdentityId === 'skin-stale')).toBe(false);
  });

  it('abre detalhes somente quando o cenário e as referências são válidos', () => {
    TestBed.configureTestingModule({ imports: [OpportunityListPage] });
    const page = TestBed.createComponent(OpportunityListPage).componentInstance;
    const valid = page.scenarios.find(item => item.status === 'valid')!;
    const open = vi.spyOn(MatDialog.prototype, 'open').mockImplementation(() => {
      throw new Error('dialog opened');
    });

    page.openDetail({ ...valid, status: 'stale' });
    page.openDetail({ ...valid, buyReferenceId: 'missing-reference' });
    expect(open).not.toHaveBeenCalled();

    expect(() => page.openDetail(valid)).toThrow('dialog opened');
    expect(open).toHaveBeenCalledOnce();
    open.mockRestore();
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
