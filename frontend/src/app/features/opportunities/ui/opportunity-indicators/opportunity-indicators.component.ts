import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

export interface DashboardIndicator {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone?: 'positive' | 'negative' | 'neutral';
}

@Component({
  selector: 'app-opportunity-indicators',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <section class="metrics" aria-label="Resumo de oportunidades simuladas">
      @for (indicator of indicators; track indicator.id) {
        <mat-card>
          <p>{{ indicator.label }}</p>
          <strong [class.positive]="indicator.tone === 'positive'" [class.negative]="indicator.tone === 'negative'">{{ indicator.value }}</strong>
          <small>{{ indicator.detail }}</small>
        </mat-card>
      }
    </section>
  `,
  styleUrl: './opportunity-indicators.component.scss',
})
export class OpportunityIndicatorsComponent {
  @Input() indicators: DashboardIndicator[] = [];
}
