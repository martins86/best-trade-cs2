import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { AppShellComponent } from './app-shell.component';

describe('AppShellComponent', () => {
  it('separa destinos disponíveis e futuros', () => {
    TestBed.configureTestingModule({ imports: [AppShellComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AppShellComponent);
    const component = fixture.componentInstance;

    expect(component.marketDestinations.find(item => item.id === 'opportunities')?.available).toBe(true);
    expect(component.marketDestinations.filter(item => !item.available).map(item => item.label)).toEqual(['Inventário', 'Histórico']);
  });
});
