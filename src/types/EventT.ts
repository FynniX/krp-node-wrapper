export type EventT = {
  type: EventTypeT;
  name: string;
  track: EventTrackT;
  categories: string[];
  challenge?: ChallengeT;
};

export type EventTrackT = {
  name: string;
  length: number;
}

export type ChallengeT = {
  type: ChallengeTypeT;
  length: number;
  maxTries: number;
}

export type EventTypeT = "TESTINGDAY" | "RACE" | "CHALLENGE";

export type ChallengeTypeT = "PRACTICE" | "RACE";