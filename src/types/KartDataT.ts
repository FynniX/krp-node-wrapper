export type KartDataT = {
  state: KartDataStateT;
  time: number;
  m_iRPM: number;
  m_fCylinderHeadTemperature: number;
  m_fWaterTemperature: number;
  m_iGear: number;
  m_fFuel: number;
  m_fSpeedometer: number;

  m_fPosX: number;
  m_fPosY: number;
  m_fPosZ: number;

  m_fVelocityX: number;
  m_fVelocityY: number;
  m_fVelocityZ: number;

  m_fAccelerationX: number;
  m_fAccelerationY: number;
  m_fAccelerationZ: number;

  m_aafRot: number[][];

  m_fYaw: number;
  m_fPitch: number;
  m_fRoll: number;

  m_fYawVelocity: number;
  m_fPitchVelocity: number;
  m_fRollVelocity: number;

  m_fInputSteer: number;
  m_fInputThrottle: number;
  m_fInputBrake: number;
  m_fInputFrontBrakes: number;
  m_fInputClutch: number;
  m_afWheelSpeed: number[];
  m_aiWheelMaterial: number[];
  m_fSteerTorque: number;
}

//0: software running; 1: on-track, simulation paused; 2: on-track, simulation running
export type KartDataStateT = 0 | 1 | 2;