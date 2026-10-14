import React, { useState } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  Power,
  Zap,
  HelpCircle
} from 'lucide-react';
import { NavSidebar } from './NavSidebar';
import { ProgressPanel } from './panels/ProgressPanel';
import { TempPanel } from './panels/TempPanel';
import { MovePanel } from './panels/MovePanel';
import { FilesPanel } from './panels/FilesPanel';
import { MacrosPanel } from './panels/MacrosPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { PrinterSelectPanel } from './panels/PrinterSelectPanel';
import { StatsPanel } from './panels/StatsPanel';
import { TuningModal } from './modals/TuningModal';
import { NumericKeypadModal } from './modals/NumericKeypadModal';
import { 
  ActivePanel, 
  PrinterData, 
  PrinterConfiguration, 
  GlobalConfig, 
  GcodeFile, 
  MacroItem, 
  PowerDevice 
} from '../../types/printer';

interface CydDeviceFrameProps {
  printerData: PrinterData;
  activeConfig: PrinterConfiguration;
  allConfigs: PrinterConfiguration[];
  globalConfig: GlobalConfig;
  files: GcodeFile[];
  macros: MacroItem[];
  powerDevices: PowerDevice[];
  onUpdateGlobalConfig: (updated: Partial<GlobalConfig>) => void;
  onUpdatePrinterConfig: (updated: Partial<PrinterConfiguration>) => void;
  onSelectPrinter: (index: number) => void;
  onRenamePrinter: (index: number, newName: string) => void;
  onAddNewPrinter: () => void;
  onDeletePrinter: (index: number) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onEmergencyStop: () => void;
  onSetHotendTemp: (temp: number) => void;
  onSetBedTemp: (temp: number) => void;
  onCooldown: () => void;
  onExtrude: (amountMm: number) => void;
  onRetract: (amountMm: number) => void;
  onMoveAxis: (axis: 'X' | 'Y' | 'Z', amount: number, relative: boolean) => void;
  onHomeAxis: (axis?: 'X' | 'Y' | 'Z') => void;
  onDisableSteppers: () => void;
  onStartPrint: (filename: string) => void;
  onRunMacro: (macroName: string) => void;
  onTogglePowerDevice: (deviceName: string, state: boolean) => void;
  onSetFanSpeed: (fraction: number) => void;
  onAdjustZOffset: (deltaMm: number, absoluteZ?: number) => void;
  onSetSpeedMult: (fraction: number) => void;
  onSetFlowMult: (fraction: number) => void;
  onResetCalibration: () => void;
  onRestart: () => void;
}

