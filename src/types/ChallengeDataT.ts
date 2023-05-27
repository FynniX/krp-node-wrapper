export type ChallengeDataT = {
  name: string;
  kart: ChallengeKartT;
  guid: string;
  extra: string;
  tryNumber: number;
  bestLap?: number;
  lapNumber?: number;
  totalLaps?: number;
}

export type ChallengeKartT = {
  name: string;
  shortName: string;
}