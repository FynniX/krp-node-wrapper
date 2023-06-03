import {BinaryToTextEncoding, CharacterEncoding, LegacyCharacterEncoding} from "crypto";

type Endian = "BE" | "LE";

class BinaryReader {
  public buffer: Buffer;
  public size: number;
  private readonly encoding: BinaryToTextEncoding | CharacterEncoding | LegacyCharacterEncoding;
  private readonly endian: Endian;

  constructor(buffer: Buffer, encoding: BinaryToTextEncoding | CharacterEncoding | LegacyCharacterEncoding | undefined, endian?: Endian) {
    this.buffer = buffer;
    this.size = buffer.length;
    this.encoding = encoding || "ascii";
    this.endian = endian || "BE";
  }

  readUInt8(): number | undefined {
    if(this.size < 1)
      return;

    const value = this.buffer.readUInt8(0);
    this.buffer = this.buffer.subarray(1, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readUInt16(): number | undefined {
    if(this.size < 2)
      return;

    const value = this.endian === "BE" ? this.buffer.readUInt16BE(0) : this.buffer.readUInt16LE(0);
    this.buffer = this.buffer.subarray(2, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readUInt32(): number | undefined {
    if(this.size < 4)
      return;

    const value = this.endian === "BE" ? this.buffer.readUInt32BE(0) : this.buffer.readUInt32LE(0);
    this.buffer = this.buffer.subarray(4, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readUInt64(): bigint | undefined {
    if(this.size < 8)
      return;

    const value = this.endian === "BE" ? this.buffer.readBigUInt64BE(0) : this.buffer.readBigUInt64LE(0);
    this.buffer = this.buffer.subarray(8, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readInt8(): number | undefined {
    if(this.size < 1)
      return;

    const value = this.buffer.readInt8(0);
    this.buffer = this.buffer.subarray(1, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readInt16(): number | undefined {
    if(this.size < 2)
      return;

    const value = this.endian === "BE" ? this.buffer.readInt16BE(0) : this.buffer.readInt16LE(0);
    this.buffer = this.buffer.subarray(2, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readInt32(): number | undefined {
    if(this.size < 4)
      return;

    const value = this.endian === "BE" ? this.buffer.readInt32BE(0) : this.buffer.readInt32LE(0);
    this.buffer = this.buffer.subarray(4, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readInt64(): bigint | undefined {
    if(this.size < 8)
      return;

    const value = this.endian === "BE" ? this.buffer.readBigInt64BE(0) : this.buffer.readBigInt64LE(0);
    this.buffer = this.buffer.subarray(8, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readFloat(): number | undefined {
    if(this.size < 4)
      return;

    const value = this.endian === "BE" ? this.buffer.readFloatBE(0) : this.buffer.readFloatLE(0);
    this.buffer = this.buffer.subarray(4, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readDouble(): number | undefined {
    if(this.size < 8)
      return;

    const value = this.endian === "BE" ? this.buffer.readDoubleBE(0) : this.buffer.readDoubleLE(0);
    this.buffer = this.buffer.subarray(8, this.size);
    this.size = this.buffer.length;

    return value;
  }

  readString(count: number): string | undefined {
    const tempBuffer = Buffer.alloc(count);
    this.buffer.copy(tempBuffer, 0, 0, count);
    this.buffer = this.buffer.subarray(count, this.size);
    this.size = this.buffer.length;

    return tempBuffer.toString(this.encoding);
  }

  readStringNullTerminated(): string {
    const endIndex = this.buffer.indexOf("\0")
    const tempBuffer = Buffer.alloc(endIndex + 1);
    this.buffer.copy(tempBuffer, 0, 0, endIndex + 1);
    this.buffer = this.buffer.subarray(endIndex + 1, this.size);
    this.size = this.buffer.length;

    return tempBuffer.subarray(0, endIndex).toString(this.encoding);
  }

  readStringLine(): string {
    const split = this.buffer.toString(this.encoding).split("\n");
    if(split.length === 0)
      return "";

    const tempBuffer = Buffer.from(`${split[0]}\n`);
    this.buffer = this.buffer.subarray(tempBuffer.length, this.size);
    this.size = this.buffer.length;

    return split[0];
  }
}

export default BinaryReader;