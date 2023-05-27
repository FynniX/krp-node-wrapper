export type PenaltyT = {
  raceNumber: number;
  penaltyNumber: number;
  type: PenaltyTypeT;
  penalty: number;
  offence: PenaltyOffenceT;
}

export type PenaltyTypeT = "TIME" | "POS";

export type PenaltyOffenceT = "JUMPSTART" | "CUTTING" | "ROLLINGSTARTSPEEDING" | "ROLLINGSTARTTOOSLOW" | "ROLLINGSTARTCORRIDOR" | "ROLLINGSTARTOVERTAKING";