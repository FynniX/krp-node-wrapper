import {Vec3d} from "./Vec3d";

export type TrackPositionT = {
  entries: TrackPositionEntryT[];
}

export type TrackPositionEntryT = {
  raceNumber: number;
  position: Vec3d;
}

