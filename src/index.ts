import {createSocket, Socket} from "dgram";
import BinaryWriter from "./classes/BinaryWriter";
import BinaryReader from "./classes/BinaryReader";
import {getParts} from "./functions/getParts";
import {toTyped} from "./functions/toTyped";
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

        this.handleParts(getParts(szData));

        const writer = new BinaryWriter('LE');
        writer.writeStringLine("ACK");
        writer.writeStringLine(szId);
        this.client.send(writer.buffer, 0, writer.size, this.port, this.hostname);

        this.console(`Acknowledgement Id: ${szId}!`)
        break;
      case "DATA":
        while (reader.size > 0)
          szData.push(reader.readStringLine());

        const type = szData[0];
        this.handleParts(getParts(szData));

        this.console(`Data Type: ${type}!`);
        break;
      case "ALIVE":
        this.console("Alive!");
        break;
    }
  }

  handleParts(parts: string[][]): void {
    for (const part of parts) {
      const data = toTyped(part);

      if (!data) {
        this.console("Unknown Event: " + part[0].toUpperCase());
        continue;
      }

      this.emit('update', part[0].toUpperCase(), data);
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

    if (diff < 20000)
      return;

    this.disconnect();
    this.console("Disconnected!")
  }

  connect(): void {
    if (this.connected)
      return;

    const writer = new BinaryWriter('LE');
    writer.writeStringLine("CONNECT");
    writer.writeStringLine(this.password);
    this.client.send(writer.buffer, 0, writer.size, this.port, this.hostname);
  }

  disconnect(): void {
    if (!this.connected)
      return;

    const writer = new BinaryWriter('LE');
    writer.writeStringLine("DISCONNECT");
    this.client.send(writer.buffer, 0, writer.size, this.port, this.hostname);
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
    writer.writeStringLine("2");

    this.client.send(writer.buffer, 0, writer.size, this.port, this.hostname);
  }

  keepalive(): void {
    if (!this.connected)
      return;

    const writer = new BinaryWriter('LE');
    writer.writeStringLine("KEEPALIVE");
    this.client.send(writer.buffer, 0, writer.size, this.port, this.hostname);
  }
}

export default KRPNodeWrapper;