export type TrackSegmentT = {
  segmentNumber: number;
  type: TrackSegmentTypeT;
  length: number;
  radius: number;
  angle: number;
  startPosition: TrackSegmentStartPositionT;
  height: number;
}

export type TrackSegmentTypeT = 0 | 1;
export type TrackSegmentTypeStringT = "Straight" | "Curve";

type TrackSegmentStartPositionT = {
  x: number;
  z: number;
}