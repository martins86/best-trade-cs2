import { describe, expect, it } from 'vitest';
import Decimal from 'decimal.js';
import { calculateOpportunity, convertToBrl, feeApplies, roundMoney } from './opportunity-calculator';
import { FxQuote } from './fx-quote.model';
import { PriceReference } from './price-reference.model';

const quote: FxQuote = { baseCurrency: 'USD', quoteCurrency: 'BRL', rate: '5.50', referenceTime: '2026-01-15T12:00:00Z' };
const buy: PriceReference = { id: 'b', skinIdentityId: 's', marketplace: 'csfloat', price: '100.00', currency: 'USD', collectedAt: '2026-01-15T11:00:00Z', volume24h: null, salesFrequency: null, spreadPercent: null, activeListings: null, fees: [{ kind: 'purchase', amount: '2.00', currency: 'USD', label: 'Compra', appliesTo: 'acquisition' }] };
const sell: PriceReference = { id: 's', skinIdentityId: 's', marketplace: 'steam', price: '570.00', currency: 'BRL', collectedAt: '2026-01-15T11:00:00Z', volume24h: null, salesFrequency: null, spreadPercent: null, activeListings: null, fees: [{ kind: 'sale', amount: '20.00', currency: 'BRL', label: 'Venda', appliesTo: 'proceeds' }] };

describe('opportunity calculator', () => {
  it('converte, aplica taxas e mantém precisão intermediária', () => {
    const result = calculateOpportunity(buy, sell, quote);
    expect(roundMoney(result.costBasisBrl)).toBe('561.00');
    expect(roundMoney(result.netProceedsBrl)).toBe('550.00');
    expect(roundMoney(result.netResultBrl)).toBe('-11.00');
  });
  it('usa margem half-up', () => expect(roundMoney(new Decimal('1.005'))).toBe('1.01'));
  it('converte BRL diretamente e USD usando a cotação correspondente', () => {
    expect(convertToBrl('12.34', 'BRL', quote).toString()).toBe('12.34');
    expect(convertToBrl('2', 'USD', quote).toString()).toBe('11');
    expect(() => convertToBrl('2', 'USD', { ...quote, baseCurrency: 'BRL' })).toThrow('Cotação simulada indisponível');
  });
  it('aplica somente taxas do lado correspondente e representa custo zero sem margem', () => {
    const acquisitionFee = buy.fees[0];
    expect(feeApplies(acquisitionFee, 'acquisition')).toBe(true);
    expect(feeApplies(acquisitionFee, 'proceeds')).toBe(false);

    const result = calculateOpportunity(
      { ...buy, price: '0', fees: [{ ...acquisitionFee, appliesTo: 'proceeds' }] },
      { ...sell, fees: [{ ...sell.fees[0], appliesTo: 'acquisition' }] },
      quote,
    );
    expect(result.costBasisBrl.toString()).toBe('0');
    expect(result.netProceedsBrl.toString()).toBe('570');
    expect(result.marginPercent).toBeNull();
  });
});
