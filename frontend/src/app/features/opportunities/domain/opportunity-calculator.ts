import Decimal from 'decimal.js';
import { FxQuote } from './fx-quote.model';
import { FeeCost, PriceReference } from './price-reference.model';

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

export function convertToBrl(amount: string, currency: 'BRL' | 'USD', quote: FxQuote): Decimal {
  if (currency === 'BRL') return new Decimal(amount);
  if (quote.baseCurrency !== currency || quote.quoteCurrency !== 'BRL') throw new Error('Cotação simulada indisponível');
  return new Decimal(amount).mul(quote.rate);
}

export function feeApplies(fee: FeeCost, side: 'acquisition' | 'proceeds'): boolean {
  return fee.appliesTo === side;
}

export interface CalculatedOpportunity {
  costBasisBrl: Decimal;
  netProceedsBrl: Decimal;
  netResultBrl: Decimal;
  marginPercent: Decimal | null;
}

export function calculateOpportunity(buy: PriceReference, sell: PriceReference, quote: FxQuote): CalculatedOpportunity {
  let cost = convertToBrl(buy.price, buy.currency, quote);
  for (const fee of buy.fees) {
    if (feeApplies(fee, 'acquisition')) cost = cost.plus(convertToBrl(fee.amount, fee.currency, quote));
  }

  let proceeds = convertToBrl(sell.price, sell.currency, quote);
  for (const fee of sell.fees) {
    if (fee.appliesTo === 'proceeds') proceeds = proceeds.minus(convertToBrl(fee.amount, fee.currency, quote));
  }

  const result = proceeds.minus(cost);
  const margin = cost.gt(0) ? result.div(cost).mul(100) : null;
  return { costBasisBrl: cost, netProceedsBrl: proceeds, netResultBrl: result, marginPercent: margin };
}

export function roundMoney(value: Decimal): string {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}
