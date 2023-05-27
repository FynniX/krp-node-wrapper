type Endian = "BE" | "LE";

class BinaryWriter {
  public buffer: Buffer = Buffer.alloc(0);
  public size: number = 0;
  private readonly endian: Endian;

  constructor(endian?: Endian) {
    this.endian = endian || "BE";
  }

  writeUInt8(data: number) {
    const tempBuffer = Buffer.alloc(1);
    tempBuffer.writeUInt8(data, 0);
    this.size ++;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeUInt16(data: number) {
    const tempBuffer = Buffer.alloc(2);
    if(this.endian === "BE") {
      tempBuffer.writeUInt16BE(data, this.size);
    } else {
      tempBuffer.writeUInt16LE(data, this.size);
    }
    this.size += 2;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeUInt32(data: number) {
    const tempBuffer = Buffer.alloc(4);
    if(this.endian === "BE") {
      tempBuffer.writeUInt32BE(data, this.size);
    } else {
      tempBuffer.writeUInt32LE(data, this.size);
    }
    this.size += 4;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeUInt64(data: number) {
    const tempBuffer = Buffer.alloc(8);
    if(this.endian === "BE") {
      tempBuffer.writeBigUInt64BE(BigInt(data), this.size);
    } else {
      tempBuffer.writeBigUInt64LE(BigInt(data), this.size);
    }
    this.size += 8;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeInt8(data: number) {
    const tempBuffer = Buffer.alloc(1);
    tempBuffer.writeInt8(data, 0);
    this.size ++;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeInt16(data: number) {
    const tempBuffer = Buffer.alloc(2);
    if(this.endian === "BE") {
      tempBuffer.writeInt16BE(data, this.size);
    } else {
      tempBuffer.writeInt16LE(data, this.size);
    }
    this.size += 2;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeInt32(data: number) {
    const tempBuffer = Buffer.alloc(4);
    if(this.endian === "BE") {
      tempBuffer.writeInt32BE(data, this.size);
    } else {
      tempBuffer.writeInt32LE(data, this.size);
    }
    this.size += 4;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeInt64(data: number) {
    const tempBuffer = Buffer.alloc(8);
    if(this.endian === "BE") {
      tempBuffer.writeBigInt64BE(BigInt(data), this.size);
    } else {
      tempBuffer.writeBigInt64LE(BigInt(data), this.size);
    }
    this.size += 8;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeFloat(data: number) {
    const tempBuffer = Buffer.alloc(4);
    if(this.endian === "BE") {
      tempBuffer.writeFloatBE(data, this.size);
    } else {
      tempBuffer.writeFloatLE(data, this.size);
    }
    this.size += 4;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeDouble(data: number) {
    const tempBuffer = Buffer.alloc(8);
    if(this.endian === "BE") {
      tempBuffer.writeDoubleBE(data, this.size);
    } else {
      tempBuffer.writeDoubleLE(data, this.size);
    }
    this.size += 8;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeString(data: string) {
    const tempBuffer = Buffer.from(data);
    this.size += tempBuffer.length;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }

  writeStringLine(data: string) {
    const tempBuffer = Buffer.from(`${data}\n`);
    this.size += tempBuffer.length;
    this.buffer = Buffer.concat([this.buffer, tempBuffer], this.size);
  }
}

export default BinaryWriter;