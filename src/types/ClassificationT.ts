export type ClassificationT = {
  session: string;
  status: string;
  sessionTimer: number;
  sessionLength: number;
  sessionLap: number;
  numberOfLaps: number;
  entries: ClassificationEntryT[];
}

export type ClassificationEntryT = {
  raceNumber: number;
  bestLap?: number;
  lapNumber?: number;
  totalLaps?: number;
  gap?: number | string;
  speed?: number;
  raceTime?: number;
  status?: ClassificationEntryStatusT;
  kartStatus?: ClassificationEntryKartStatusT;
}

export type ClassificationEntryStatusT = "DNS" | "DSQ" | undefined;

export type ClassificationEntryKartStatusT = "TRK" | "PIT";