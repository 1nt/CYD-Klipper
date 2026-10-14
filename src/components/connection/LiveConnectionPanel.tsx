import React, { useState } from 'react';
import { 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Radio, 
  Key, 
  ShieldCheck, 
  Terminal,
  Zap,
  Globe
} from 'lucide-react';
import { PrinterConfiguration, PrinterType } from '../../types/printer';
import { KlipperApiClient } from '../../services/klipperApi';

interface LiveConnectionPanelProps {
  activeConfig: PrinterConfiguration;
  onUpdatePrinterConfig: (updated: Partial<PrinterConfiguration>) => void;
  onConnectSuccess?: () => void;
}

export const LiveConnectionPanel: React.FC<LiveConnectionPanelProps> = ({
  activeConfig,
  onUpdatePrinterConfig,
  onConnectSuccess,
}) => {
  const [hostInput, setHostInput] = useState(activeConfig.printer_host);
  const [portInput, setPortInput] = useState(String(activeConfig.klipper_port));
  const [authInput, setAuthInput] = useState(activeConfig.printer_auth);
  const [typeInput, setTypeInput] = useState<PrinterType>(activeConfig.printer_type);
  const [isChecking, setIsChecking] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    setIsChecking(true);
    setTestResult(null);

    const client = new KlipperApiClient(hostInput, parseInt(portInput) || 7125, authInput);
    try {
      const ok = await client.checkConnection();
      if (ok) {
        setTestResult({
          ok: true,
          message: `Connected successfully to Moonraker at ${hostInput}:${portInput}! Printer is online.`,
        });
        onUpdatePrinterConfig({
          printer_host: hostInput,
          klipper_port: parseInt(portInput) || 7125,
          printer_auth: authInput,
          printer_type: typeInput,
        });
        if (onConnectSuccess) onConnectSuccess();
      } else {
        setTestResult({
          ok: false,
          message: `Unable to reach ${hostInput}:${portInput}. Check that Moonraker is running and CORS allows web clients (or use the simulated mock mode).`,
        });
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: `Connection error: ${err.message || 'Host unreachable or CORS restricted'}`,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveOnly = () => {
    onUpdatePrinterConfig({
      printer_host: hostInput,
      klipper_port: parseInt(portInput) || 7125,
      printer_auth: authInput,
      printer_type: typeInput,
    });
    setTestResult({
      ok: true,
      message: `Settings saved for printer profile "${activeConfig.printer_name}".`,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Moonraker / 3D Printer Network Settings</h2>
            <p className="text-xs text-zinc-400">
              Link the CYD-Klipper application directly to your physical 3D printer running Klipper (Moonraker), Bambu Lab, or OctoPrint.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          
          {/* Printer Firmware Type */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
              Printer Firmware Protocol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: PrinterType.Klipper, label: 'Klipper / Moonraker', desc: 'Port 7125 default' },
                { type: PrinterType.BambuLocal, label: 'Bambu Lab Local', desc: 'MQTT / HTTP port 8883' },
                { type: PrinterType.Octoprint, label: 'OctoPrint', desc: 'REST API port 5000' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setTypeInput(item.type)}
                  className={`p-3 rounded-xl border text-left transition ${
                    typeInput === item.type
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-950/30'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-bold text-xs font-mono">{item.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Host & Port Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">
                Printer IP / Hostname
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={hostInput}
                  onChange={(e) => setHostInput(e.target.value)}
                  placeholder="e.g. 192.168.1.150 or voron.local"
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:border-purple-500 outline-none"
                />
                <Globe className="w-4 h-4 text-zinc-500 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">
                Port
              </label>
              <input
                type="number"
                value={portInput}
                onChange={(e) => setPortInput(e.target.value)}
                placeholder="7125"
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          {/* API Key / Token */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1">
              API Key / Auth Token (Optional for trusted LANs)
            </label>
            <div className="relative">
              <input
                type="password"
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                placeholder="Paste Moonraker API key or Bambu access code if auth is required"
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:border-purple-500 outline-none"
              />
              <Key className="w-4 h-4 text-zinc-500 absolute right-3 top-2.5" />
            </div>
          </div>

        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`mt-4 p-3 rounded-xl border flex items-start gap-2.5 text-xs font-mono ${
              testResult.ok
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/60 text-amber-300'
            }`}
          >
            {testResult.ok ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            )}
            <p className="leading-relaxed">{testResult.message}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-zinc-800">
          <button
            onClick={handleTestConnection}
            disabled={isChecking}
            className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95 transition disabled:opacity-50"
          >
            {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
            <span>{isChecking ? 'Checking Connection...' : 'Test Connection'}</span>
          </button>

          <button
            onClick={handleSaveOnly}
            className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium border border-zinc-700 active:scale-95 transition"
          >
            Save Configuration
          </button>
        </div>

      </div>

    </div>
  );
};
