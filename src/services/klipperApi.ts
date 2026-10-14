import { PrinterData, PrinterState } from '../types/printer';

export class KlipperApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(host: string = '192.168.1.150', port: number = 7125, apiKey: string = '') {
    this.baseUrl = `http://${host}:${port}`;
    this.apiKey = apiKey;
  }

  public updateConfig(host: string, port: number, apiKey: string = '') {
    this.baseUrl = `http://${host}:${port}`;
    this.apiKey = apiKey;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 3000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };
    if (this.apiKey) {
      headers['X-Api-Key'] = this.apiKey;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/printer/info`, {}, 2500);
      return res.ok;
    } catch {
      return false;
    }
  }

  public async sendGcode(gcode: string): Promise<boolean> {
    try {
      const encoded = encodeURIComponent(gcode);
      const res = await this.fetchWithTimeout(`${this.baseUrl}/printer/gcode/script?script=${encoded}`, {
        method: 'POST',
      });
      return res.ok;
    } catch (err) {
      console.warn('G-code send failed:', err);
      return false;
    }
  }

  public async emergencyStop(): Promise<boolean> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/printer/emergency_stop`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async pausePrint(): Promise<boolean> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/printer/print/pause`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async resumePrint(): Promise<boolean> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/printer/print/resume`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async cancelPrint(): Promise<boolean> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/printer/print/cancel`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async setTemperature(device: 'hotend' | 'bed', temp: number): Promise<boolean> {
    const gcode = device === 'hotend' ? `M104 S${temp}` : `M140 S${temp}`;
    return this.sendGcode(gcode);
  }

  public async moveAxis(axis: 'X' | 'Y' | 'Z', amount: number, relative: boolean = true): Promise<boolean> {
    const gcode = relative
      ? `G91\nG1 ${axis}${amount > 0 ? '+' : ''}${amount} F6000\nG90`
      : `G90\nG1 ${axis}${amount} F6000`;
    return this.sendGcode(gcode);
  }
}
