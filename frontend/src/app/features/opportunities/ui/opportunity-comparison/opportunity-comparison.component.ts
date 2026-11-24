import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import Decimal from 'decimal.js';
import { roundMoney } from '../../domain/opportunity-calculator';
import { OpportunityScenario } from '../../domain/opportunity-scenario.model';
import { PriceReference } from '../../domain/price-reference.model';

@Component({
  selector: 'app-opportunity-comparison',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="comparison" *ngIf="scenario && buy && sell">
      <p class="direction">{{ scenario.direction === 'steam-to-csfloat' ? 'Steam → CSFloat' : 'CSFloat → Steam' }}</p>
      <div class="two-columns">
        <section><h2>Compra</h2><p>{{ buy.marketplace }} · {{ buy.currency }}</p><strong>{{ buy.currency === 'BRL' ? 'R$' : '$' }} {{ buy.price }}</strong><p>Taxas/custos simulados</p><ul><li *ngFor="let fee of buy.fees">{{ fee.label }}: {{ fee.amount }} {{ fee.currency }}</li><li *ngIf="buy.fees.length === 0">Nenhum custo informado</li></ul></section>
        <section><h2>Venda</h2><p>{{ sell.marketplace }} · {{ sell.currency }}</p><strong>{{ sell.currency === 'BRL' ? 'R$' : '$' }} {{ sell.price }}</strong><p>Taxas/custos simulados</p><ul><li *ngFor="let fee of sell.fees">{{ fee.label }}: {{ fee.amount }} {{ fee.currency }}</li><li *ngIf="sell.fees.length === 0">Nenhum custo informado</li></ul></section>
      </div>
      <dl><div><dt>Custo total de aquisição em BRL</dt><dd>R$ {{ round(scenario.costBasisBrl) }}</dd></div><div><dt>Valor líquido recebido em BRL</dt><dd>R$ {{ round(scenario.netProceedsBrl) }}</dd></div><div><dt>Resultado estimado</dt><dd>R$ {{ round(scenario.netResultBrl) }}</dd></div><div><dt>Margem</dt><dd>{{ round(scenario.marginPercent) }}%</dd></div></dl>
      @if (isNonProfitable(scenario)) {
        <p class="non-profitable" role="status"><strong>Resultado não lucrativo:</strong> estimativa igual a zero ou negativa.</p>
      }
      @if (scenario.proceedsKind === 'steam-wallet-credit') {
        <p class="nature"><strong>Saldo da carteira Steam:</strong> crédito não sacável, não é dinheiro disponível.</p>
      }
      @if (scenario.proceedsKind === 'cash') {
        <p class="nature"><strong>Valor recebido:</strong> estimativa em dinheiro de CSFloat, não representa uma operação executável.</p>
      }
      <p class="disclaimer">Dados simulados · cotação USD→BRL fictícia · {{ scenario.dataReferenceTime }}</p>
    </article>
  `,
  styleUrl: './opportunity-comparison.component.scss',
})
export class OpportunityComparisonComponent {
  @Input() scenario: OpportunityScenario | null = null;
  @Input() buy: PriceReference | null = null;
  @Input() sell: PriceReference | null = null;
  round(value: string): string { return roundMoney(new Decimal(value || 0)); }
  isNonProfitable(scenario: OpportunityScenario): boolean {
    return scenario.status === 'valid' && new Decimal(scenario.netResultBrl || 0).lte(0);
  }
}