export const CydDeviceFrame: React.FC<CydDeviceFrameProps> = ({
  printerData,
  activeConfig,
  allConfigs,
  globalConfig,
  files,
  macros,
  powerDevices,
  onUpdateGlobalConfig,
  onUpdatePrinterConfig,
  onSelectPrinter,
  onRenamePrinter,
  onAddNewPrinter,
  onDeletePrinter,
  onPause,
  onResume,
  onStop,
  onEmergencyStop,
  onSetHotendTemp,
  onSetBedTemp,
  onCooldown,
  onExtrude,
  onRetract,
  onMoveAxis,
  onHomeAxis,
  onDisableSteppers,
  onStartPrint,
  onRunMacro,
  onTogglePowerDevice,
  onSetFanSpeed,
  onAdjustZOffset,
  onSetSpeedMult,
  onSetFlowMult,
  onResetCalibration,
  onRestart,
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('progress');
  const [tuningModalType, setTuningModalType] = useState<'fan' | 'zoffset' | 'speed' | 'flow' | null>(null);
  const [keypadConfig, setKeypadConfig] = useState<{
    title: string;
    unit: string;
    initialValue: number;
    minValue: number;
    maxValue: number;
    allowDecimal?: boolean;
    onConfirm: (val: number) => void;
  } | null>(null);

  const [zoomScale, setZoomScale] = useState<number>(1.4); // 1x, 1.4x, 1.8x
  const [showHardwareBezel, setShowHardwareBezel] = useState<boolean>(true);

  // Keypad trigger helpers
  const handleOpenKeypad = (target: string, presetIndex?: number) => {
    switch (target) {
      case 'hotend':
        setKeypadConfig({
          title: 'Set Target Hotend Temp',
          unit: '°C',
          initialValue: printerData.target_temperatures.hotend,
          minValue: 0,
          maxValue: 320,
          onConfirm: (val) => onSetHotendTemp(val),
        });
        break;
      case 'bed':
        setKeypadConfig({
          title: 'Set Target Bed Temp',
          unit: '°C',
          initialValue: printerData.target_temperatures.bed,
          minValue: 0,
          maxValue: 140,
          onConfirm: (val) => onSetBedTemp(val),
        });
        break;
      case 'preset_hotend':
        if (presetIndex !== undefined) {
          setKeypadConfig({
            title: `Assign Hotend Preset #${presetIndex + 1}`,
            unit: '°C',
            initialValue: activeConfig.hotend_presets[presetIndex],
            minValue: 0,
            maxValue: 320,
            onConfirm: (val) => {
              const newPresets = [...activeConfig.hotend_presets] as [number, number, number];
              newPresets[presetIndex] = val;
              onUpdatePrinterConfig({ hotend_presets: newPresets });
            },
          });
        }
        break;
      case 'preset_bed':
        if (presetIndex !== undefined) {
          setKeypadConfig({
            title: `Assign Bed Preset #${presetIndex + 1}`,
            unit: '°C',
            initialValue: activeConfig.bed_presets[presetIndex],
            minValue: 0,
            maxValue: 140,
            onConfirm: (val) => {
              const newPresets = [...activeConfig.bed_presets] as [number, number, number];
              newPresets[presetIndex] = val;
              onUpdatePrinterConfig({ bed_presets: newPresets });
            },
          });
        }
        break;
      case 'x_pos':
        setKeypadConfig({
          title: 'Set Absolute X Position',
          unit: 'mm',
          initialValue: printerData.position[0],
          minValue: 0,
          maxValue: 400,
          allowDecimal: true,
          onConfirm: (val) => onMoveAxis('X', val, false),
        });
        break;
      case 'y_pos':
        setKeypadConfig({
          title: 'Set Absolute Y Position',
          unit: 'mm',
          initialValue: printerData.position[1],
          minValue: 0,
          maxValue: 400,
          allowDecimal: true,
          onConfirm: (val) => onMoveAxis('Y', val, false),
        });
        break;
      case 'z_pos':
        setKeypadConfig({
          title: 'Set Absolute Z Position',
          unit: 'mm',
          initialValue: printerData.position[2],
          minValue: 0,
          maxValue: 400,
          allowDecimal: true,
          onConfirm: (val) => onMoveAxis('Z', val, false),
        });
        break;
    }
  };

  const brightnessPercent = Math.max(0.3, globalConfig.brightness / 255);

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      
      {/* Device View Toolbar */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-4 px-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-200">Hardware Emulation:</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono">
            Freenove ESP32-S3 2.8" IPS (320×240)
          </span>
          <span className="hidden sm:inline text-zinc-500">• ST7789V2 SPI + FT6336U Capacitive Touch</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Bezel Toggle */}
          <button
            onClick={() => setShowHardwareBezel(!showHardwareBezel)}
            className={`px-2 py-1 rounded font-mono transition ${
              showHardwareBezel ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-900 text-zinc-500'
            }`}
          >
            {showHardwareBezel ? 'Bezel: On' : 'Bezel: Off'}
          </button>

          {/* Scale Buttons */}
          <div className="flex items-center bg-zinc-900 rounded p-0.5 border border-zinc-800">
            {[1.0, 1.4, 1.8].map((s) => (
              <button
                key={s}
                onClick={() => setZoomScale(s)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                  zoomScale === s ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hardware Device Container */}
      <div
        className="transition-all duration-200 flex items-center justify-center"
        style={{
          transform: `scale(${zoomScale})`,
          transformOrigin: 'top center',
          marginBottom: `${(zoomScale - 1) * 320}px`,
        }}
      >
        {/* Outer PCB / Acrylic Bezel */}
        <div
          className={`relative transition-all ${
            showHardwareBezel
              ? 'p-5 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black rounded-2xl shadow-2xl shadow-black/80 ring-1 ring-zinc-700/60 border-2 border-zinc-700/80'
              : 'p-0.5 bg-zinc-800 rounded-sm'
          }`}
        >
          {/* Top Silk Screen Labels & Hardware Elements on Bezel */}
          {showHardwareBezel && (
            <div className="flex items-center justify-between pb-2 px-1 text-[10px] font-mono text-zinc-400 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" title="ESP32-S3 Core 0/1 Online" />
                <span className="font-bold text-zinc-300">FREENOVE ESP32-S3</span>
                <span className="text-[8px] px-1 py-0.2 bg-zinc-700 rounded text-zinc-300">2.8" IPS</span>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-zinc-500">
                <span>RST</span>
                <span>BOOT</span>
                <span className="text-red-400 font-semibold">240 MHz</span>
              </div>
            </div>
          )}

          {/* THE 320x240 TOUCH SCREEN SURFACE */}
          <div
            className="w-[320px] h-[240px] bg-black rounded overflow-hidden shadow-inner flex relative touch-device-screen"
            style={{
              filter: activeConfig.invert_colors ? 'invert(1)' : 'none',
              opacity: brightnessPercent,
            }}
          >
            {/* Left Nav Strip (40px) */}
            <NavSidebar
              activePanel={activePanel}
              onSelectPanel={(panel) => setActivePanel(panel)}
              printerData={printerData}
              printerCount={allConfigs.length}
            />

            {/* Right Active Panel Content Area (280px) */}
            <div className="flex-1 h-full bg-black relative overflow-hidden">
              {activePanel === 'progress' && (
                <ProgressPanel
                  printerData={printerData}
                  printerConfig={activeConfig}
                  globalConfig={globalConfig}
                  onPause={onPause}
                  onResume={onResume}
                  onStop={onStop}
                  onEmergencyStop={onEmergencyStop}
                  onOpenTuning={(type) => setTuningModalType(type)}
                  onSwitchToStats={() => setActivePanel('stats')}
                />
              )}

              {activePanel === 'temp' && (
                <TempPanel
                  printerData={printerData}
                  printerConfig={activeConfig}
                  onSetHotendTemp={onSetHotendTemp}
                  onSetBedTemp={onSetBedTemp}
                  onCooldown={onCooldown}
                  onExtrude={onExtrude}
                  onRetract={onRetract}
                  onOpenKeypad={handleOpenKeypad}
                />
              )}

              {activePanel === 'move' && (
                <MovePanel
                  printerData={printerData}
                  printerConfig={activeConfig}
                  onMoveAxis={onMoveAxis}
                  onHomeAxis={onHomeAxis}
                  onDisableSteppers={onDisableSteppers}
                  onOpenKeypad={handleOpenKeypad}
                  onSwitchToStats={() => setActivePanel('stats')}
                />
              )}

              {activePanel === 'files' && (
                <FilesPanel
                  files={files}
                  globalConfig={globalConfig}
                  printerData={printerData}
                  onStartPrint={onStartPrint}
                />
              )}

              {activePanel === 'macros' && (
                <MacrosPanel
                  macros={macros}
                  powerDevices={powerDevices}
                  globalConfig={globalConfig}
                  onRunMacro={onRunMacro}
                  onTogglePowerDevice={onTogglePowerDevice}
                  onOpenSettings={() => setActivePanel('settings')}
                />
              )}

              {activePanel === 'settings' && (
                <SettingsPanel
                  globalConfig={globalConfig}
                  activeConfig={activeConfig}
                  onUpdateGlobalConfig={onUpdateGlobalConfig}
                  onUpdatePrinterConfig={onUpdatePrinterConfig}
                  onResetCalibration={onResetCalibration}
                  onRestart={onRestart}
                />
              )}

              {activePanel === 'printers' && (
                <PrinterSelectPanel
                  configs={allConfigs}
                  activeConfigIndex={globalConfig.printer_index}
                  onSelectPrinter={onSelectPrinter}
                  onRenamePrinter={onRenamePrinter}
                  onAddNewPrinter={onAddNewPrinter}
                  onDeletePrinter={onDeletePrinter}
                />
              )}

              {activePanel === 'stats' && (
                <StatsPanel
                  printerData={printerData}
                  printerConfig={activeConfig}
                  onOpenTuning={(type) => setTuningModalType(type)}
                  onBackToProgress={() => setActivePanel('progress')}
                />
              )}

              {/* Quick Tuning Matrix Popups */}
              {tuningModalType && (
                <TuningModal
                  type={tuningModalType}
                  printerData={printerData}
                  onClose={() => setTuningModalType(null)}
                  onSetFanSpeed={onSetFanSpeed}
                  onAdjustZOffset={onAdjustZOffset}
                  onSetSpeedMult={onSetSpeedMult}
                  onSetFlowMult={onSetFlowMult}
                />
              )}

              {/* Touch Keyboard / Keypad Modal */}
              {keypadConfig && (
                <NumericKeypadModal
                  title={keypadConfig.title}
                  unit={keypadConfig.unit}
                  initialValue={keypadConfig.initialValue}
                  minValue={keypadConfig.minValue}
                  maxValue={keypadConfig.maxValue}
                  allowDecimal={keypadConfig.allowDecimal}
                  onConfirm={keypadConfig.onConfirm}
                  onClose={() => setKeypadConfig(null)}
                />
              )}
            </div>
          </div>

          {/* Bottom Hardware Bezel Port Annotations */}
          {showHardwareBezel && (
            <div className="flex items-center justify-between pt-2 px-1 text-[9px] font-mono text-zinc-500 select-none">
              <span>USB-C UART (CH343)</span>
              <span className="text-zinc-400">MicroSD SPI</span>
              <span>USB-C OTG Native</span>
            </div>
          )}
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="mt-6 max-w-lg text-center text-xs text-zinc-500">
        <p>
          💡 <strong>Interactive Touch Screen:</strong> Tap sidebar icons to switch between Files, Progress, Jog/Move, Temp, Macros, and Settings. Tap temperature cards or X/Y/Z positions to open the on-screen numeric keypad.
        </p>
      </div>

    </div>
  );
};
