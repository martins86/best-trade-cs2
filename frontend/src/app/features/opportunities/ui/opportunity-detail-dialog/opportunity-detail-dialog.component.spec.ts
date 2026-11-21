import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { describe, expect, it, vi } from 'vitest';
import { OpportunityDetailDialogComponent } from './opportunity-detail-dialog.component';

describe('OpportunityDetailDialogComponent', () => {
  it('fecha pelo controle e mantém contexto da comparação', () => {
    const close = vi.fn();
    TestBed.configureTestingModule({
      imports: [OpportunityDetailDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: {
          scenario: { direction: 'csfloat-to-steam', status: 'valid', proceedsKind: 'steam-wallet-credit' },
          buy: { marketplace: 'csfloat', currency: 'USD', fees: [] },
          sell: { marketplace: 'steam', currency: 'BRL', fees: [] },
          skinName: 'AK-47 simulada',
        } },
      ],
    });

    const fixture = TestBed.createComponent(OpportunityDetailDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.data.skinName).toBe('AK-47 simulada');
    expect(component.data.scenario.direction).toBe('csfloat-to-steam');
    expect(fixture.nativeElement.querySelector('button[aria-label="Fechar detalhes"]')).not.toBeNull();
    component.close();
    expect(close).toHaveBeenCalledOnce();
  });

  it('preserva o sentido Steam → CSFloat e o proceeds em dinheiro', () => {
    TestBed.configureTestingModule({
      imports: [OpportunityDetailDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: {
          scenario: { direction: 'steam-to-csfloat', status: 'valid', proceedsKind: 'cash' },
          buy: { marketplace: 'steam', currency: 'BRL', fees: [] },
          sell: { marketplace: 'csfloat', currency: 'USD', fees: [] },
          skinName: 'AWP simulada',
        } },
      ],
    });
    const fixture = TestBed.createComponent(OpportunityDetailDialogComponent);

    expect(fixture.componentInstance.data.scenario.direction).toBe('steam-to-csfloat');
    expect(fixture.componentInstance.data.scenario.proceedsKind).toBe('cash');
  });
});
