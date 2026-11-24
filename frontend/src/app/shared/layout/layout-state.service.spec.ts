import { TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { LayoutStateService } from './layout-state.service';

describe('LayoutStateService', () => {
  it('updates mobile and compact state from their breakpoints', () => {
    const observe = vi.fn((query: string) => of({ matches: query.includes('600px') }));
    TestBed.configureTestingModule({
      providers: [{ provide: BreakpointObserver, useValue: { observe } }],
    });

    const service = TestBed.inject(LayoutStateService);

    expect(service.isMobile()).toBe(true);
    expect(service.isCompact()).toBe(false);
    expect(observe).toHaveBeenCalledTimes(2);
  });
});
