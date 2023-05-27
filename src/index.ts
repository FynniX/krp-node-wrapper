import {createSocket, Socket} from "dgram";
import Config from "../config";
import BinaryWriter from "./classes/BinaryWriter";
import BinaryReader from "./classes/BinaryReader";
import {getParts} from "./functions/getParts";
import {toTyped} from "./functions/toTyped";
import {UpdateT} from "./types/UpdateT";
import {EventT} from "./types/EventT";
import {ClassificationT} from "./types/ClassificationT";
import {TrackPositionT} from "./types/TrackPositionT";
import {EntryT} from "./types/EntryT";
import {EntryRemoveT} from "./types/EntryRemoveT";
import {SessionT} from "./types/SessionT";
import {SessionStatusT} from "./types/SessionStatusT";
import {WeatherT} from "./types/WeatherT";
import {SessionEntryT} from "./types/SessionEntryT";
import {DriverStatusT} from "./types/DriverStatusT";
import {BestLapT} from "./types/BestLapT";
import {LastLapT} from "./types/LastLapT";
import {PenaltyT} from "./types/PenaltyT";
import {LapT} from "./types/LapT";
import {SplitT} from "./types/SplitT";
import {SpeedT} from "./types/SpeedT";
import {ChallengeDataT} from "./types/ChallengeDataT";
import {TrackDataT} from "./types/TrackDataT";
import {TrackSegmentT} from "./types/TrackSegmentT";
import {ContactT} from "./types/ContactT";
import EventEmitter from "events";

class KRPNodeWrapper extends EventEmitter {
  public connected: boolean = false;
  private readonly hostname: string;
  private readonly port: number;
  private readonly password: string;
  private readonly client: Socket;
  private lastMessage: bigint = BigInt(-1);
  private stop: () => void = () => {};
  private readonly console: (msg: any) => void;
  private update: UpdateT = {
    Events: [],
    Entries: [],
    EntryRemovalsT: [],
    Sessions: [],
    SessionStatus: [],
    Weathers: [],
    SessionEntries: [],
    DriverStatus: [],
    BestLaps: [],
    LastLaps: [],
    Penalties: [],
    Laps: [],
    Splits: [],
    Speeds: [],
    Classifications: [],
    ChallengeData: [],
    TrackData: [],
    TrackSegments: [],
    TrackPositions: [],
    Contacts: []
  }

  constructor(hostname: string, port: number, password: string, logging: boolean) {
    super();

    this.hostname = hostname;
    this.port = port;
    this.password = password;
    this.console = (msg: any) => logging && console.log(msg);
    this.client = createSocket('udp4');

    this.client.on('error', this.handleError.bind(this));
    this.client.on('message', this.handleMessage.bind(this));

    this.connect();
    setInterval(this.checkAvailable.bind(this), 5000);
  }

  handleError(exception: Error) {
    this.console("Error!");
    console.error(exception);
  }

