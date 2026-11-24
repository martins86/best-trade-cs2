import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OpportunityTableComponent } from './opportunity-table.component';
import { OpportunityScenario } from '../../domain/opportunity-scenario.model';

const scenario = (status: OpportunityScenario['status']): OpportunityScenario => ({
  skinIdentityId: 'skin', direction: 'csfloat-to-steam', buyReferenceId: 'buy', sellReferenceId: 'sell',
  status, liquidityCategory: 'high', costBasisBrl: status === 'valid' ? '100' : '',
  netProceedsBrl: status === 'valid' ? '110' : '', netResultBrl: status === 'valid' ? '-5' : '',
  marginPercent: status === 'valid' ? '-5' : '', proceedsKind: 'steam-wallet-credit', dataReferenceTime: '2026-01-15T12:00:00Z'
});

describe('OpportunityTableComponent', () => {
  it('mantém estados inválidos sem transformar valores em zero', () => {
    const component = new OpportunityTableComponent();
    expect(component.statusLabel('stale')).toBe('Desatualizada');
    expect(component.statusLabel('not-equivalent')).toBe('Não equivalente');
    expect(component.statusLabel('incomplete')).toBe('Incompleta');
    expect(component.money(scenario('incomplete').costBasisBrl)).toBe('0.00');
    expect(component.decimal('').toString()).toBe('0');
    expect(component.abs('-5')).toBe('5');
    expect(component.directionLabel('steam-to-csfloat')).toBe('Steam → CSFloat');
    expect(component.liquidityLabel('medium')).toBe('Média');
    expect(component.liquidityLabel('low')).toBe('Baixa');
    expect(component.detailLabel(scenario('valid'))).toBe('Ver detalhes de skin simulada');
  });

  it('representa crédito Steam separadamente em cenário válido', () => {
    const component = new OpportunityTableComponent();
    const valid = scenario('valid');
    expect(valid.proceedsKind).toBe('steam-wallet-credit');
    expect(component.directionLabel(valid.direction)).toBe('CSFloat → Steam');
  });

  it('emite uma oportunidade válida para abertura da modal', () => {
    const component = new OpportunityTableComponent();
    const valid = scenario('valid');
    component.skinNames = { skin: 'Skin simulada' };
    let emitted: OpportunityScenario | undefined;
    component.detail.subscribe(value => { emitted = value; });

    component.openDetail(valid);

    expect(component.detailLabel(valid)).toBe('Ver detalhes de Skin simulada');
    expect(emitted).toBe(valid);
  });

  it('não emite detalhe para cenários inválidos', () => {
    const component = new OpportunityTableComponent();
    let emitted = false;
    component.detail.subscribe(() => { emitted = true; });

    component.openDetail(scenario('incomplete'));

    expect(emitted).toBe(false);
  });

  it('renderiza ícone de visualização com rótulo acessível da skin', () => {
    TestBed.configureTestingModule({ imports: [OpportunityTableComponent] });
    const fixture = TestBed.createComponent(OpportunityTableComponent);
    fixture.componentInstance.scenarios = [scenario('valid')];
    fixture.componentInstance.skinNames = { skin: 'Skin simulada' };
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[aria-label="Ver detalhes de Skin simulada"]') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.querySelector('mat-icon')?.textContent?.trim()).toBe('visibility');
    expect(button.textContent).not.toContain('Detalhes');
    button.click();
  });

  it('renderiza cenários com liquidez média e baixa e margem indisponível', () => {
    TestBed.configureTestingModule({ imports: [OpportunityTableComponent] });
    const fixture = TestBed.createComponent(OpportunityTableComponent);
    fixture.componentInstance.scenarios = [
      { ...scenario('valid'), direction: 'steam-to-csfloat', liquidityCategory: 'medium', marginPercent: '' },
      { ...scenario('incomplete'), liquidityCategory: 'low' },
    ];
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Média');
    expect(text).toContain('Baixa');
    expect(text).toContain('Indisponível');
  });
});
