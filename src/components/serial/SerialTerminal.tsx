import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Send, 
  Trash2, 
  Usb, 
  Power, 
  Wifi, 
  HelpCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { WebSerialManager, SerialLogEntry } from '../../services/webSerial';
import { PrinterData, PrinterConfiguration, GlobalConfig } from '../../types/printer';

interface SerialTerminalProps {
  printerData: PrinterData;
  activeConfig: PrinterConfiguration;
  globalConfig: GlobalConfig;
  onUpdatePrinterConfig: (updated: Partial<PrinterConfiguration>) => void;
  onUpdateGlobalConfig: (updated: Partial<GlobalConfig>) => void;
  onExecuteGcode: (gcode: string) => void;
  onReboot: () => void;
}

export const SerialTerminal: React.FC<SerialTerminalProps> = ({
  printerData,
  activeConfig,
  globalConfig,
  onUpdatePrinterConfig,
  onUpdateGlobalConfig,
  onExecuteGcode,
  onReboot,
}) => {
  const [logs, setLogs] = useState<SerialLogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
      text: 'CYD-Klipper USB Serial Console initialized (115200 baud 8n1). Type "help" for available commands.',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'incoming',
      text: `[BOOT] ESP32-S3 Dual-Core 240MHz | Screen: 2.8" IPS ST7789 | Touch: FT6336U Capacitive`,
    },
    {
      id: '3',
      timestamp: new Date().toLocaleTimeString(),
      type: 'incoming',
      text: `[WIFI] Connected to SSID "${globalConfig.wifi_SSID || '3D_Printer_Net'}" | IP: 192.168.1.189`,
    },
  ]);

  const [inputCmd, setInputCmd] = useState('');
  const [isWebSerialConnected, setIsWebSerialConnected] = useState(false);
  const serialManagerRef = useRef<WebSerialManager | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const manager = new WebSerialManager();
    manager.setCallbacks(
      (data) => {
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            timestamp: new Date().toLocaleTimeString(),
            type: 'incoming',
            text: data.trim(),
          },
        ]);
      },
      (connected) => {
        setIsWebSerialConnected(connected);
      }
    );
    serialManagerRef.current = manager;

    return () => {
      manager.disconnect();
    };
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleConnectUsb = async () => {
    if (!serialManagerRef.current) return;
    if (isWebSerialConnected) {
      await serialManagerRef.current.disconnect();
      setIsWebSerialConnected(false);
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString(),
          type: 'system',
          text: 'USB Serial disconnected.',
        },
      ]);
    } else {
      try {
        const ok = await serialManagerRef.current.connect();
        if (ok) {
          setLogs((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              timestamp: new Date().toLocaleTimeString(),
              type: 'system',
              text: 'Connected to USB Serial port at 115200 baud.',
            },
          ]);
        }
      } catch (err: any) {
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            timestamp: new Date().toLocaleTimeString(),
            type: 'system',
            text: `Web Serial Error: ${err.message || 'Failed to open serial port'}`,
          },
        ]);
      }
    }
  };

  const handleSendCommand = (cmdToSend?: string) => {
    const cmd = (cmdToSend !== undefined ? cmdToSend : inputCmd).trim();
    if (!cmd) return;

    // Log outgoing
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'outgoing',
        text: `> ${cmd}`,
      },
    ]);

    // Send to physical USB if connected
    if (isWebSerialConnected && serialManagerRef.current) {
      serialManagerRef.current.send(cmd);
    }

    // Process command locally (exact CYD-Klipper serial command parser from serial_commands.cpp)
    processLocalCommand(cmd);

    setInputCmd('');
  };

  const processLocalCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let reply = '';

    if (base === 'help') {
      reply = `Available CYD-Klipper Serial Commands:
  help              - Display this command list
  ssid <name>       - Configure Wi-Fi network SSID
  pwd <pass>        - Configure Wi-Fi password
  ip <host>         - Configure Printer Hostname / IP (e.g. 192.168.1.150)
  port <port>       - Configure Moonraker / Printer port (e.g. 7125)
  key <token>       - Set Moonraker API Key / Bambu Access Code
  gcode <command>   - Send raw G-code command to printer (e.g. gcode G28)
  status            - Print live telemetry and temperature status
  screen            - Dump screen resolution and driver info
  restart / reboot  - Perform ESP32 software reboot`;
    } else if (base === 'status') {
      reply = `Printer: ${activeConfig.printer_name} (${activeConfig.printer_host}:${activeConfig.klipper_port})
State: ${printerData.state === 3 ? 'Printing' : printerData.state === 2 ? 'Idle' : 'Offline'}
Hotend: ${printerData.temperatures.hotend.toFixed(1)}C / Target: ${printerData.target_temperatures.hotend}C
Bed: ${printerData.temperatures.bed.toFixed(1)}C / Target: ${printerData.target_temperatures.bed}C
Progress: ${(printerData.print_progress * 100).toFixed(1)}% | Layer: ${printerData.current_layer}/${printerData.total_layers}
Pos: X:${printerData.position[0].toFixed(1)} Y:${printerData.position[1].toFixed(1)} Z:${printerData.position[2].toFixed(2)}`;
    } else if (base === 'screen') {
      reply = `Display: Freenove 2.8" IPS ST7789 | Res: 320x240 | Touch: FT6336U I2C | Rotation: 1`;
    } else if (base === 'ssid' && arg) {
      onUpdateGlobalConfig({ wifi_SSID: arg });
      reply = `Wi-Fi SSID updated to: "${arg}"`;
    } else if (base === 'ip' && arg) {
      onUpdatePrinterConfig({ printer_host: arg });
      reply = `Printer Host IP updated to: "${arg}"`;
    } else if (base === 'port' && arg) {
      const p = parseInt(arg);
      if (!isNaN(p)) {
        onUpdatePrinterConfig({ klipper_port: p });
        reply = `Printer Port updated to: ${p}`;
      } else {
        reply = `Invalid port number: "${arg}"`;
      }
    } else if (base === 'key' && arg) {
      onUpdatePrinterConfig({ printer_auth: arg });
      reply = `API Key / Auth token updated.`;
    } else if (base === 'gcode' && arg) {
      onExecuteGcode(arg);
      reply = `Dispatched G-code: "${arg}"`;
    } else if (base === 'restart' || base === 'reboot') {
      onReboot();
      reply = `Rebooting ESP32... [OK]`;
    } else {
      reply = `Unknown command: "${cmd}". Type "help" for command list.`;
    }

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString(),
          type: 'incoming',
          text: reply,
        },
      ]);
    }, 60);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Top Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-white text-lg flex items-center gap-2">
                <TerminalIcon className="w-5 h-5 text-blue-400" />
                <span>CYD-Klipper USB Serial Terminal</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                115200 8N1
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Interactive command-line interface for flashing, configuring Wi-Fi SSID, Moonraker IP, API keys, and debugging hardware. Connect to physical ESP32 via USB or interact with simulated firmware.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {WebSerialManager.isSupported() && (
              <button
                onClick={handleConnectUsb}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition active:scale-95 shadow ${
                  isWebSerialConnected
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                }`}
              >
                <Usb className="w-4 h-4" />
                <span>{isWebSerialConnected ? 'USB Connected (Disconnect)' : 'Connect Physical Device'}</span>
              </button>
            )}

            <button
              onClick={clearLogs}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
              title="Clear Terminal Output"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-zinc-800/80">
          <span className="text-zinc-500 text-[11px] font-mono mr-1">Quick Commands:</span>
          {['help', 'status', 'screen', 'gcode G28', 'gcode M106 S255', 'gcode M107', 'restart'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSendCommand(cmd)}
              className="px-2.5 py-1 rounded bg-zinc-800/90 hover:bg-zinc-700 active:bg-zinc-950 font-mono text-[11px] text-zinc-300 hover:text-white border border-zinc-700/60 transition active:scale-95"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Output Window */}
      <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[460px]">
        {/* Terminal Header */}
        <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="text-zinc-400 font-semibold ml-2">/dev/ttyUSB0 (115200)</span>
          </div>
          <span>{isWebSerialConnected ? 'Hardware Linked' : 'Simulated Serial'}</span>
        </div>

        {/* Terminal Logs */}
        <div
          ref={logContainerRef}
          className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs space-y-1.5 selection:bg-blue-500/30 selection:text-blue-200"
        >
          {logs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start gap-2 ${
                log.type === 'outgoing'
                  ? 'text-cyan-400 font-bold'
                  : log.type === 'system'
                  ? 'text-amber-400 italic'
                  : 'text-zinc-300'
              }`}
            >
              <span className="text-zinc-600 text-[10px] shrink-0 select-none">{log.timestamp}</span>
              <pre className="whitespace-pre-wrap break-all font-mono leading-relaxed">{log.text}</pre>
            </div>
          ))}
        </div>

        {/* Terminal Input Bar */}
        <div className="bg-zinc-950 border-t border-zinc-800/80 p-2 flex items-center gap-2">
          <span className="font-mono text-emerald-400 font-bold text-sm pl-2">&gt;</span>
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendCommand();
            }}
            placeholder="Type command (e.g. 'help', 'status', 'gcode G28', 'ip 192.168.1.150')..."
            className="flex-1 bg-transparent border-0 outline-none font-mono text-xs text-white placeholder-zinc-600"
            autoFocus
          />
          <button
            onClick={() => handleSendCommand()}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>

    </div>
  );
};
