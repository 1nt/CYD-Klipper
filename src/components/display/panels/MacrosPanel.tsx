import React from 'react';
import { 
  Settings, 
  Zap, 
  Power, 
  TerminalSquare, 
  Play, 
  ChevronRight 
} from 'lucide-react';
import { MacroItem, PowerDevice, GlobalConfig } from '../../../types/printer';

interface MacrosPanelProps {
  macros: MacroItem[];
  powerDevices: PowerDevice[];
  globalConfig: GlobalConfig;
  onRunMacro: (macroName: string) => void;
  onTogglePowerDevice: (deviceName: string, state: boolean) => void;
  onOpenSettings: () => void;
}

export const MacrosPanel: React.FC<MacrosPanelProps> = ({
  macros,
  powerDevices,
  globalConfig,
  onRunMacro,
  onTogglePowerDevice,
  onOpenSettings,
}) => {
  const sortedMacros = globalConfig.sort_macros
    ? [...macros].sort((a, b) => a.name.localeCompare(b.name))
    : macros;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white text-xs font-sans">
      
      {/* Top Bar: Settings Button */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
        <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Macros &amp; Power</span>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700 rounded text-[10px] font-mono text-zinc-200 transition"
        >
          <Settings className="w-3 h-3 text-red-400" />
          <span>Screen Settings</span>
        </button>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar my-1 space-y-2 pr-1">
        
        {/* Power Devices Section */}
        {powerDevices.length > 0 && (
          <div>
            <div className="text-[9px] font-mono uppercase text-zinc-500 mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Moonraker Power Devices</span>
            </div>
            <div className="space-y-1">
              {powerDevices.map((device) => (
                <div
                  key={device.name}
                  className="flex items-center justify-between p-1.5 rounded bg-zinc-900 border border-zinc-800/80"
                >
                  <span className="font-mono text-[11px] text-zinc-200 truncate pr-2">
                    {device.name}
                  </span>
                  <button
                    onClick={() => onTogglePowerDevice(device.name, !device.state)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-bold transition active:scale-95 ${
                      device.state
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{device.state ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* G-Code Macros Section */}
        <div>
          <div className="text-[9px] font-mono uppercase text-zinc-500 mb-1 flex items-center gap-1">
            <TerminalSquare className="w-3 h-3 text-red-400" />
            <span>Klipper G-Code Macros</span>
          </div>
          <div className="space-y-1">
            {sortedMacros.map((macro) => (
              <div
                key={macro.name}
                className="flex items-center justify-between p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-mono font-bold text-[11px] text-zinc-200 truncate">
                    {macro.name}
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate">
                    {macro.description.replace('CYD_SCREEN_MACRO:', '')}
                  </div>
                </div>

                <button
                  onClick={() => onRunMacro(macro.name)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-mono font-bold text-[10px] rounded shadow transition active:scale-95 flex items-center gap-1 shrink-0"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Run</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Hint */}
      <div className="pt-1 border-t border-zinc-800 text-[9px] font-mono text-zinc-500 flex items-center justify-between">
        <span>G-Code macros defined with CYD_SCREEN_MACRO</span>
        <span>{sortedMacros.length} macros</span>
      </div>

    </div>
  );
};
