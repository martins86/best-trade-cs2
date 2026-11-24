import { FxQuote } from '../domain/fx-quote.model';
import { PriceReference } from '../domain/price-reference.model';
import { SkinIdentity } from '../domain/skin-identity.model';

export const REFERENCE_TIME = '2026-01-15T12:00:00Z';

export const skins: SkinIdentity[] = [
  { id: 'skin-awp', marketHashName: 'AWP | Asiimov (Field-Tested)', category: 'Rifle', wear: 'Field-Tested', statTrak: false, souvenir: false, floatValue: '0.1800', paintSeed: 661, stickers: [{ name: 'Team Liquid', slot: 1 }, { name: 'Titan', slot: 2 }], specialAttributes: [] },
  { id: 'skin-ak', marketHashName: 'AK-47 | Redline (Field-Tested)', category: 'Rifle', wear: 'Field-Tested', statTrak: false, souvenir: false, floatValue: '0.240', paintSeed: 321, stickers: null, specialAttributes: [['pattern', 'redline']] },
  { id: 'skin-m4a4', marketHashName: 'M4A4 | Howl (Minimal Wear)', category: 'Rifle', wear: 'Minimal Wear', statTrak: false, souvenir: false, floatValue: '0.1200', paintSeed: null, stickers: [{ name: 'Howling', slot: 0 }], specialAttributes: [] },
  { id: 'skin-stale', marketHashName: 'USP-S | Kill Confirmed (Factory New)', category: 'Pistol', wear: 'Factory New', statTrak: true, souvenir: false, floatValue: null, paintSeed: null, stickers: null, specialAttributes: [] },
];

export const references: PriceReference[] = [
  { id: 'awp-steam', skinIdentityId: 'skin-awp', marketplace: 'steam', price: '500.00', currency: 'BRL', collectedAt: '2026-01-15T10:00:00Z', volume24h: 22, salesFrequency: '0.85', spreadPercent: '4.2', activeListings: 40, fees: [{ kind: 'purchase', amount: '10.00', currency: 'BRL', label: 'Taxa simulada de compra', appliesTo: 'acquisition' }] },
  { id: 'awp-csfloat', skinIdentityId: 'skin-awp', marketplace: 'csfloat', price: '110.00', currency: 'USD', collectedAt: '2026-01-15T11:00:00Z', volume24h: 18, salesFrequency: '0.72', spreadPercent: '5.1', activeListings: 35, fees: [{ kind: 'sale', amount: '4.00', currency: 'USD', label: 'Taxa simulada de venda', appliesTo: 'proceeds' }] },
  { id: 'ak-steam', skinIdentityId: 'skin-ak', marketplace: 'steam', price: '420.00', currency: 'BRL', collectedAt: '2026-01-15T09:00:00Z', volume24h: 9, salesFrequency: '0.35', spreadPercent: '8.4', activeListings: 25, fees: [] },
  { id: 'ak-csfloat', skinIdentityId: 'skin-ak', marketplace: 'csfloat', price: '75.00', currency: 'USD', collectedAt: '2026-01-15T09:30:00Z', volume24h: 12, salesFrequency: '0.48', spreadPercent: '7.0', activeListings: 20, fees: [{ kind: 'sale', amount: '6.00', currency: 'USD', label: 'Taxa simulada', appliesTo: 'proceeds' }] },
  { id: 'm4-steam', skinIdentityId: 'skin-m4a4', marketplace: 'steam', price: '900.00', currency: 'BRL', collectedAt: '2026-01-15T11:30:00Z', volume24h: 30, salesFrequency: '1.2', spreadPercent: '2.8', activeListings: 55, fees: [{ kind: 'sale', amount: '45.00', currency: 'BRL', label: 'Taxa Steam simulada', appliesTo: 'proceeds' }] },
  { id: 'm4-csfloat', skinIdentityId: 'skin-m4a4', marketplace: 'csfloat', price: '150.00', currency: 'USD', collectedAt: '2026-01-15T11:45:00Z', volume24h: 28, salesFrequency: '1.0', spreadPercent: '3.0', activeListings: 48, fees: [{ kind: 'purchase', amount: '5.00', currency: 'USD', label: 'Taxa de aquisição', appliesTo: 'acquisition' }] },
  { id: 'stale-csfloat', skinIdentityId: 'skin-stale', marketplace: 'csfloat', price: '80.00', currency: 'USD', collectedAt: '2026-01-13T10:00:00Z', volume24h: 2, salesFrequency: null, spreadPercent: null, activeListings: null, fees: [] },
];

export const fxQuotes: FxQuote[] = [{ baseCurrency: 'USD', quoteCurrency: 'BRL', rate: '5.50', referenceTime: REFERENCE_TIME }];

for (let index = 1; index <= 96; index += 1) {
  const id = `skin-load-${index}`;
  const steamId = `load-${index}-steam`;
  const csfloatId = `load-${index}-csfloat`;
  skins.push({
    id,
    marketHashName: `Skin de carga ${index.toString().padStart(2, '0')}`,
    category: 'Rifle',
    wear: 'Field-Tested',
    statTrak: false,
    souvenir: false,
    floatValue: `0.${index.toString().padStart(4, '0')}`,
    paintSeed: index,
    stickers: null,
    specialAttributes: [],
  });
  references.push(
    {
      id: steamId,
      skinIdentityId: id,
      marketplace: 'steam',
      price: (300 + index * 10).toFixed(2),
      currency: 'BRL',
      collectedAt: '2026-01-15T11:30:00Z',
      volume24h: 10 + index % 30,
      salesFrequency: (0.4 + (index % 7) * 0.1).toFixed(2),
      spreadPercent: (3 + (index % 5)).toFixed(1),
      activeListings: 20 + index,
      fees: [],
    },
    {
      id: csfloatId,
      skinIdentityId: id,
      marketplace: 'csfloat',
      price: (55 + index).toFixed(2),
      currency: 'USD',
      collectedAt: '2026-01-15T11:30:00Z',
      volume24h: 12 + index % 25,
      salesFrequency: (0.5 + (index % 6) * 0.1).toFixed(2),
      spreadPercent: (2.5 + (index % 4)).toFixed(1),
      activeListings: 18 + index,
      fees: [],
    },
  );
}
