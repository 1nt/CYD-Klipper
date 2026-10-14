// Web Serial API handler for ESP32 / Freenove CYD communication

export interface SerialLogEntry {
  id: string;
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'system';
  text: string;
}

export class WebSerialManager {
  private port: any = null;
  private reader: any = null;
  private writer: any = null;
  private isConnected: boolean = false;
  private onDataCallback: ((data: string) => void) | null = null;
  private onStatusChangeCallback: ((connected: boolean) => void) | null = null;

  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public setCallbacks(onData: (data: string) => void, onStatusChange: (connected: boolean) => void) {
    this.onDataCallback = onData;
    this.onStatusChangeCallback = onStatusChange;
  }

  public async connect(): Promise<boolean> {
    if (!WebSerialManager.isSupported()) {
      throw new Error('Web Serial API is not supported in this browser. Use Chrome, Edge, or Opera.');
    }

    try {
      // @ts-ignore
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 115200 });

      this.isConnected = true;
      if (this.onStatusChangeCallback) this.onStatusChangeCallback(true);

      this.startReading();
      return true;
    } catch (err: any) {
      console.warn('Serial connect error:', err);
      this.isConnected = false;
      if (this.onStatusChangeCallback) this.onStatusChangeCallback(false);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }
      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }
      if (this.port) {
        await this.port.close();
        this.port = null;
      }
    } catch (err) {
      console.warn('Disconnect error:', err);
    } finally {
      this.isConnected = false;
      if (this.onStatusChangeCallback) this.onStatusChangeCallback(false);
    }
  }

  public async send(text: string): Promise<boolean> {
    if (!this.isConnected || !this.port) return false;

    try {
      const encoder = new TextEncoder();
      const writer = this.port.writable.getWriter();
      await writer.write(encoder.encode(text + '\n'));
      writer.releaseLock();
      return true;
    } catch (err) {
      console.error('Serial write error:', err);
      return false;
    }
  }

  private async startReading() {
    while (this.port && this.port.readable && this.isConnected) {
      try {
        const textDecoder = new TextDecoderStream();
        // @ts-ignore
        const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        this.reader = reader;

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            reader.releaseLock();
            break;
          }
          if (value && this.onDataCallback) {
            this.onDataCallback(value);
          }
        }
      } catch (err) {
        console.warn('Serial read loop error:', err);
        break;
      }
    }
    this.isConnected = false;
    if (this.onStatusChangeCallback) this.onStatusChangeCallback(false);
  }
}
