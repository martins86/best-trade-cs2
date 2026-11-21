import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import Decimal from 'decimal.js';
import { OpportunityScenario } from '../../domain/opportunity-scenario.model';
import { roundMoney } from '../../domain/opportunity-calculator';

@Component({
  selector: 'app-opportunity-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    @if (scenarios.length === 0) {
      <section class="empty-state" role="status"><h2>Nenhum resultado correspondente</h2><p>Os filtros não encontraram cenários simulados disponíveis.</p><button mat-flat-button type="button" (click)="clear.emit()">Limpar filtros</button></section>
    } @else {
      <section class="table-card" aria-label="Oportunidades simuladas">
        <div class="table-toolbar"><div><h2>Melhores oportunidades</h2><p>Dados demonstrativos · horário fictício {{ referenceTime }}</p></div></div>
        <div class="table-scroll">
          <table mat-table [dataSource]="scenarios">
            <ng-container matColumnDef="skin"><th mat-header-cell *matHeaderCellDef>Skin</th><td mat-cell *matCellDef="let row"><strong>{{ skinNames[row.skinIdentityId] }}</strong><small>Dados simulados</small></td></ng-container>
            <ng-container matColumnDef="direction"><th mat-header-cell *matHeaderCellDef>Direção</th><td mat-cell *matCellDef="let row">{{ directionLabel(row.direction) }}</td></ng-container>
            <ng-container matColumnDef="cost"><th mat-header-cell *matHeaderCellDef>Compra</th><td mat-cell *matCellDef="let row">{{ row.status === 'valid' ? 'R$ ' + money(row.costBasisBrl) : 'Indisponível' }}</td></ng-container>
            <ng-container matColumnDef="proceeds"><th mat-header-cell *matHeaderCellDef>Venda</th><td mat-cell *matCellDef="let row">{{ row.status === 'valid' ? 'R$ ' + money(row.netProceedsBrl) : 'Indisponível' }}</td></ng-container>
            <ng-container matColumnDef="result"><th mat-header-cell *matHeaderCellDef>Resultado líquido</th><td mat-cell *matCellDef="let row"><span [class.negative]="row.status === 'valid' && decimal(row.netResultBrl).lte(0)">{{ row.status === 'valid' ? (decimal(row.netResultBrl).gte(0) ? '+ ' : '− ') + 'R$ ' + money(abs(row.netResultBrl)) : row.status }}</span></td></ng-container>
            <ng-container matColumnDef="margin"><th mat-header-cell *matHeaderCellDef>Margem</th><td mat-cell *matCellDef="let row">{{ row.status === 'valid' && row.marginPercent ? money(row.marginPercent) + '%' : 'Indisponível' }}</td></ng-container>
            <ng-container matColumnDef="liquidity"><th mat-header-cell *matHeaderCellDef>Liquidez</th><td mat-cell *matCellDef="let row"><span class="liquidity" [attr.data-level]="row.liquidityCategory">{{ liquidityLabel(row.liquidityCategory) }}</span></td></ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let row"><button *ngIf="row.status === 'valid'" mat-icon-button type="button" [attr.aria-label]="detailLabel(row)" (click)="openDetail(row)"><mat-icon>visibility</mat-icon></button><span *ngIf="row.status !== 'valid'" class="unavailable">{{ statusLabel(row.status) }}</span></td></ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>
      </section>
    }
  `,
  styleUrl: './opportunity-table.component.scss',
})
export class OpportunityTableComponent {
  @Input() scenarios: OpportunityScenario[] = [];
  @Input() skinNames: Record<string, string> = {};
  @Input() referenceTime = '';
  @Output() clear = new EventEmitter<void>();
  @Output() detail = new EventEmitter<OpportunityScenario>();
  readonly displayedColumns = ['skin', 'direction', 'cost', 'proceeds', 'result', 'margin', 'liquidity', 'actions'];
  decimal(value: string): Decimal { return new Decimal(value || 0); }
  abs(value: string): string { return new Decimal(value || 0).abs().toString(); }
  money(value: string): string { return roundMoney(new Decimal(value || 0)); }
  directionLabel(direction: string): string { return direction === 'steam-to-csfloat' ? 'Steam → CSFloat' : 'CSFloat → Steam'; }
  liquidityLabel(category: string): string { return category === 'high' ? 'Alta' : category === 'medium' ? 'Média' : 'Baixa'; }
  statusLabel(status: string): string { return status === 'stale' ? 'Desatualizada' : status === 'not-equivalent' ? 'Não equivalente' : 'Incompleta'; }
  detailLabel(row: OpportunityScenario): string { return `Ver detalhes de ${this.skinNames[row.skinIdentityId] || 'skin simulada'}`; }
  openDetail(row: OpportunityScenario): void { if (row.status === 'valid') this.detail.emit(row); }
}
