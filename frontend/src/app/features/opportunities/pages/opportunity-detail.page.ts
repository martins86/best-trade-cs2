import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OpportunityMockRepository } from '../data/opportunity-mock.repository';
import { isReferenceValid, getLiquidity } from '../domain/opportunity-builder';
import { calculateOpportunity } from '../domain/opportunity-calculator';
import { OpportunityComparisonComponent } from '../ui/opportunity-comparison/opportunity-comparison.component';
import { OpportunityScenario } from '../domain/opportunity-scenario.model';
import { PriceReference } from '../domain/price-reference.model';

@Component({
  selector: 'app-opportunity-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, OpportunityComparisonComponent],
  template: `
    <main class="detail-shell">
      <a class="back-link" routerLink="/opportunities">← Voltar às oportunidades</a>
      <p class="eyebrow">Comparação simulada</p>
      <h1>{{ skinName }}</h1>
      <app-opportunity-comparison [scenario]="scenario" [buy]="buy" [sell]="sell" />
    </main>
  `,
  styleUrl: './opportunity-detail.page.scss',
})
export class OpportunityDetailPage {
  private route = inject(ActivatedRoute);
  private repository = new OpportunityMockRepository();
  readonly skinId = this.route.snapshot.paramMap.get('skinId') ?? '';
  readonly direction = this.route.snapshot.queryParamMap.get('direction') ?? 'steam-to-csfloat';
  readonly skin = this.repository.getSkins().find(item => item.id === this.skinId);
  readonly skinName = this.skin?.marketHashName ?? 'Skin simulada';
  private refs = this.repository.getReferences().filter(reference => reference.skinIdentityId === this.skinId);
  readonly buy: PriceReference | null = this.direction === 'csfloat-to-steam' ? this.refs.find(reference => reference.marketplace === 'csfloat') ?? null : this.refs.find(reference => reference.marketplace === 'steam') ?? null;
  readonly sell: PriceReference | null = this.direction === 'csfloat-to-steam' ? this.refs.find(reference => reference.marketplace === 'steam') ?? null : this.refs.find(reference => reference.marketplace === 'csfloat') ?? null;
  readonly scenario: OpportunityScenario | null = this.buildScenario();

  private buildScenario(): OpportunityScenario | null {
    if (!this.buy || !this.sell) return null;
    const referenceTime = this.repository.getReferenceTime();
    const quote = this.repository.getFxQuotes()[0];
    if (!isReferenceValid(this.buy, referenceTime) || !isReferenceValid(this.sell, referenceTime)) return null;
    const calculated = calculateOpportunity(this.buy, this.sell, quote);
    return { skinIdentityId: this.skinId, direction: this.direction as OpportunityScenario['direction'], buyReferenceId: this.buy.id, sellReferenceId: this.sell.id, status: 'valid', liquidityCategory: getLiquidity(this.buy), costBasisBrl: calculated.costBasisBrl.toString(), netProceedsBrl: calculated.netProceedsBrl.toString(), netResultBrl: calculated.netResultBrl.toString(), marginPercent: calculated.marginPercent?.toString() ?? '', proceedsKind: this.sell.marketplace === 'steam' ? 'steam-wallet-credit' : 'cash', dataReferenceTime: referenceTime };
  }
}
