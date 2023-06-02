import {ChallengeT, ChallengeTypeT, EventT, EventTypeT} from "../types/EventT";
import {EntryT} from "../types/EntryT";
import {EntryRemoveT} from "../types/EntryRemoveT";
import {
  RaceSessionPractiseStateT,
  RaceSessionRaceStateT,
  RaceSessionT,
  SessionT,
  TestingDaySessionT
} from "../types/SessionT";
import {SessionStatusT} from "../types/SessionStatusT";
import {WeatherConditionT, WeatherT} from "../types/WeatherT";
import {SessionEntryT} from "../types/SessionEntryT";
import {DriverStateReason, DriverStateT, DriverStatusT} from "../types/DriverStatusT";
import {BestLapT} from "../types/BestLapT";
import {LastLapT} from "../types/LastLapT";
import {PenaltyOffenceT, PenaltyT, PenaltyTypeT} from "../types/PenaltyT";
import {LapT} from "../types/LapT";
import {SplitT} from "../types/SplitT";
import {SpeedT} from "../types/SpeedT";
import {
  ClassificationEntryKartStatusT,
  ClassificationEntryStatusT,
  ClassificationEntryT,
  ClassificationT
} from "../types/ClassificationT";
import {ChallengeDataT} from "../types/ChallengeDataT";
import {TrackDataT} from "../types/TrackDataT";
import {TrackSegmentT, TrackSegmentTypeT} from "../types/TrackSegmentT";
import {TrackPositionEntryT, TrackPositionT} from "../types/TrackPositionT";
import {ContactT} from "../types/ContactT";
import {isLapped} from "./isLapped";

type ReturnT =
  EventT
  | EntryT
  | EntryRemoveT
  | SessionT
  | SessionStatusT
  | WeatherT
  | SessionEntryT
  | DriverStatusT
  | BestLapT
  | LastLapT
  | PenaltyT
  | LapT
  | SplitT
  | SpeedT
  | ClassificationT
  | ChallengeDataT
  | TrackDataT
  | TrackSegmentT
  | TrackPositionT
  | ContactT
  | undefined;

