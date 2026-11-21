export interface Sticker {
  name: string;
  slot: number | null;
}

export interface SkinIdentity {
  id: string;
  marketHashName: string;
  category: string | null;
  wear: string | null;
  statTrak: boolean;
  souvenir: boolean;
  floatValue: string | null;
  paintSeed: number | null;
  stickers: Sticker[] | null;
  specialAttributes: Array<[string, string]>;
}
