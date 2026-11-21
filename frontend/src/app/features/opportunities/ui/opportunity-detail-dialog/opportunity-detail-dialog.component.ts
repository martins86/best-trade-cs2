import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OpportunityComparisonComponent } from '../opportunity-comparison/opportunity-comparison.component';
import { OpportunityScenario } from '../../domain/opportunity-scenario.model';
import { PriceReference } from '../../domain/price-reference.model';

export interface OpportunityDetailDialogContext {
  scenario: OpportunityScenario;
  buy: PriceReference;
  sell: PriceReference;
  skinName: string;
}

@Component({
  selector: 'app-opportunity-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, OpportunityComparisonComponent],
  template: `
    <header class="dialog-header">
      <div>
        <p>Comparação simulada</p>
        <h2 mat-dialog-title>{{ data.skinName }}</h2>
      </div>
      <button mat-icon-button type="button" aria-label="Fechar detalhes" (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
    </header>
    <mat-dialog-content>
      <app-opportunity-comparison [scenario]="data.scenario" [buy]="data.buy" [sell]="data.sell" />
    </mat-dialog-content>
  `,
  styleUrl: './opportunity-detail-dialog.component.scss',
})
export class OpportunityDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OpportunityDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OpportunityDetailDialogContext,
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
