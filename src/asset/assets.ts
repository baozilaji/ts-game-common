import { DataInputStream } from '../utils/stream';

export class BinaryAssets {
  constructor() {}

  static async loadFromUrl(url: string): Promise<DataInputStream> {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Failed to load binary asset from ${url}`);
    }
    const buffer = await resp.arrayBuffer();
    return new DataInputStream(buffer, false);
  }
}
