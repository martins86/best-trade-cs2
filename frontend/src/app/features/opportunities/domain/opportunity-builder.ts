import Decimal from 'decimal.js';
import { PriceReference } from './price-reference.model';
import { SkinIdentity } from './skin-identity.model';
import { Direction, LiquidityCategory } from './opportunity-types';
import { OpportunityScenario } from './opportunity-scenario.model';

export function normalizeFloat(value: string): string {
  return new Decimal(value).toString();
}

export function compareOptionalValues<T>(a: T | null, b: T | null): boolean {
  if (a === null || b === null) return a === b;
  return Object.is(a, b);
}

export function areEquivalent(a: SkinIdentity, b: SkinIdentity): boolean {
  if (a.marketHashName !== b.marketHashName || a.wear !== b.wear || a.statTrak !== b.statTrak || a.souvenir !== b.souvenir) return false;
  if (a.floatValue === null || b.floatValue === null) return false;
  if (normalizeFloat(a.floatValue) !== normalizeFloat(b.floatValue)) return false;
  if (!compareOptionalValues(a.paintSeed, b.paintSeed)) return false;
  if (a.stickers === null || b.stickers === null) return a.stickers === b.stickers;
  const stickerKey = (value: typeof a.stickers) => value?.map(v => `${v.name}:${v.slot ?? 'null'}`).sort().join('|') ?? '';
  if (stickerKey(a.stickers) !== stickerKey(b.stickers)) return false;
  const specialKey = (value: Array<[string, string]>) => value.map(v => `${v[0]}:${v[1]}`).sort().join('|');
  return specialKey(a.specialAttributes) === specialKey(b.specialAttributes);
}

export function isReferenceValid(reference: PriceReference, referenceTime: string): boolean {
  const collected = new Date(reference.collectedAt).getTime();
  const now = new Date(referenceTime).getTime();
  if (!Number.isFinite(collected) || collected > now) return false;
  if (!reference.price || new Decimal(reference.price).lte(0)) return false;
  return now - collected <= 24 * 60 * 60 * 1000;
}

export function getLiquidity(reference: PriceReference): LiquidityCategory {
  const frequency = reference.salesFrequency ? new Decimal(reference.salesFrequency) : new Decimal(0);
  const spread = reference.spreadPercent ? new Decimal(reference.spreadPercent) : new Decimal(100);
  if (frequency.gte(0.8) && spread.lte(4)) return 'high';
  if (frequency.gte(0.4) && spread.lte(7)) return 'medium';
  return 'low';
}

export function buildScenario(skin: SkinIdentity, buy: PriceReference, sell: PriceReference, direction: Direction, referenceTime: string, liquidity: LiquidityCategory): OpportunityScenario {
  return {
    skinIdentityId: skin.id,
    direction,
    buyReferenceId: buy.id,
    sellReferenceId: sell.id,
    status: 'valid',
    liquidityCategory: liquidity,
    costBasisBrl: '',
    netProceedsBrl: '',
    netResultBrl: '',
    marginPercent: '',
    proceedsKind: sell.marketplace === 'steam' ? 'steam-wallet-credit' : 'cash',
    dataReferenceTime: referenceTime,
  };
}