  handleMessage(message: Buffer) {
    this.lastMessage = process.hrtime.bigint();
    const reader = new BinaryReader(message, undefined, 'LE');
    const szString = reader.readStringLine();

    const szData = [];
    switch (szString) {
      case "OK":
        this.connected = true;
        this.emit('connected');
        const id = setInterval(this.checkAlive.bind(this), 5000);
        const id2 = setInterval(this.keepalive.bind(this), 15000);
        this.stop = () => {
          clearInterval(id);
          clearInterval(id2);
        }
        this.start();
        this.console("Connected!")
        break;
      case "FULL":
        this.console("Couldn't connect because server is full!");
        break;
      case "WRONGPASSWORD":
        this.console("Couldn't connect because the password is wrong!")
        break;
      case "MSG":
        const szId = reader.readStringLine();
        while (reader.size > 0)
          szData.push(reader.readStringLine());
        
        const parts = getParts(szData);

        for (const part of parts) {
          const data = toTyped(part);
          
          switch (part[0].toUpperCase()) {
            case "EVENT":
              this.update.Events.push(<EventT>data);
              break;
            case "ENTRY":
              this.update.Entries.push(<EntryT>data);
              break;
            case "ENTRYREMOVE":
              this.update.EntryRemovalsT.push(<EntryRemoveT>data);
              break;
            case "SESSION":
              this.update.Sessions.push(<SessionT>data);
              break;
            case "SESSIONSTATUS":
              this.update.SessionStatus.push(<SessionStatusT>data);
              break;
            case "WEATHER":
              this.update.Weathers.push(<WeatherT>data);
              break;
            case "SESSIONENTRY":
              this.update.SessionEntries.push(<SessionEntryT>data);
              break;
            case "DRIVERSTATUS":
              this.update.DriverStatus.push(<DriverStatusT>data);
              break;
            case "BESTLAP":
              this.update.BestLaps.push(<BestLapT>data);
              break;
            case "LASTLAP":
              this.update.LastLaps.push(<LastLapT>data);
              break;
            case "PENALTY":
              this.update.Penalties.push(<PenaltyT>data);
              break;
            case "LAP":
              this.update.Laps.push(<LapT>data);
              break;
            case "SPLIT":
              this.update.Splits.push(<SplitT>data);
              break;
            case "SPEED":
              this.update.Speeds.push(<SpeedT>data);
              break;
            case "CLASSIFICATION":
              this.update.Classifications.push(<ClassificationT>data);
              break;
            case "CHALLENGEDATA":
              this.update.ChallengeData.push(<ChallengeDataT>data);
              break;
            case "TRACKDATA":
              this.update.TrackData.push(<TrackDataT>data);
              break;
            case "TRACKSEGMENT":
              this.update.TrackSegments.push(<TrackSegmentT>data);
              break;
            case "TRACKPOSITION":
              this.update.TrackPositions.push(<TrackPositionT>data);
              break;
            case "CONTACT":
              this.update.Contacts.push(<ContactT>data);
              break;
            default:
              this.console("Unknown Event: " + part[0].toUpperCase())
          }
        }

        this.emit('update', this.update);

        const writer = new BinaryWriter('LE');
        writer.writeStringLine("ACK");
        writer.writeStringLine(szId);
        this.client.send(writer.buffer, 0, writer.size, Config.Connection.port, Config.Connection.hostname);

        this.console(`Acknowledgement Id: ${szId}!`)
        break;
      case "DATA":
        while (reader.size > 0)
          szData.push(reader.readStringLine());

        this.console(`Data Type: ${szData[0]}!`);
        break;
      case "ALIVE":
        this.console("Alive!");
        break;
    }
  }

  checkAvailable(): void {
    if (this.connected)
      return;

    this.connect();
  }

  checkAlive(): void {
    if (!this.connected)
      return;

    const lastMessage = this.lastMessage;
    const currentTime = process.hrtime.bigint();
    const diff = Number(currentTime - lastMessage) / Math.pow(10, 6);

    if (diff < 20000
    )
      return;

    this.disconnect();
    this.console("Disconnected!")
  }

  connect(): void {
    if (this.connected)
      return;

    const writer = new BinaryWriter('LE');
    writer.writeStringLine("CONNECT");
    writer.writeStringLine(Config.Connection.password);
    this.client.send(writer.buffer, 0, writer.size, Config.Connection.port, Config.Connection.hostname);
  }

  disconnect(): void {
    if (!this.connected)
      return;

    this.connected = false;
    this.emit('disconnected');
    this.stop();
  }

  start(): void {
    if (!this.connected)
      return;

    const writer = new BinaryWriter('LE');
    writer.writeStringLine("START");
    writer.writeStringLine("1");
    writer.writeStringLine("1");
    this.client.send(writer.buffer, 0, writer.size, Config.Connection.port, Config.Connection.hostname);
  }

  keepalive(): void {
    if (!this.connected)
      return;

    const writer = new BinaryWriter('LE');
    writer.writeStringLine("KEEPALIVE");
    this.client.send(writer.buffer, 0, writer.size, Config.Connection.port, Config.Connection.hostname);
  }
}

new KRPNodeWrapper(Config.Connection.hostname, Config.Connection.port, Config.Connection.password, true);

export default KRPNodeWrapper;