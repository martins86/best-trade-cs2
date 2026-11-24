import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { AppShellComponent } from './app-shell.component';

@Component({ standalone: true, template: '' })
class TestRouteComponent {}

describe('AppShellComponent', () => {
  it('exibe a marca Best Trade CS2', () => {
    TestBed.configureTestingModule({ imports: [AppShellComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Best Trade CS2');
    expect(fixture.nativeElement.textContent).not.toContain('CS2 Market');
  });

  it('separa destinos disponíveis e futuros', () => {
    TestBed.configureTestingModule({ imports: [AppShellComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AppShellComponent);
    const component = fixture.componentInstance;

    expect(component.marketDestinations.find(item => item.id === 'opportunities')?.available).toBe(true);
    expect(component.marketDestinations.filter(item => !item.available).map(item => item.label)).toEqual(['Inventário', 'Histórico']);
  });

  it('fecha a navegação apenas no modo móvel', () => {
    TestBed.configureTestingModule({ imports: [AppShellComponent], providers: [provideRouter([])] });
    const component = TestBed.createComponent(AppShellComponent).componentInstance;
    const close = vi.fn();

    component.closeOnMobile({ close });
    expect(close).not.toHaveBeenCalled();

    component.layout.isMobile.set(true);
    component.closeOnMobile({ close });
    expect(close).toHaveBeenCalledOnce();
  });

  it('mostra o menu móvel, fecha após navegação e alterna o tema', async () => {
    localStorage.removeItem('cs2mm-theme');
    TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [provideRouter([{ path: 'opportunities', component: TestRouteComponent }])],
    });
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.componentInstance.layout.isMobile.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[aria-label="Abrir navegação"]')).not.toBeNull();
    fixture.nativeElement.querySelector('a[mat-list-item]').click();
    await fixture.whenStable();

    const themeButton = fixture.nativeElement.querySelector('button[aria-label="Ativar tema claro"]') as HTMLButtonElement;
    themeButton.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[aria-label="Ativar tema escuro"]')).not.toBeNull();
  });
});
