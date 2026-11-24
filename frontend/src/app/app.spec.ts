import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { appConfig } from './app.config';
import { routes } from './app.routes';
import { App } from './app';

describe('application wiring', () => {
  it('configures browser error listeners and routing', () => {
    expect(appConfig.providers).toHaveLength(2);
  });

  it('redirects the root and unknown paths to opportunities', async () => {
    expect(routes[0]).toMatchObject({ path: '', redirectTo: 'opportunities', pathMatch: 'full' });
    expect(routes.at(-1)).toMatchObject({ path: '**', redirectTo: 'opportunities' });

    const listRoute = routes.find(route => route.path === 'opportunities');
    const detailRoute = routes.find(route => route.path === 'opportunities/:skinId');
    expect(await listRoute?.loadComponent?.()).toBeTruthy();
    expect(await detailRoute?.loadComponent?.()).toBeTruthy();
  });

  it('renders the root shell', () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-shell')).not.toBeNull();
  });
});
