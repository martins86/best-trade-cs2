import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  it('usa dark por fallback e persiste preferência válida', () => {
    localStorage.removeItem('cs2mm-theme');
    TestBed.configureTestingModule({ providers: [ThemeService] });
    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(localStorage.getItem('cs2mm-theme')).toBe('light');
  });

  it('ignora valor armazenado inválido', () => {
    localStorage.setItem('cs2mm-theme', 'sepia');
    TestBed.configureTestingModule({ providers: [ThemeService] });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('restaura tema claro salvo e alterna de volta para escuro', () => {
    localStorage.setItem('cs2mm-theme', 'light');
    TestBed.configureTestingModule({ providers: [ThemeService] });
    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    service.toggle();

    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('cs2mm-theme')).toBe('dark');
  });
});
