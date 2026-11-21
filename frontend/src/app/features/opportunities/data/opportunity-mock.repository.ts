import { FxQuote } from '../domain/fx-quote.model';
import { PriceReference } from '../domain/price-reference.model';
import { SkinIdentity } from '../domain/skin-identity.model';
import { fxQuotes, references, REFERENCE_TIME, skins } from './opportunity.fixtures';

export class OpportunityMockRepository {
  getReferenceTime(): string { return REFERENCE_TIME; }
  getSkins(): SkinIdentity[] { return skins; }
  getReferences(): PriceReference[] { return references; }
  getFxQuotes(): FxQuote[] { return fxQuotes; }
}
