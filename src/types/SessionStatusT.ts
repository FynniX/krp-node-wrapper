import {RaceSessionPractiseStateT, RaceSessionRaceStateT, RaceSessionT, TestingDaySessionT} from "./SessionT";

export type SessionStatusT = {
  session: TestingDaySessionT | RaceSessionT;
  state: RaceSessionPractiseStateT | RaceSessionRaceStateT | "--";
}