import { describe, expect, it } from 'vitest';
import { areEquivalent, isReferenceValid, normalizeFloat } from './opportunity-builder';
import { SkinIdentity } from './skin-identity.model';

const base: SkinIdentity = { id: 'a', marketHashName: 'AK', category: null, wear: 'Field-Tested', statTrak: false, souvenir: false, floatValue: '0.1200', paintSeed: 10, stickers: [{ name: 'A', slot: 1 }, { name: 'B', slot: null }], specialAttributes: [['pattern', 'x']] };

describe('opportunity builder', () => {
  it('normaliza zeros finais do float', () => expect(normalizeFloat('0.1200')).toBe(normalizeFloat('0.12')));
  it('compara floats e stickers independentemente da ordem', () => {
    const same = { ...base, floatValue: '0.12', stickers: [{ name: 'B', slot: null }, { name: 'A', slot: 1 }] };
    expect(areEquivalent(base, same)).toBe(true);
  });
  it('rejeita floats divergentes', () => expect(areEquivalent(base, { ...base, floatValue: '0.121' })).toBe(false));
  it('marca referências mais antigas que 24 horas', () => {
    expect(isReferenceValid({ id: 'x', skinIdentityId: 'a', marketplace: 'steam', price: '100', currency: 'BRL', collectedAt: '2026-01-14T11:00:00Z', volume24h: null, salesFrequency: null, spreadPercent: null, activeListings: null, fees: [] }, '2026-01-15T12:00:00Z')).toBe(false);
  });
});
