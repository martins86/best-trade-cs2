import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityMockRepository } from '../data/opportunity-mock.repository';
import { areEquivalent, isReferenceValid, getLiquidity } from '../domain/opportunity-builder';
import { calculateOpportunity, roundMoney } from '../domain/opportunity-calculator';
import { OpportunityScenario } from '../domain/opportunity-scenario.model';
import { Direction, LiquidityCategory } from '../domain/opportunity-types';
import { filterOpportunities, OpportunityFilter } from '../domain/opportunity-filters';
import { OpportunityListComponent } from '../ui/opportunity-list/opportunity-list.component';

@Component({
  selector: 'app-opportunity-list-page',
  standalone: true,
  imports: [CommonModule, OpportunityListComponent],
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
        <button type="button" class="clear-button" (click)="clearFilters()">Limpar filtros</button>
      </section>
      <p class="dataset-time">Horário fictício de referência: {{ referenceTime }}</p>
      <app-opportunity-list [scenarios]="visibleScenarios()" [skinNames]="skinNames" [references]="references" (clear)="clearFilters()" />
    </main>
  `,
  styleUrl: './opportunity-list.page.scss',
})
export class OpportunityListPage {
  private repository = new OpportunityMockRepository();
  readonly referenceTime = this.repository.getReferenceTime();
  readonly skins = this.repository.getSkins();
  readonly references = this.repository.getReferences();
  readonly skinNames = Object.fromEntries(this.skins.map(skin => [skin.id, skin.marketHashName]));
  readonly scenarios = this.buildScenarios();
  readonly filter = signal<OpportunityFilter>({ search: '', costMin: null, costMax: null, marginMin: null, liquidityMin: null, direction: null });
  readonly visibleScenarios = computed(() => filterOpportunities(this.scenarios, this.filter(), this.skinNames));

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
  clearFilters(): void { this.filter.set({ search: '', costMin: null, costMax: null, marginMin: null, liquidityMin: null, direction: null }); }
}
