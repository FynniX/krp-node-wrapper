export type DriverStatusT = {
  raceNumber: number;
  state: DriverStateT;
  reason?: DriverStateReason;
}

export type DriverStateT = "DNS" | "RET" | "DSQ";

export type DriverStateReason = "JUMPSTART" | "TOOMANYOFFENCES" | "ROLLINGSTARTSPEEDING" | "ROLLINGSTARTTOOSLOW" | "ROLLINGSTARTCORRIDOR" | "ROLLINGSTARTOVERTAKE" | "DIRECTOR" | undefined;