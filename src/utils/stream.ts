export class DataInputStream {
  private dataView: DataView;
  private offset: number = 0;
  private littleEndian: boolean = true;

  constructor(arrayBuffer: ArrayBuffer, littleEndian: boolean = true) {
    this.dataView = new DataView(arrayBuffer);
    this.littleEndian = littleEndian;
  }

  readFloat64(): number {
    const value = this.dataView.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }

  readFloat32(): number {
    const value = this.dataView.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }

  readUint8(): number {
    const value = this.dataView.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  readUint16(): number {
    const value = this.dataView.getUint16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }

  readUint32(): number {
    const value = this.dataView.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }

  readInt32(): number {
    const value = this.dataView.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }

  readInt16(): number {
    const value = this.dataView.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }

  readInt8(): number {
    const value = this.dataView.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  readUint64(): bigint {
    const val = this.dataView.getBigUint64(this.offset, this.littleEndian);
    this.offset += 8;
    return val;
  }

  readInt64(): bigint {
    const val = this.dataView.getBigInt64(this.offset, this.littleEndian);
    this.offset += 8;
    return val;
  }

  readBoolean(): boolean {
    const value = this.readUint8();
    return value !== 0;
  }

  readUTF8(): string {
    let len = this.readUint16();
    const bytes = new Uint8Array(this.dataView.buffer, this.offset, len);
    this.offset += len;

    return this.decodeModifiedUtf8(bytes);
  }

  private decodeModifiedUtf8(bytes: Uint8Array): string {
    const codeUnits: number[] = [];
    let i = 0;

    while (i < bytes.length) {
      const b1 = bytes[i++];

      if ((b1 & 0x80) === 0) {
        // 1 字节：0x01 ~ 0x7F
        codeUnits.push(b1);
      } else if ((b1 & 0xe0) === 0xc0) {
        // 2 字节
        const b2 = bytes[i++];
        const cp = ((b1 & 0x1f) << 6) | (b2 & 0x3f);

        if (cp === 0) {
          // 0xC0 0x80 表示 \u0000
          codeUnits.push(0);
        } else {
          codeUnits.push(cp);
        }
      } else if ((b1 & 0xf0) === 0xe0) {
        // 3 字节
        const b2 = bytes[i++];
        const b3 = bytes[i++];
        const cp = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f);
        codeUnits.push(cp);
      } else {
        throw new Error(`Unsupported Modified UTF-8 byte: 0x${b1.toString(16)}`);
      }
    }

    return String.fromCharCode(...codeUnits);
  }
}

export class DataOutputStream {
  private buffer: ArrayBuffer;
  private dataView: DataView;
  private offset: number = 0;
  private littleEndian: boolean;

  constructor(initialCapacity = 256, littleEndian: boolean = true) {
    this.buffer = new ArrayBuffer(initialCapacity);
    this.dataView = new DataView(this.buffer);
    this.littleEndian = littleEndian;
  }

  private ensureCapacity(required: number) {
    const needed = this.offset + required;
    if (needed <= this.buffer.byteLength) return;

    let newCapacity = this.buffer.byteLength;
    while (newCapacity < needed) {
      newCapacity = Math.max(newCapacity * 2, 64);
    }

    const newBuffer = new ArrayBuffer(newCapacity);
    new Uint8Array(newBuffer).set(new Uint8Array(this.buffer, 0, this.offset));
    this.buffer = newBuffer;
    this.dataView = new DataView(this.buffer);
  }

  /** 获取当前已写入字节数 */
  get size(): number {
    return this.offset;
  }

  /** 获取已写入数据的 ArrayBuffer 副本 */
  toArrayBuffer(): ArrayBuffer {
    return this.buffer.slice(0, this.offset);
  }

  /** 获取已写入数据的 Uint8Array 视图 */
  toUint8Array(): Uint8Array {
    return new Uint8Array(this.buffer, 0, this.offset);
  }

  writeFloat32(value: number): void {
    this.ensureCapacity(4);
    this.dataView.setFloat32(this.offset, value, this.littleEndian);
    this.offset += 4;
  }

  writeFloat64(value: number): void {
    this.ensureCapacity(8);
    this.dataView.setFloat64(this.offset, value, this.littleEndian);
    this.offset += 8;
  }

  writeUint8(value: number): void {
    this.ensureCapacity(1);
    this.dataView.setUint8(this.offset, value);
    this.offset += 1;
  }

  writeUint16(value: number): void {
    this.ensureCapacity(2);
    this.dataView.setUint16(this.offset, value, this.littleEndian);
    this.offset += 2;
  }

  writeUint32(value: number): void {
    this.ensureCapacity(4);
    this.dataView.setUint32(this.offset, value, this.littleEndian);
    this.offset += 4;
  }

  writeInt8(value: number): void {
    this.ensureCapacity(1);
    this.dataView.setInt8(this.offset, value);
    this.offset += 1;
  }

  writeInt16(value: number): void {
    this.ensureCapacity(2);
    this.dataView.setInt16(this.offset, value, this.littleEndian);
    this.offset += 2;
  }

  writeInt32(value: number): void {
    this.ensureCapacity(4);
    this.dataView.setInt32(this.offset, value, this.littleEndian);
    this.offset += 4;
  }

  writeUint64(value: bigint): void {
    this.ensureCapacity(8);
    this.dataView.setBigUint64(this.offset, value, this.littleEndian);
    this.offset += 8;
  }

  writeInt64(value: bigint): void {
    this.ensureCapacity(8);
    this.dataView.setBigInt64(this.offset, value, this.littleEndian);
    this.offset += 8;
  }

  writeBoolean(value: boolean): void {
    this.writeUint8(value ? 1 : 0);
  }

  writeUTF8(value: string): void {
    const bytes = this.encodeModifiedUtf8(value);
    this.ensureCapacity(2 + bytes.length);
    this.dataView.setUint16(this.offset, bytes.length, false); // 长度头固定大端
    this.offset += 2;
    new Uint8Array(this.buffer, this.offset, bytes.length).set(bytes);
    this.offset += bytes.length;
  }

  private encodeModifiedUtf8(value: string): Uint8Array {
    const out: number[] = [];

    for (let i = 0; i < value.length; i++) {
      const cp = value.codePointAt(i)!;

      if (cp > 0xffff) {
        const high = 0xd800 + Math.floor((cp - 0x10000) / 0x400);
        const low = 0xdc00 + ((cp - 0x10000) % 0x400);
        this.encodeModifiedUtf8CodeUnit(high, out);
        this.encodeModifiedUtf8CodeUnit(low, out);
        i++; // 跳过代理对的低代理项
      } else {
        this.encodeModifiedUtf8CodeUnit(cp, out);
      }
    }

    return new Uint8Array(out);
  }

  private encodeModifiedUtf8CodeUnit(cp: number, out: number[]) {
    if (cp === 0) {
      // \u0000 → 0xC0 0x80
      out.push(0xc0, 0x80);
    } else if (cp <= 0x7f) {
      out.push(cp);
    } else if (cp <= 0x7ff) {
      out.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
    } else {
      out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    }
  }
}
