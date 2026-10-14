import React from 'react';
import { 
  Sun, 
  RotateCcw, 
  Palette, 
  Eye, 
  Moon, 
  Check, 
  ShieldAlert, 
  Cpu, 
  Clock,
  Sparkles
} from 'lucide-react';
import { GlobalConfig, PrinterConfiguration } from '../../../types/printer';

interface SettingsPanelProps {
  globalConfig: GlobalConfig;
  activeConfig: PrinterConfiguration;
  onUpdateGlobalConfig: (updated: Partial<GlobalConfig>) => void;
  onUpdatePrinterConfig: (updated: Partial<PrinterConfiguration>) => void;
  onResetCalibration: () => void;
  onRestart: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  globalConfig,
  activeConfig,
  onUpdateGlobalConfig,
  onUpdatePrinterConfig,
  onResetCalibration,
  onRestart,
}) => {
  const colorSchemes = [
    { id: 0, name: 'Voron Red', hex: '#ef4444' },
    { id: 1, name: 'Prusa Orange', hex: '#f97316' },
    { id: 2, name: 'Bambu Green', hex: '#10b981' },
    { id: 3, name: 'Cyan Glow', hex: '#06b6d4' },
    { id: 4, name: 'Violet Neon', hex: '#8b5cf6' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white text-xs font-sans">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
        <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Screen &amp; System Settings</span>
        <span className="text-[9px] font-mono text-zinc-500">v7.2 (Freenove S3)</span>
      </div>

      {/* Main Settings List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar my-1 space-y-2 pr-1 text-[11px]">
        
        {/* Color Accent Scheme */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-1.5">
          <div className="text-[9px] font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1">
            <Palette className="w-3 h-3 text-red-400" />
            <span>Theme Accent Scheme</span>
          </div>
          <div className="flex items-center gap-1">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => onUpdatePrinterConfig({ color_scheme: scheme.id })}
                className={`flex-1 py-1 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 border transition ${
                  activeConfig.color_scheme === scheme.id
                    ? 'border-white text-white shadow'
                    : 'border-zinc-800 text-zinc-400 hover:text-white'
                }`}
                style={{ backgroundColor: `${scheme.hex}22`, borderColor: activeConfig.color_scheme === scheme.id ? scheme.hex : undefined }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scheme.hex }}></span>
                <span className="hidden sm:inline">{scheme.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Display Toggles */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-1.5 space-y-1.5">
          
          {/* Invert Colors (Crucial for ST7789 IPS Displays) */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-zinc-200">Invert Display Colors</span>
              <span className="block text-[9px] text-zinc-500">Required on ST7789 IPS for true blacks</span>
            </div>
            <button
              onClick={() => onUpdatePrinterConfig({ invert_colors: !activeConfig.invert_colors })}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                activeConfig.invert_colors ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {activeConfig.invert_colors ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Emergency Stop Button on Screen */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
            <div>
              <span className="font-mono text-zinc-200">Show Emergency Stop</span>
              <span className="block text-[9px] text-zinc-500">Big red M112 E-Stop button on progress view</span>
            </div>
            <button
              onClick={() => onUpdateGlobalConfig({ show_estop: !globalConfig.show_estop })}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                globalConfig.show_estop ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {globalConfig.show_estop ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Double Size G-Code Image */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
            <div>
              <span className="font-mono text-zinc-200">Double Size Thumbnail</span>
              <span className="block text-[9px] text-zinc-500">Zoom 32x32 thumbnails to 64x64</span>
            </div>
            <button
              onClick={() => onUpdateGlobalConfig({ double_size_gcode_img: !globalConfig.double_size_gcode_img })}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                globalConfig.double_size_gcode_img ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {globalConfig.double_size_gcode_img ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Sort Macros Alphabetically */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
            <div>
              <span className="font-mono text-zinc-200">Sort Macros A-Z</span>
              <span className="block text-[9px] text-zinc-500">Alphabetical ordering in macros list</span>
            </div>
            <button
              onClick={() => onUpdateGlobalConfig({ sort_macros: !globalConfig.sort_macros })}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                globalConfig.sort_macros ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {globalConfig.sort_macros ? 'ON' : 'OFF'}
            </button>
          </div>

        </div>

        {/* Brightness & Screen Timeout */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-1.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-zinc-300 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" /> Brightness:
            </span>
            <div className="flex items-center gap-1">
              {[255, 192, 128, 64].map((b, idx) => {
                const label = ['100%', '75%', '50%', '25%'][idx];
                return (
                  <button
                    key={b}
                    onClick={() => onUpdateGlobalConfig({ brightness: b })}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                      globalConfig.brightness === b ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hardware Reset / Calibration Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onResetCalibration}
            className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700 rounded text-zinc-300 font-mono text-[10px] flex items-center justify-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Calibration</span>
          </button>

          <button
            onClick={onRestart}
            className="flex-1 py-1.5 bg-red-950/80 hover:bg-red-900 active:bg-red-950 border border-red-800 text-red-200 font-mono text-[10px] flex items-center justify-center gap-1 transition"
          >
            <Cpu className="w-3 h-3 text-red-400" />
            <span>Soft Restart ESP32</span>
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="pt-1 border-t border-zinc-800 text-[9px] font-mono text-zinc-500 flex items-center justify-between">
        <span>Settings auto-saved to non-volatile flash NVS</span>
        <span>ESP32-S3 @ 240MHz</span>
      </div>

    </div>
  );
};
