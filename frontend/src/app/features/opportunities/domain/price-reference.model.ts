import { Currency, Marketplace } from './opportunity-types';

export interface FeeCost {
  kind: 'purchase' | 'sale' | 'conversion' | 'withdrawal';
  amount: string;
  currency: Currency;
  label: string;
  appliesTo: 'acquisition' | 'proceeds';
}

export interface PriceReference {
  id: string;
  skinIdentityId: string;
  marketplace: Marketplace;
  price: string;
  currency: Currency;
  collectedAt: string;
  volume24h: number | null;
  salesFrequency: string | null;
  spreadPercent: string | null;
  activeListings: number | null;
  fees: FeeCost[];
}
