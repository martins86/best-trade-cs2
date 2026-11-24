import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { OpportunityDetailPage } from './opportunity-detail.page';
import { OpportunityComparisonComponent } from '../ui/opportunity-comparison/opportunity-comparison.component';
import { OpportunityMockRepository } from '../data/opportunity-mock.repository';

function createDetailPage(skinId: string, direction?: string): OpportunityDetailPage {
  TestBed.configureTestingModule({
    imports: [OpportunityDetailPage],
    providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ skinId }), queryParamMap: convertToParamMap(direction === undefined ? {} : { direction }) } } }
    ]
  });
  return TestBed.createComponent(OpportunityDetailPage).componentInstance;
}

describe('OpportunityDetailPage', () => {
  it('preserva o sentido CSFloat → Steam como crédito Steam', () => {
    const component = createDetailPage('skin-awp', 'csfloat-to-steam');

    expect(component.direction).toBe('csfloat-to-steam');
    expect(component.scenario?.proceedsKind).toBe('steam-wallet-credit');
    expect(component.buy?.marketplace).toBe('csfloat');
    expect(component.sell?.marketplace).toBe('steam');
  });

  it('apresenta separadamente o sentido Steam → CSFloat como dinheiro de venda', () => {
    const component = createDetailPage('skin-awp', 'steam-to-csfloat');

    expect(component.direction).toBe('steam-to-csfloat');
    expect(component.scenario?.proceedsKind).toBe('cash');
    expect(component.buy?.marketplace).toBe('steam');
    expect(component.sell?.marketplace).toBe('csfloat');
  });

  it('não cria cenário quando o sentido não possui referência suficiente', () => {
    const component = createDetailPage('skin-stale', 'steam-to-csfloat');

    expect(component.buy).toBeNull();
    expect(component.sell).not.toBeNull();
    expect(component.scenario).toBeNull();
  });

  it('usa nomes e direção padrão quando a skin não existe', () => {
    const component = createDetailPage('unknown-skin');

    expect(component.skinName).toBe('Skin simulada');
    expect(component.direction).toBe('steam-to-csfloat');
    expect(component.buy).toBeNull();
    expect(component.sell).toBeNull();
    expect(component.scenario).toBeNull();
  });

  it('não cria cenário se uma referência do par estiver desatualizada', () => {
    const repository = new OpportunityMockRepository();
    const references = repository.getReferences().map(reference =>
      reference.id === 'awp-csfloat'
        ? { ...reference, collectedAt: '2026-01-13T11:00:00Z' }
        : reference,
    );
    const getReferences = vi.spyOn(OpportunityMockRepository.prototype, 'getReferences').mockReturnValue(references);
    const component = createDetailPage('skin-awp', 'steam-to-csfloat');
    getReferences.mockRestore();

    expect(component.buy?.id).toBe('awp-steam');
    expect(component.sell?.id).toBe('awp-csfloat');
    expect(component.scenario).toBeNull();
  });

  it('apresenta resultado não lucrativo no comparador detalhado', () => {
    TestBed.configureTestingModule({ imports: [OpportunityComparisonComponent] });
    const fixture = TestBed.createComponent(OpportunityComparisonComponent);
    fixture.componentInstance.scenario = {
      skinIdentityId: 'skin-test',
      direction: 'steam-to-csfloat',
      buyReferenceId: 'buy',
      sellReferenceId: 'sell',
      status: 'valid',
      liquidityCategory: 'medium',
      costBasisBrl: '100',
      netProceedsBrl: '90',
      netResultBrl: '-10',
      marginPercent: '-10',
      proceedsKind: 'cash',
      dataReferenceTime: '2026-01-15T12:00:00Z',
    };
    fixture.componentInstance.buy = {
      id: 'buy', skinIdentityId: 'skin-test', marketplace: 'steam', price: '100',
      currency: 'BRL', collectedAt: '2026-01-15T11:00:00Z', volume24h: 10,
      salesFrequency: '0.5', spreadPercent: '3', activeListings: 20, fees: [],
    };
    fixture.componentInstance.sell = {
      id: 'sell', skinIdentityId: 'skin-test', marketplace: 'csfloat', price: '16',
      currency: 'USD', collectedAt: '2026-01-15T11:00:00Z', volume24h: 10,
      salesFrequency: '0.5', spreadPercent: '3', activeListings: 20, fees: [],
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('não lucrativo');
    const component = fixture.componentInstance;
    expect(component.isNonProfitable(component.scenario!)).toBe(true);
    expect(component.isNonProfitable({ ...component.scenario!, netResultBrl: '1' })).toBe(false);
    expect(component.isNonProfitable({ ...component.scenario!, status: 'stale' })).toBe(false);
  });
});
