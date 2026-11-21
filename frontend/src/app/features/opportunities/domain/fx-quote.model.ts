import { Currency } from './opportunity-types';

export interface FxQuote {
  baseCurrency: Currency;
  quoteCurrency: Currency;
  rate: string;
  referenceTime: string;
}
