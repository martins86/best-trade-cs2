import { DataState, Direction, LiquidityCategory, ReceivedValueKind } from './opportunity-types';

export interface OpportunityScenario {
  skinIdentityId: string;
  direction: Direction;
  buyReferenceId: string;
  sellReferenceId: string;
  status: DataState;
  liquidityCategory: LiquidityCategory;
  costBasisBrl: string;
  netProceedsBrl: string;
  netResultBrl: string;
  marginPercent: string;
  proceedsKind: ReceivedValueKind;
  dataReferenceTime: string;
}
