export type SessionT = {
  session: TestingDaySessionT | RaceSessionT;
  state: RaceSessionPractiseStateT | RaceSessionRaceStateT | "--";
  length: number;
}

export type TestingDaySessionT = "WAITING" | "TESTINGDAY";

export type RaceSessionT = "WAITING" | "PRACTICE" | "QUALIFY" | "WARMUP" | "QUALIFYHEAT" | "SECONDCHANCEHEAT" | "PREFINAL" | "FINAL";

export type RaceSessionPractiseStateT = "INPROGRESS" | "COMPLETE";
export type RaceSessionRaceStateT = "WARMUPLAP" | "PRESTART" | "ROLLINGSTART" | "STARTSEQUENCE" | "INPROGRESS" | "RACEOVER" | "COMPLETE";