export function toTyped(part: string[]): ReturnT {
  let i;
  let data: ReturnT;

  switch (part[0].toUpperCase()) {
    case "EVENT":
      let challenge: ChallengeT | undefined;
      if (part[1] === "CHALLENGE")
        challenge = {
          type: <ChallengeTypeT>part[6],
          length: parseInt(part[7]),
          maxTries: parseInt(part[8]),
        }

      data = {
        type: <EventTypeT>part[1],
        name: part[2],
        track: {
          name: part[3],
          length: parseInt(part[4])
        },
        categories: part[5].split("/"),
        challenge
      };
      break;
    case "ENTRY":
      data = {
        raceNumber: parseInt(part[1]),
        name: part[2],
        kart: {
          name: part[3],
          shortName: part[4],
          categories: part[5].split("/")
        },
        guid: part[6],
        extra: part[7]
      };
      break;
    case "ENTRYREMOVE":
      data = {
        raceNumber: parseInt(part[1]),
      };
      break;
    case "SESSION":
      data = {
        session: <TestingDaySessionT | RaceSessionT>part[1],
        state: <RaceSessionPractiseStateT | RaceSessionRaceStateT>part[2],
        length: parseInt(part[3]),
      };
      break;
    case "SESSIONSTATUS":
      data = {
        session: <TestingDaySessionT | RaceSessionT>part[1],
        state: <RaceSessionPractiseStateT | RaceSessionRaceStateT>part[2]
      };
      break;
    case "WEATHER":
      data = {
        condition: <WeatherConditionT>part[1],
        temperature: {
          air: parseInt(part[2]),
          track: parseInt(part[3]),
        }
      };
      break;
    case "SESSIONENTRY":
      data = {
        raceNumber: parseInt(part[1])
      };
      break;
    case "DRIVERSTATUS":
      data = {
        raceNumber: parseInt(part[1]),
        state: <DriverStateT>part[2],
        reason: <DriverStateReason>part[3]
      };
      break;
    case "BESTLAP":
      data = {
        raceNumber: parseInt(part[1]),
        sessionTime: parseInt(part[2]),
        lapTime: parseInt(part[3]),
        lapNumber: parseInt(part[4]),
        splits: [parseInt(part[5]), parseInt(part[6])],
        speedTrap: parseInt(part[7])
      };
      break;
    case "LASTLAP":
      data = {
        raceNumber: parseInt(part[1]),
        sessionTime: parseInt(part[2]),
        lapTime: parseInt(part[3]),
        lapNumber: parseInt(part[4]),
        splits: [parseInt(part[5]), parseInt(part[6])],
        speedTrap: parseInt(part[7])
      };
      break;
    case "PENALTY":
      data = {
        raceNumber: parseInt(part[1]),
        penaltyNumber: parseInt(part[2]),
        type: <PenaltyTypeT>part[3],
        penalty: parseInt(part[4]),
        offence: <PenaltyOffenceT>part[5]
      };
      break;
    case "LAP":
      data = {
        raceNumber: parseInt(part[1]),
        lapInvalid: parseInt(part[2]) === 1,
        sessionTime: parseInt(part[3]),
        lapTime: parseInt(part[4]),
        splits: [parseInt(part[5]), parseInt(part[6])],
        speedTrap: parseInt(part[7]),
      };
      break;
    case "SPLIT":
      data = {
        raceNumber: parseInt(part[1]),
        splitNumber: parseInt(part[2]),
        splitTime: parseInt(part[3]),
      };
      break;
    case "SPEED":
      data = {
        raceNumber: parseInt(part[1]),
        speedTrap: parseInt(part[2]),
      };
      break;
    case "CLASSIFICATION":
      const classificationEntries: ClassificationEntryT[] = [];

      i = 7;
      while (i < part.length - 1) {
        const raceNumber = parseInt(part[i]);
        let bestLap;
        let lapNumber;
        let totalLaps;
        let gap;
        let speed;
        let raceTime;
        let status;
        i++;

        if (part[1] === "TESTINGDAY" || part[1] === "PRACTISE" || part[1] === "QUALIFY" || part[1] === "WARMUP") {
          bestLap = parseInt(part[i]);
          i++;

          if (bestLap !== 0) {
            lapNumber = parseInt(part[i])
            i++;
            totalLaps = parseInt(part[i])
            i++;
            gap = part[i] === "--" ? part[i] : parseInt(part[i])
            i++;
            speed = parseInt(part[i])
            i++;
          }
        } else {
          raceTime = part[i] === "DNS" || part[i] === "DSQ" ? undefined : parseInt(part[i]);
          status = <ClassificationEntryStatusT> (part[i] === "DNS" || part[i] === "DSQ" ? part[i] : undefined);
          i++;

          if (raceTime !== 0 && raceTime !== undefined) {
            lapNumber = parseInt(part[i]);
            i++;
            gap = isLapped(part[i]) || part[i] === "--" ? part[i] : parseInt(part[i])
            i++;
          }
        }

        const kartStatus = <ClassificationEntryKartStatusT>part[i];
        i++;

        classificationEntries.push({
          raceNumber,
          bestLap,
          lapNumber,
          totalLaps,
          gap,
          speed,
          raceTime,
          status,
          kartStatus
        })
      }

      data = {
        session: part[1],
        status: part[2],
        sessionTimer: parseInt(part[3]),
        sessionLength: parseInt(part[4]),
        sessionLap: parseInt(part[5]),
        numberOfLaps: parseInt(part[6]),
        entries: classificationEntries
      };
      break;
    case "CHALLENGEDATA":
      data = {
        name: part[1],
        kart: {
          name: part[2],
          shortName: part[3],
        },
        guid: part[4],
        extra: part[5],
        tryNumber: parseInt(part[6]),
        bestLap: parseInt(part[7]),
        lapNumber: parseInt(part[8]),
        totalLaps: parseInt(part[9])
      };
      break;
    case "TRACKDATA":
      data = {
        startFinishPosition: part[1],
        splitPositions: [part[2], part[3]],
        speedTrapPosition: part[4],
        numberOfSegments: parseInt(part[5]),
      };
      break;
    case "TRACKSEGMENT":
      data = {
        segmentNumber: parseInt(part[1]),
        type: <TrackSegmentTypeT>parseInt(part[2]),
        length: parseInt(part[3]),
        radius: parseInt(part[4]),
        angle: parseInt(part[5]),
        startPosition: {
          x: parseInt(part[6]),
          z: parseInt(part[7]),
        },
        height: parseInt(part[8])
      };
      break;
    case "TRACKPOSITION":
      const trackPositionEntries: TrackPositionEntryT[] = [];

      i = 1;
      while (i < part.length - 1) {
        trackPositionEntries.push({
          raceNumber: parseInt(part[i]),
          position: {
            x: parseInt(part[i + 1]),
            y: parseInt(part[i + 2]),
            z: parseInt(part[i + 3]),
          }
        })
        i += 4;
      }

      data = {
        entries: trackPositionEntries
      };
      break;
    case "CONTACT":
      data = {
        time: parseInt(part[1]),
        raceNumbers: [parseInt(part[2]), parseInt(part[3])],
        relativeVelocity: parseInt(part[4])
      };
      break;
    default:
      data = undefined;
  }

  return data;
}