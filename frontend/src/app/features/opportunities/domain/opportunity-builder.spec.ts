import { describe, expect, it } from 'vitest';
import { areEquivalent, buildScenario, compareOptionalValues, getLiquidity, isReferenceValid, normalizeFloat } from './opportunity-builder';
import { SkinIdentity } from './skin-identity.model';
import { PriceReference } from './price-reference.model';

const base: SkinIdentity = { id: 'a', marketHashName: 'AK', category: null, wear: 'Field-Tested', statTrak: false, souvenir: false, floatValue: '0.1200', paintSeed: 10, stickers: [{ name: 'A', slot: 1 }, { name: 'B', slot: null }], specialAttributes: [['pattern', 'x']] };

describe('opportunity builder', () => {
  it('normaliza zeros finais do float', () => expect(normalizeFloat('0.1200')).toBe(normalizeFloat('0.12')));
  it('compara floats e stickers independentemente da ordem', () => {
    const same = { ...base, floatValue: '0.12', stickers: [{ name: 'B', slot: null }, { name: 'A', slot: 1 }] };
    expect(areEquivalent(base, same)).toBe(true);
  });
  it('compara valores opcionais incluindo nulos', () => {
    expect(compareOptionalValues(null, null)).toBe(true);
    expect(compareOptionalValues(null, 1)).toBe(false);
    expect(compareOptionalValues(1, 1)).toBe(true);
    expect(compareOptionalValues(1, 2)).toBe(false);
  });
  it('rejeita diferenças de identidade, float, stickers e atributos especiais', () => {
    expect(areEquivalent(base, { ...base, marketHashName: 'M4' })).toBe(false);
    expect(areEquivalent(base, { ...base, wear: 'Factory New' })).toBe(false);
    expect(areEquivalent(base, { ...base, statTrak: true })).toBe(false);
    expect(areEquivalent(base, { ...base, souvenir: true })).toBe(false);
    expect(areEquivalent(base, { ...base, floatValue: '0.121' })).toBe(false);
    expect(areEquivalent(base, { ...base, floatValue: null })).toBe(false);
    expect(areEquivalent(base, { ...base, paintSeed: 11 })).toBe(false);
    expect(areEquivalent(base, { ...base, stickers: null })).toBe(false);
    expect(areEquivalent(base, { ...base, stickers: [{ name: 'A', slot: 2 }] })).toBe(false);
    expect(areEquivalent(base, { ...base, specialAttributes: [['pattern', 'y']] })).toBe(false);
    expect(areEquivalent({ ...base, stickers: null }, { ...base, stickers: null })).toBe(true);
    expect(areEquivalent({ ...base, stickers: [] }, { ...base, stickers: null })).toBe(false);
    expect(areEquivalent({ ...base, stickers: null }, base)).toBe(false);
  });
  it('valida datas, preço positivo e janela de 24 horas', () => {
    const reference: PriceReference = {
      id: 'x', skinIdentityId: 'a', marketplace: 'steam', price: '100', currency: 'BRL',
      collectedAt: '2026-01-15T11:00:00Z', volume24h: null, salesFrequency: null,
      spreadPercent: null, activeListings: null, fees: [],
    };
    const now = '2026-01-15T12:00:00Z';
    expect(isReferenceValid(reference, now)).toBe(true);
    expect(isReferenceValid({ ...reference, collectedAt: 'invalid' }, now)).toBe(false);
    expect(isReferenceValid({ ...reference, collectedAt: '2026-01-15T13:00:00Z' }, now)).toBe(false);
    expect(isReferenceValid({ ...reference, price: '' }, now)).toBe(false);
    expect(isReferenceValid({ ...reference, price: '0' }, now)).toBe(false);
    expect(isReferenceValid({ ...reference, collectedAt: '2026-01-14T12:00:00Z' }, now)).toBe(true);
    expect(isReferenceValid({ ...reference, collectedAt: '2026-01-14T11:59:59Z' }, now)).toBe(false);
  });
  it('classifica liquidez e cria cenário com o tipo de recebimento da venda', () => {
    const reference: PriceReference = {
      id: 'x', skinIdentityId: 'a', marketplace: 'steam', price: '100', currency: 'BRL',
      collectedAt: '2026-01-15T11:00:00Z', volume24h: null, salesFrequency: '0.8',
      spreadPercent: '4', activeListings: null, fees: [],
    };
    expect(getLiquidity(reference)).toBe('high');
    expect(getLiquidity({ ...reference, salesFrequency: '0.4', spreadPercent: '7' })).toBe('medium');
    expect(getLiquidity({ ...reference, salesFrequency: null, spreadPercent: null })).toBe('low');
    expect(buildScenario(base, reference, reference, 'steam-to-csfloat', 'now', 'high')).toMatchObject({
      skinIdentityId: 'a', status: 'valid', proceedsKind: 'steam-wallet-credit', dataReferenceTime: 'now',
    });
    expect(buildScenario(base, reference, { ...reference, marketplace: 'csfloat' }, 'steam-to-csfloat', 'now', 'high').proceedsKind).toBe('cash');
  });
});
