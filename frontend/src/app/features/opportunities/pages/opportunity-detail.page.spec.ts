import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { OpportunityDetailPage } from './opportunity-detail.page';

describe('OpportunityDetailPage', () => {
  it('preserva o sentido CSFloat → Steam como crédito Steam', () => {
    TestBed.configureTestingModule({
      imports: [OpportunityDetailPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ skinId: 'skin-awp' }), queryParamMap: convertToParamMap({ direction: 'csfloat-to-steam' }) } } }
      ]
    });
    const fixture = TestBed.createComponent(OpportunityDetailPage);
    const component = fixture.componentInstance;

    expect(component.direction).toBe('csfloat-to-steam');
    expect(component.scenario?.proceedsKind).toBe('steam-wallet-credit');
  });
});
