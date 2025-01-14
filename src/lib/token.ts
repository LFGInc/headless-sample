export type TokenInstance = {
  collection: string;
  category: string;
  type: string;
  additionalKey: string;
};

export enum AllowanceType {
  Use = 0,
  Lock = 1,
  // Note: We may want to remove this in the future, as Spend is redundant with transfer allowance
  Spend = 2,
  Transfer = 3,
  Mint = 4,
  Swap = 5,
  Burn = 6,
}
