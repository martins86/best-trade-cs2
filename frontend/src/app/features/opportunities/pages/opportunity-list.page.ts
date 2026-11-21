import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Decimal from 'decimal.js';
import { OpportunityMockRepository } from '../data/opportunity-mock.repository';
import { areEquivalent, isReferenceValid, getLiquidity } from '../domain/opportunity-builder';
import { calculateOpportunity, roundMoney } from '../domain/opportunity-calculator';
import { OpportunityScenario } from '../domain/opportunity-scenario.model';
import { Direction, LiquidityCategory } from '../domain/opportunity-types';
import { filterOpportunities, OpportunityFilter } from '../domain/opportunity-filters';
import { OpportunityTableComponent } from '../ui/opportunity-table/opportunity-table.component';
import { DashboardIndicator, OpportunityIndicatorsComponent } from '../ui/opportunity-indicators/opportunity-indicators.component';
import { OpportunityDetailDialogComponent } from '../ui/opportunity-detail-dialog/opportunity-detail-dialog.component';

@Component({
  selector: 'app-opportunity-list-page',
  standalone: true,
  imports: [CommonModule, MatDialogModule, OpportunityTableComponent, OpportunityIndicatorsComponent],
  template: `
    <main class="page-shell">
      <header class="topbar">
        <div><p class="eyebrow">Best Trade CS2</p><h1>Oportunidades simuladas</h1></div>
        <span class="simulation-badge">Dados fictícios</span>
      </header>
      <section class="filters" aria-label="Filtros de oportunidades">
        <label>Buscar skin<input type="search" [value]="filter().search" (input)="updateSearch($event)" placeholder="Nome da skin" /></label>
        <label>Direção<select [value]="filter().direction ?? ''" (change)="updateDirection($event)"><option value="">Todos</option><option value="steam-to-csfloat">Steam → CSFloat</option><option value="csfloat-to-steam">CSFloat → Steam</option></select></label>
        <label>Liquidez mínima<select [value]="filter().liquidityMin ?? ''" (change)="updateLiquidity($event)"><option value="">Todas</option><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></label>
        <label>Margem mínima (%)<input type="number" [value]="filter().marginMin ?? ''" (input)="updateMargin($event)" /></label>
        <label>Custo mínimo (R$)<input type="number" [value]="filter().costMin ?? ''" (input)="updateCostMin($event)" /></label>
        <label>Custo máximo (R$)<input type="number" [value]="filter().costMax ?? ''" (input)="updateCostMax($event)" /></label>
        <label>Ordenar<select [value]="sortMode()" (change)="updateSort($event)"><option value="liquidity">Liquidez</option><option value="margin">Margem</option><option value="result">Resultado</option></select></label>
        <button type="button" class="clear-button" (click)="clearFilters()">Limpar filtros</button>
      </section>
      @if (rangeInvalid()) { <p class="range-error" role="alert">Custo mínimo não pode ser maior que o custo máximo.</p> }
      <p class="dataset-time">Horário fictício de referência: {{ referenceTime }}</p>
      <app-opportunity-indicators [indicators]="indicators()" />
      <app-opportunity-table [scenarios]="visibleScenarios()" [skinNames]="skinNames" [referenceTime]="referenceTime" (clear)="clearFilters()" (detail)="openDetail($event)" />
    </main>
  `,
  styleUrl: './opportunity-list.page.scss',
})
export class OpportunityListPage {
  private dialog = inject(MatDialog);
  private repository = new OpportunityMockRepository();
  readonly referenceTime = this.repository.getReferenceTime();
  readonly skins = this.repository.getSkins();
  readonly references = this.repository.getReferences();
  readonly skinNames = Object.fromEntries(this.skins.map(skin => [skin.id, skin.marketHashName]));
  readonly scenarios = this.buildScenarios();
  readonly filter = signal<OpportunityFilter>({ search: '', costMin: null, costMax: null, marginMin: null, liquidityMin: null, direction: null });
  readonly sortMode = signal<'liquidity' | 'margin' | 'result'>('liquidity');
  readonly rangeInvalid = computed(() => {
    const current = this.filter();
    return current.costMin !== null && current.costMax !== null && current.costMin > current.costMax;
  });
  readonly visibleScenarios = computed(() => {
    const filtered = filterOpportunities(this.scenarios, this.filter(), this.skinNames);
    const rank = { low: 0, medium: 1, high: 2 };
    return [...filtered].sort((a, b) => {
      if (a.direction !== b.direction) return a.direction.localeCompare(b.direction);
      if (this.sortMode() === 'liquidity') return rank[b.liquidityCategory] - rank[a.liquidityCategory];
      if (this.sortMode() === 'margin') return new Decimal(b.marginPercent || 0).minus(a.marginPercent || 0).toNumber();
      return new Decimal(b.netResultBrl || 0).minus(a.netResultBrl || 0).toNumber();
    });
  });
  readonly indicators = computed<DashboardIndicator[]>(() => {
    const valid = this.visibleScenarios().filter(item => item.status === 'valid');
    const profitable = valid.filter(item => new Decimal(item.netResultBrl).gt(0)).length;
    const highLiquidity = valid.filter(item => item.liquidityCategory === 'high').length;
    const margins = valid.map(item => new Decimal(item.marginPercent || 0));
    const averageMargin = margins.length ? margins.reduce((sum, value) => sum.plus(value), new Decimal(0)).div(margins.length) : new Decimal(0);
    return [
      { id: 'valid', label: 'Cenários disponíveis', value: String(valid.length), detail: 'Dados locais simulados', tone: 'neutral' },
      { id: 'profitable', label: 'Cenários lucrativos', value: String(profitable), detail: 'Entre os resultados filtrados', tone: 'positive' },
      { id: 'margin', label: 'Margem média', value: `${averageMargin.toDecimalPlaces(2).toFixed(2)}%`, detail: 'Média dos cenários válidos', tone: 'neutral' },
      { id: 'liquidity', label: 'Alta liquidez', value: String(highLiquidity), detail: 'Categoria simulada alta', tone: 'positive' },
    ];
  });

