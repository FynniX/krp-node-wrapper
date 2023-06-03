import {createSocket, Socket} from "dgram";
import EventEmitter from "events";
import BinaryReader from "./BinaryReader";
import {KartDataStateT, KartDataT} from "../types/KartDataT";
import {KartSessionT} from "../types/KartSessionT";
import {KartLapT} from "../types/KartLapT";
import {KartSplitT} from "../types/KartSplitT";
import {KartEventT} from "../types/KartEventT";

export class ClientWrapper extends EventEmitter {
  private readonly port: number;
  private readonly server: Socket;
  private readonly console: (msg: any) => void;

  constructor(port: number, logging: boolean) {
    super();

    this.port = port;
    this.console = (msg: any) => logging && console.log("ClientWrapper - " + msg);
    this.server = createSocket('udp4');

    this.server.on('error', this.handleError.bind(this));
    this.server.on('message', this.handleMessage.bind(this));
    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(this.port);
  }

  handleError(exception: Error) {
    this.console("Error!");
    console.error(exception);
  }

  handleMessage(msg: Buffer) {
    const reader = new BinaryReader(msg, 'ascii', 'LE');
    const type = reader.readStringNullTerminated();
    let data;

    switch (type.trim()) {
      case "data":
        data = {} as KartDataT;
        data.state = <KartDataStateT>reader.readInt32();
        data.time = reader.readInt32() as number;
        data.m_iRPM = reader.readInt32() as number;
        data.m_fCylinderHeadTemperature = reader.readFloat() as number;
        data.m_fWaterTemperature = reader.readFloat() as number;
        data.m_iGear = reader.readInt32() as number;
        data.m_fFuel = reader.readFloat() as number;
        data.m_fSpeedometer = reader.readFloat() as number;

        data.m_fPosX = reader.readFloat() as number;
        data.m_fPosY = reader.readFloat() as number;
        data.m_fPosZ = reader.readFloat() as number;

        data.m_fVelocityX = reader.readFloat() as number;
        data.m_fVelocityY = reader.readFloat() as number;
        data.m_fVelocityZ = reader.readFloat() as number;

        data.m_fAccelerationX = reader.readFloat() as number;
        data.m_fAccelerationY = reader.readFloat() as number;
        data.m_fAccelerationZ = reader.readFloat() as number;

        data.m_aafRot = [];
        for (let i = 0; i < 3; i++) {
          const arr = [];
          for (let j = 0; j < 3; j++)
            arr.push(reader.readFloat() as number);
          data.m_aafRot.push(arr);
        }

        data.m_fYaw = reader.readFloat() as number;
        data.m_fPitch = reader.readFloat() as number;
        data.m_fRoll = reader.readFloat() as number

        data.m_fYawVelocity = reader.readFloat() as number;
        data.m_fPitchVelocity = reader.readFloat() as number;
        data.m_fRollVelocity = reader.readFloat() as number;

        data.m_fInputSteer = reader.readFloat() as number;
        data.m_fInputThrottle = reader.readFloat() as number;
        data.m_fInputBrake = reader.readFloat() as number;
        data.m_fInputFrontBrakes = reader.readFloat() as number;
        data.m_fInputClutch = reader.readFloat() as number;

        data.m_afWheelSpeed = [];
        for (let i = 0; i < 4; i++)
          data.m_afWheelSpeed.push(reader.readFloat() as number);

        data.m_aiWheelMaterial = [];
        for (let i = 0; i < 4; i++)
          data.m_aiWheelMaterial.push(reader.readInt32() as number);

        data.m_fSteerTorque = reader.readFloat() as number;
        break;
      case "evnt":
        data = {} as KartEventT;
        data.m_szDriverName = reader.readStringNullTerminated();
        data.m_szKartID = reader.readStringNullTerminated();
        data.m_szKartName = reader.readStringNullTerminated();
        data.m_iDriveType = reader.readInt32() as number;
        data.m_iNumberOfGears = reader.readInt32() as number;
        data.m_iMaxRPM = reader.readInt32() as number;
        data.m_iLimiter = reader.readInt32() as number;
        data.m_iShiftRPM = reader.readInt32() as number;
        data.m_iEngineCooling = reader.readInt32() as number;
        data.m_fEngineOptTemperature = reader.readFloat() as number;

        data.m_afEngineTemperatureAlarm = [];
        for(let i = 0; i < 2; i++)
          data.m_afEngineTemperatureAlarm.push(reader.readFloat() as number);

        data.m_fMaxFuel = reader.readFloat() as number;
        data.m_szCategory = reader.readStringNullTerminated();
        data.m_szDash = reader.readStringNullTerminated();
        data.m_szTrackID = reader.readStringNullTerminated();
        data.m_szTrackName = reader.readStringNullTerminated();
        data.m_fTrackLength = reader.readFloat() as number;
        data.m_iType = reader.readInt32() as number;
        break;
      case "sesn":
        data = {} as KartSessionT;
        data.m_iSession = reader.readInt32() as number;
        data.m_iSessionSeries = reader.readInt32() as number;
        data.m_iConditions = reader.readInt32() as number;
        data.m_fAirTemperature = reader.readFloat() as number;
        data.m_fTrackTemperature = reader.readFloat() as number;
        data.m_szSetupFileName = (reader.readString(100) as string).replaceAll("\x00", "");
        break;
      case "lap":
        data = {} as KartLapT;
        data.m_iLapNum = reader.readInt32() as number;
        data.m_iInvalid = reader.readInt32() as number;
        data.m_iLapTime = reader.readInt32() as number;
        data.m_iPos = reader.readInt32() as number;
        break;
      case "splt":
        data = {} as KartSplitT;
        data.split = reader.readInt32() as number;
        data.m_iSplit = reader.readInt32() as number;
        data.m_iSplitTime = reader.readInt32() as number;
        data.m_iBestDiff = reader.readInt32() as number;
        break;
      default:
        this.console("Unknown Type: " + type);
    }

    this.emit('update', type.trim(), data);
  }
}