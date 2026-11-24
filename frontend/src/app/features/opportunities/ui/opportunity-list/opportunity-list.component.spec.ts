import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { OpportunityScenario } from '../../domain/opportunity-scenario.model';
import { OpportunityListComponent } from './opportunity-list.component';

const scenario = (overrides: Partial<OpportunityScenario> = {}): OpportunityScenario => ({
  skinIdentityId: 'skin',
  direction: 'steam-to-csfloat',
  buyReferenceId: 'buy',
  sellReferenceId: 'sell',
  status: 'valid',
  liquidityCategory: 'low',
  costBasisBrl: '100',
  netProceedsBrl: '110',
  netResultBrl: '10',
  marginPercent: '10',
  proceedsKind: 'cash',
  dataReferenceTime: '2026-01-15T12:00:00Z',
  ...overrides,
});

describe('OpportunityListComponent', () => {
  it('renders an empty state and emits the clear action', () => {
    TestBed.configureTestingModule({ imports: [OpportunityListComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(OpportunityListComponent);
    let cleared = false;
    fixture.componentInstance.clear.subscribe(() => cleared = true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nenhum resultado correspondente');
    fixture.nativeElement.querySelector('button').click();
    expect(cleared).toBe(true);
  });

  it('renders valid and unavailable scenarios for each direction and liquidity level', () => {
    TestBed.configureTestingModule({ imports: [OpportunityListComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(OpportunityListComponent);
    fixture.componentInstance.scenarios = [
      scenario(),
      scenario({
        skinIdentityId: 'skin-medium',
        direction: 'csfloat-to-steam',
        liquidityCategory: 'medium',
        netResultBrl: '0',
        marginPercent: '0',
        proceedsKind: 'steam-wallet-credit',
      }),
      scenario({ skinIdentityId: 'skin-high', liquidityCategory: 'high', marginPercent: '' }),
      scenario({ skinIdentityId: 'skin-stale', status: 'stale' }),
      scenario({ skinIdentityId: 'skin-incomplete', status: 'incomplete' }),
    ];
    fixture.componentInstance.skinNames = {
      skin: 'Skin baixa',
      'skin-medium': 'Skin média',
      'skin-high': 'Skin alta',
      'skin-stale': 'Skin desatualizada',
      'skin-incomplete': 'Skin incompleta',
    };
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Steam → CSFloat');
    expect(text).toContain('CSFloat → Steam');
    expect(text).toContain('Liquidez baixa');
    expect(text).toContain('Liquidez média');
    expect(text).toContain('Liquidez alta');
    expect(text).toContain('Saldo da carteira Steam, não sacável');
    expect(text).toContain('Não lucrativo');
    expect(text).toContain('desatualizados');
    expect(text).toContain('incompletos');
    expect(text).toContain('10.00%');
    expect(text).toContain('Não disponível');
  });

  it('formats money and treats an empty decimal as zero', () => {
    const component = new OpportunityListComponent();
    expect(component.round('1.005')).toBe('1.01');
    expect(component.newDecimal('').toString()).toBe('0');
  });
});