  private buildScenarios(): OpportunityScenario[] {
    const output: OpportunityScenario[] = [];
    const quote = this.repository.getFxQuotes()[0];
    for (const skin of this.skins) {
      const pair = this.references.filter(reference => reference.skinIdentityId === skin.id);
      const steam = pair.find(reference => reference.marketplace === 'steam');
      const csfloat = pair.find(reference => reference.marketplace === 'csfloat');
      if (!steam || !csfloat) {
        if (csfloat) output.push({ skinIdentityId: skin.id, direction: 'steam-to-csfloat', buyReferenceId: csfloat.id, sellReferenceId: csfloat.id, status: isReferenceValid(csfloat, this.referenceTime) ? 'incomplete' : 'stale', liquidityCategory: 'low', costBasisBrl: '', netProceedsBrl: '', netResultBrl: '', marginPercent: '', proceedsKind: 'cash', dataReferenceTime: this.referenceTime });
        continue;
      }
      if (!areEquivalent(skin, skin)) continue;
      const directions: Array<[Direction, typeof steam, typeof csfloat, 'cash' | 'steam-wallet-credit']> = [
        ['steam-to-csfloat', steam, csfloat, 'cash'],
        ['csfloat-to-steam', csfloat, steam, 'steam-wallet-credit'],
      ];
      for (const [direction, buy, sell, proceedsKind] of directions) {
        if (!isReferenceValid(buy, this.referenceTime) || !isReferenceValid(sell, this.referenceTime)) {
          output.push({ skinIdentityId: skin.id, direction, buyReferenceId: buy.id, sellReferenceId: sell.id, status: 'stale', liquidityCategory: getLiquidity(buy), costBasisBrl: '', netProceedsBrl: '', netResultBrl: '', marginPercent: '', proceedsKind, dataReferenceTime: this.referenceTime });
          continue;
        }
        const calculated = calculateOpportunity(buy, sell, quote);
        output.push({ skinIdentityId: skin.id, direction, buyReferenceId: buy.id, sellReferenceId: sell.id, status: 'valid', liquidityCategory: getLiquidity(buy), costBasisBrl: calculated.costBasisBrl.toString(), netProceedsBrl: calculated.netProceedsBrl.toString(), netResultBrl: calculated.netResultBrl.toString(), marginPercent: calculated.marginPercent?.toString() ?? '', proceedsKind, dataReferenceTime: this.referenceTime });
      }
    }
    return output;
  }

  updateSearch(event: Event): void { this.filter.update(value => ({ ...value, search: (event.target as HTMLInputElement).value })); }
  updateDirection(event: Event): void { const value = (event.target as HTMLSelectElement).value; this.filter.update(current => ({ ...current, direction: value ? value as Direction : null })); }
  updateLiquidity(event: Event): void { const value = (event.target as HTMLSelectElement).value; this.filter.update(current => ({ ...current, liquidityMin: value ? value as LiquidityCategory : null })); }
  updateMargin(event: Event): void { const value = (event.target as HTMLInputElement).value; this.filter.update(current => ({ ...current, marginMin: value === '' ? null : Number(value) })); }
  updateCostMin(event: Event): void { const value = (event.target as HTMLInputElement).value; this.filter.update(current => ({ ...current, costMin: value === '' ? null : Number(value) })); }
  updateCostMax(event: Event): void { const value = (event.target as HTMLInputElement).value; this.filter.update(current => ({ ...current, costMax: value === '' ? null : Number(value) })); }
  updateSort(event: Event): void { this.sortMode.set((event.target as HTMLSelectElement).value as 'liquidity' | 'margin' | 'result'); }
  clearFilters(): void { this.filter.set({ search: '', costMin: null, costMax: null, marginMin: null, liquidityMin: null, direction: null }); this.sortMode.set('liquidity'); }

  openDetail(scenario: OpportunityScenario): void {
    if (scenario.status !== 'valid') return;
    const buy = this.repository.getReferences().find(reference => reference.id === scenario.buyReferenceId);
    const sell = this.repository.getReferences().find(reference => reference.id === scenario.sellReferenceId);
    if (!buy || !sell) return;

    this.dialog.open(OpportunityDetailDialogComponent, {
      data: {
        scenario,
        buy,
        sell,
        skinName: this.skinNames[scenario.skinIdentityId] || 'Skin simulada',
      },
      width: 'min(920px, calc(100vw - 32px))',
      maxWidth: '920px',
      maxHeight: 'calc(100vh - 32px)',
      panelClass: 'opportunity-detail-dialog-panel',
      disableClose: false,
      autoFocus: 'dialog',
      restoreFocus: true,
      backdropClass: 'opportunity-detail-backdrop',
    });
  }
}
