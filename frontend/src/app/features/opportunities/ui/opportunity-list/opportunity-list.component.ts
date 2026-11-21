import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import Decimal from 'decimal.js';
import { PriceReference } from '../../domain/price-reference.model';
import { OpportunityScenario } from '../../domain/opportunity-scenario.model';
import { roundMoney } from '../../domain/opportunity-calculator';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (scenarios.length === 0) {
      <section class="empty-state" role="status"><h2>Nenhum resultado correspondente</h2><p>Os filtros não encontraram cenários simulados disponíveis.</p><button type="button" (click)="clear.emit()">Limpar filtros</button></section>
    } @else {
      <section class="opportunity-grid" aria-label="Lista de oportunidades simuladas">
        @for (scenario of scenarios; track scenario.direction + scenario.skinIdentityId) {
          <article class="opportunity-card">
            <div class="card-heading"><div><p class="market-label">{{ marketLabel(scenario.direction) }}</p><h2>{{ skinNames[scenario.skinIdentityId] }}</h2></div><span class="liquidity" [attr.data-level]="scenario.liquidityCategory">Liquidez {{ liquidityLabel(scenario.liquidityCategory) }}</span></div>
            @if (scenario.status === 'valid') {
              <dl><div><dt>Custo de aquisição</dt><dd>R$ {{ round(scenario.costBasisBrl) }}</dd></div><div><dt>Resultado estimado</dt><dd [class.nonprofit]="newDecimal(scenario.netResultBrl).lte(0)">R$ {{ round(scenario.netResultBrl) }}</dd></div><div><dt>Margem</dt><dd [class.nonprofit]="newDecimal(scenario.marginPercent).lte(0)">{{ scenario.marginPercent ? round(scenario.marginPercent) + '%' : 'Não disponível' }}</dd></div></dl>
              @if (newDecimal(scenario.netResultBrl).lte(0)) { <p class="result-status">Não lucrativo</p> }
              @if (scenario.proceedsKind === 'steam-wallet-credit') { <p class="steam-note">Saldo da carteira Steam, não sacável</p> }
              <a class="detail-link" [routerLink]="['/opportunities', scenario.skinIdentityId]" [queryParams]="{ direction: scenario.direction }">Ver comparação</a>
            } @else {
              <p class="unavailable" role="status">Dados {{ scenario.status === 'stale' ? 'desatualizados' : 'incompletos' }}: comparação indisponível.</p>
            }
            <p class="source">Dados simulados · referência {{ scenario.dataReferenceTime }}</p>
          </article>
        }
      </section>
    }
  `,
  styleUrl: './opportunity-list.component.scss',
})
export class OpportunityListComponent {
  @Input() scenarios: OpportunityScenario[] = [];
  @Input() skinNames: Record<string, string> = {};
  @Input() references: PriceReference[] = [];
  @Output() clear = new EventEmitter<void>();
  round(value: string): string { return roundMoney(new Decimal(value)); }
  newDecimal(value: string): Decimal { return new Decimal(value || 0); }
  marketLabel(direction: string): string { return direction === 'steam-to-csfloat' ? 'Steam → CSFloat' : 'CSFloat → Steam'; }
  liquidityLabel(category: string): string { return category === 'high' ? 'alta' : category === 'medium' ? 'média' : 'baixa'; }
}
