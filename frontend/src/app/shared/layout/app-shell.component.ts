import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutStateService } from './layout-state.service';
import { ThemeService } from '../../core/theme/theme.service';
import { NavigationDestination } from './layout.types';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav #sidenav [mode]="layout.isMobile() ? 'over' : 'side'" [opened]="!layout.isMobile()" [class.compact]="layout.isCompact()" class="sidebar">
        <div class="brand"><span class="brand-mark">B</span><div><strong>Best Trade CS2</strong><small>MARKET INTELLIGENCE</small></div></div>
        <nav aria-label="Mercado">
          <p class="nav-label">MERCADO</p>
          <mat-nav-list>
            @for (destination of marketDestinations; track destination.id) {
              @if (destination.available) {
                <a mat-list-item [routerLink]="destination.route" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeOnMobile(sidenav)"><mat-icon>{{ destination.icon }}</mat-icon><span>{{ destination.label }}</span></a>
              } @else {
                <button mat-list-item disabled><mat-icon>{{ destination.icon }}</mat-icon><span>{{ destination.label }}</span><small>Futuro</small></button>
              }
            }
          </mat-nav-list>
        </nav>
        <div class="sidebar-bottom"><span class="status-dot"></span> Dados demonstrativos</div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="topbar">
          @if (layout.isMobile()) { <button mat-icon-button type="button" aria-label="Abrir navegação" (click)="sidenav.toggle()"><mat-icon>menu</mat-icon></button> }
          <div class="breadcrumb"><span>Mercado</span><strong>Oportunidades</strong></div>
          <span class="toolbar-spacer"></span>
          <button mat-icon-button type="button" [attr.aria-label]="theme.theme() === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'" (click)="theme.toggle()"><mat-icon>{{ theme.theme() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon></button>
        </mat-toolbar>
        <main class="content"><router-outlet /></main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  readonly layout = inject(LayoutStateService);
  readonly theme = inject(ThemeService);
  readonly marketDestinations: NavigationDestination[] = [
    { id: 'opportunities', label: 'Oportunidades', route: '/opportunities', available: true, icon: 'trending_up' },
    { id: 'inventory', label: 'Inventário', route: null, available: false, icon: 'inventory_2' },
    { id: 'history', label: 'Histórico', route: null, available: false, icon: 'history' },
  ];

  closeOnMobile(sidenav: { close(): void }): void {
    if (this.layout.isMobile()) sidenav.close();
  }
}
