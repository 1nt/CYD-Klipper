import React, { useState } from 'react';
import { 
  Flame, 
  ThermometerSnowflake, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { PrinterData, PrinterConfiguration, PrinterState } from '../../../types/printer';

interface TempPanelProps {
  printerData: PrinterData;
  printerConfig: PrinterConfiguration;
  onSetHotendTemp: (temp: number) => void;
  onSetBedTemp: (temp: number) => void;
  onCooldown: () => void;
  onExtrude: (amountMm: number) => void;
  onRetract: (amountMm: number) => void;
  onOpenKeypad: (target: 'hotend' | 'bed' | 'preset_hotend' | 'preset_bed', presetIndex?: number) => void;
}

export const TempPanel: React.FC<TempPanelProps> = ({
  printerData,
  printerConfig,
  onSetHotendTemp,
  onSetBedTemp,
  onCooldown,
  onExtrude,
  onRetract,
  onOpenKeypad,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [extrudeLength, setExtrudeLength] = useState<number>(10); // 5, 10, 50 mm

  const canExtrude = printerData.temperatures.hotend >= 175;
  const isPrinting = printerData.state === PrinterState.Printing;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white text-xs font-sans">
      
      {/* Top Header: Temperatures & Cooldown */}
      <div className="flex items-center justify-between gap-1 mb-1">
        
        {/* Hotend Card */}
        <button
          onClick={() => onOpenKeypad('hotend')}
          className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-red-500/50 rounded p-1.5 text-left transition active:scale-98"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 uppercase font-mono flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-500 fill-current" /> Hotend
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Set: <strong className="text-red-400 font-bold">{printerData.target_temperatures.hotend}°C</strong>
            </span>
          </div>
          <div className="text-base font-bold font-mono text-white mt-0.5">
            {printerData.temperatures.hotend.toFixed(1)}°C
          </div>
        </button>

        {/* Bed Card */}
        <button
          onClick={() => onOpenKeypad('bed')}
          className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded p-1.5 text-left transition active:scale-98"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 uppercase font-mono flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500 fill-current" /> Bed
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Set: <strong className="text-orange-400 font-bold">{printerData.target_temperatures.bed}°C</strong>
            </span>
          </div>
          <div className="text-base font-bold font-mono text-white mt-0.5">
            {printerData.temperatures.bed.toFixed(1)}°C
          </div>
        </button>

        {/* Cooldown Button */}
        <button
          onClick={onCooldown}
          disabled={isPrinting}
          className="h-full px-2 py-1.5 bg-blue-900/60 hover:bg-blue-800 active:bg-blue-950 border border-blue-700/50 rounded flex flex-col items-center justify-center text-blue-200 transition disabled:opacity-40"
          title="Cooldown (Heaters Off)"
        >
          <ThermometerSnowflake className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-mono uppercase font-bold">Cool</span>
        </button>

      </div>

      {/* Center Section: Presets Grid + Edit Mode Toggle */}
      <div className="flex-1 flex flex-col justify-center my-0.5 space-y-1">
        
        {/* Hotend Presets Row */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-zinc-400 w-11 uppercase">Hotend:</span>
          {printerConfig.hotend_presets.map((temp, idx) => (
            <button
              key={`he-preset-${idx}`}
              onClick={() => {
                if (isEditMode) {
                  onOpenKeypad('preset_hotend', idx);
                } else {
                  onSetHotendTemp(temp);
                }
              }}
              className={`flex-1 py-1 rounded font-mono text-xs font-semibold transition active:scale-95 border ${
                isEditMode
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200 animate-pulse'
                  : printerData.target_temperatures.hotend === temp
                  ? 'bg-red-600 border-red-500 text-white font-bold shadow'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
              }`}
            >
              {temp}°C
            </button>
          ))}
        </div>

        {/* Bed Presets Row */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-zinc-400 w-11 uppercase">Bed:</span>
          {printerConfig.bed_presets.map((temp, idx) => (
            <button
              key={`bed-preset-${idx}`}
              onClick={() => {
                if (isEditMode) {
                  onOpenKeypad('preset_bed', idx);
                } else {
                  onSetBedTemp(temp);
                }
              }}
              className={`flex-1 py-1 rounded font-mono text-xs font-semibold transition active:scale-95 border ${
                isEditMode
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200 animate-pulse'
                  : printerData.target_temperatures.bed === temp
                  ? 'bg-orange-600 border-orange-500 text-white font-bold shadow'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
              }`}
            >
              {temp}°C
            </button>
          ))}
        </div>

        {/* Presets Edit Toggle Bar */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[9px] text-zinc-400">
            {isEditMode ? 'Tap preset to reassign temperature' : 'Tap preset to activate'}
          </span>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition ${
              isEditMode ? 'bg-amber-600 text-black font-bold' : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditMode ? 'Done' : 'Edit Presets'}</span>
          </button>
        </div>

      </div>

      {/* Bottom Section: Extrude & Retract with Safety Check */}
      <div className="mt-1 pt-1 border-t border-zinc-800 flex items-center justify-between gap-1.5">
        
        {/* Length selector */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5">
          {[5, 10, 50].map((len) => (
            <button
              key={`len-${len}`}
              onClick={() => setExtrudeLength(len)}
              className={`px-1.5 py-1 text-[10px] font-mono rounded ${
                extrudeLength === len ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {len}mm
            </button>
          ))}
        </div>

        {/* Retract Button */}
        <button
          onClick={() => onRetract(extrudeLength)}
          disabled={!canExtrude || isPrinting}
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded font-mono font-bold text-xs shadow active:scale-95 transition ${
            !canExtrude || isPrinting
              ? 'bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-zinc-800'
              : 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-amber-300 border border-amber-600/50'
          }`}
          title={!canExtrude ? 'Cold extrusion prevented (Temp < 175°C)' : 'Retract filament'}
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Retract</span>
        </button>

        {/* Extrude Button */}
        <button
          onClick={() => onExtrude(extrudeLength)}
          disabled={!canExtrude || isPrinting}
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded font-mono font-bold text-xs shadow active:scale-95 transition ${
            !canExtrude || isPrinting
              ? 'bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-zinc-800'
              : 'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white border border-red-500'
          }`}
          title={!canExtrude ? 'Cold extrusion prevented (Temp < 175°C)' : 'Extrude filament'}
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Extrude</span>
        </button>

      </div>

      {/* Cold Extrusion Warning if hotend < 175C */}
      {!canExtrude && (
        <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-amber-400/90 font-mono">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>Extrusion locked below 175°C (Min Extrude Temp)</span>
        </div>
      )}

    </div>
  );
};
