import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { CydDeviceFrame } from './components/display/CydDeviceFrame';
import { FreenoveCompilerGuide } from './components/freenove/FreenoveCompilerGuide';
import { SerialTerminal } from './components/serial/SerialTerminal';
import { LiveConnectionPanel } from './components/connection/LiveConnectionPanel';
import { 
  PrinterConfiguration, 
  PrinterData, 
  PrinterState, 
  PrinterType, 
  GlobalConfig, 
  GcodeFile, 
  MacroItem, 
  PowerDevice 
} from './types/printer';
import { 
  INITIAL_PRINTER_CONFIGS, 
  INITIAL_PRINTER_DATA, 
  SAMPLE_GCODE_FILES, 
  SAMPLE_MACROS, 
  SAMPLE_POWER_DEVICES 
} from './data/defaultPrinters';

export function App() {
  const [currentTab, setCurrentTab] = useState<'screen' | 'freenove' | 'serial' | 'connection'>('screen');
  const [printerConfigs, setPrinterConfigs] = useState<PrinterConfiguration[]>(() => {
    const saved = localStorage.getItem('cyd_printer_configs');
    return saved ? JSON.parse(saved) : INITIAL_PRINTER_CONFIGS;
  });

  const [activeConfigIndex, setActiveConfigIndex] = useState<number>(0);
  const [printerData, setPrinterData] = useState<PrinterData>(INITIAL_PRINTER_DATA);
  
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(() => {
    const saved = localStorage.getItem('cyd_global_config');
    return saved ? JSON.parse(saved) : {
      version: 7,
      rotate_screen: false,
      auto_ota_update: false,
      multi_printer_mode: true,
      on_during_print: true,
      display_mode: false,
      disable_m117_messaging: false,
      sort_macros: false,
      show_estop: true,
      full_filenames: false,
      double_size_gcode_img: true,
      wifi_SSID: 'CYD_Workshop_5G',
      brightness: 255,
      screen_timeout: 10,
      printer_index: 0,
    };
  });

  const [files, setFiles] = useState<GcodeFile[]>(SAMPLE_GCODE_FILES);
  const [macros, setMacros] = useState<MacroItem[]>(SAMPLE_MACROS);
  const [powerDevices, setPowerDevices] = useState<PowerDevice[]>(SAMPLE_POWER_DEVICES);

  const activeConfig = printerConfigs[activeConfigIndex] || printerConfigs[0];

  // Save configs to localStorage
  useEffect(() => {
    localStorage.setItem('cyd_printer_configs', JSON.stringify(printerConfigs));
  }, [printerConfigs]);

  useEffect(() => {
    localStorage.setItem('cyd_global_config', JSON.stringify(globalConfig));
  }, [globalConfig]);

  // Telemetry & PID Simulator Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setPrinterData((prev) => {
        let updated = { ...prev };

        // 1. Temperature PID Simulation towards target
        const hotendTarget = prev.target_temperatures.hotend;
        const bedTarget = prev.target_temperatures.bed;

        let newHotend = prev.temperatures.hotend;
        let newBed = prev.temperatures.bed;

        if (Math.abs(newHotend - hotendTarget) > 0.4) {
          const delta = (hotendTarget - newHotend) * 0.12;
          newHotend += delta;
        } else if (hotendTarget > 0) {
          // Stable PID noise +-0.2C
          newHotend = hotendTarget + (Math.random() * 0.4 - 0.2);
        } else {
          // Ambient cooling down towards 24C
          if (newHotend > 25) newHotend -= 0.5;
        }

        if (Math.abs(newBed - bedTarget) > 0.4) {
          const delta = (bedTarget - newBed) * 0.08;
          newBed += delta;
        } else if (bedTarget > 0) {
          newBed = bedTarget + (Math.random() * 0.2 - 0.1);
        } else {
          if (newBed > 24) newBed -= 0.3;
        }

        updated.temperatures = {
          ...prev.temperatures,
          hotend: Number(newHotend.toFixed(1)),
          bed: Number(newBed.toFixed(1)),
        };

        // 2. Active Printing Progress Tick
        if (prev.state === PrinterState.Printing) {
          const newElapsed = prev.elapsed_time_s + 1;
          const newRemaining = Math.max(0, prev.remaining_time_s - 1);
          const totalDuration = newElapsed + newRemaining;
          const newProgress = Math.min(1, newElapsed / totalDuration);
          const newLayer = Math.min(prev.total_layers, Math.floor(newProgress * prev.total_layers) + 1);

          // Simulated toolhead movement
          const newX = 150 + Math.sin(newElapsed * 0.5) * 40;
          const newY = 150 + Math.cos(newElapsed * 0.5) * 40;
          const newZ = (newLayer * 0.2);

          updated = {
            ...updated,
            elapsed_time_s: newElapsed,
            remaining_time_s: newRemaining,
            print_progress: newProgress,
            current_layer: newLayer,
            filament_used_mm: prev.filament_used_mm + 0.6,
            position: [Number(newX.toFixed(1)), Number(newY.toFixed(1)), Number(newZ.toFixed(2))],
          };

          if (newRemaining === 0) {
            updated.state = PrinterState.Idle;
            updated.state_message = 'Print completed successfully';
            updated.target_temperatures = { hotend: 0, bed: 0 };
          }
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleUpdateGlobalConfig = (updated: Partial<GlobalConfig>) => {
    setGlobalConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdatePrinterConfig = (updated: Partial<PrinterConfiguration>) => {
    setPrinterConfigs((prev) => {
      const copy = [...prev];
      copy[activeConfigIndex] = { ...copy[activeConfigIndex], ...updated };
      return copy;
    });
  };

  const handleSelectPrinter = (index: number) => {
    setActiveConfigIndex(index);
    setGlobalConfig((prev) => ({ ...prev, printer_index: index }));
  };

  const handleRenamePrinter = (index: number, newName: string) => {
    setPrinterConfigs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], printer_name: newName };
      return copy;
    });
  };

  const handleAddNewPrinter = () => {
    if (printerConfigs.length >= 6) return;
    const newIdx = printerConfigs.length + 1;
    const newConfig: PrinterConfiguration = {
      id: `printer-${Date.now()}`,
      printer_name: `Printer ${newIdx}`,
      printer_host: '192.168.1.100',
      printer_auth: '',
      klipper_port: 7125,
      printer_type: PrinterType.Klipper,
      light_mode: false,
      invert_colors: false,
      color_scheme: 0,
      remaining_time_calc_mode: 2,
      show_stats_on_progress_panel: 3,
      hotend_presets: [205, 220, 240],
      bed_presets: [55, 65, 80],
      printer_move_x_steps: [1, 10, 50],
      printer_move_y_steps: [1, 10, 50],
      printer_move_z_steps: [0.1, 1, 10],
    };
    setPrinterConfigs((prev) => [...prev, newConfig]);
  };

  const handleDeletePrinter = (index: number) => {
    if (printerConfigs.length <= 1) return;
    setPrinterConfigs((prev) => prev.filter((_, idx) => idx !== index));
    if (activeConfigIndex >= index && activeConfigIndex > 0) {
      setActiveConfigIndex(activeConfigIndex - 1);
    }
  };

  const handlePause = () => {
    setPrinterData((prev) => ({
      ...prev,
      state: PrinterState.Paused,
      state_message: 'Print paused by user',
    }));
  };

  const handleResume = () => {
    setPrinterData((prev) => ({
      ...prev,
      state: PrinterState.Printing,
      state_message: 'Printing resumed',
    }));
  };

  const handleStop = () => {
    setPrinterData((prev) => ({
      ...prev,
      state: PrinterState.Idle,
      state_message: 'Print cancelled by user',
      target_temperatures: { hotend: 0, bed: 0 },
    }));
  };

  const handleEmergencyStop = () => {
    setPrinterData((prev) => ({
      ...prev,
      state: PrinterState.Error,
      state_message: 'Emergency Stop M112 triggered! Steppers disabled, heaters shut down.',
      target_temperatures: { hotend: 0, bed: 0 },
      fan_speed: 0,
    }));
  };

  const handleSetHotendTemp = (temp: number) => {
    setPrinterData((prev) => ({
      ...prev,
      target_temperatures: { ...prev.target_temperatures, hotend: temp },
    }));
  };

  const handleSetBedTemp = (temp: number) => {
    setPrinterData((prev) => ({
      ...prev,
      target_temperatures: { ...prev.target_temperatures, bed: temp },
    }));
  };

  const handleCooldown = () => {
    setPrinterData((prev) => ({
      ...prev,
      target_temperatures: { hotend: 0, bed: 0 },
    }));
  };

  const handleExtrude = (amountMm: number) => {
    setPrinterData((prev) => ({
      ...prev,
      filament_used_mm: prev.filament_used_mm + amountMm,
    }));
  };

  const handleRetract = (amountMm: number) => {
    setPrinterData((prev) => ({
      ...prev,
      filament_used_mm: Math.max(0, prev.filament_used_mm - amountMm),
    }));
  };

  const handleMoveAxis = (axis: 'X' | 'Y' | 'Z', amount: number, relative: boolean) => {
    setPrinterData((prev) => {
      const pos = [...prev.position] as [number, number, number];
      const idx = axis === 'X' ? 0 : axis === 'Y' ? 1 : 2;
      pos[idx] = relative ? Math.max(0, pos[idx] + amount) : amount;
      return { ...prev, position: pos, homed_axis: true };
    });
  };

  const handleHomeAxis = (axis?: 'X' | 'Y' | 'Z') => {
    setPrinterData((prev) => {
      const pos = [...prev.position] as [number, number, number];
      if (!axis) {
        return { ...prev, position: [0, 0, 0], homed_axis: true };
      }
      if (axis === 'X') pos[0] = 0;
      if (axis === 'Y') pos[1] = 0;
      if (axis === 'Z') pos[2] = 0;
      return { ...prev, position: pos, homed_axis: true };
    });
  };

  const handleDisableSteppers = () => {
    setPrinterData((prev) => ({
      ...prev,
      homed_axis: false,
    }));
  };

  const handleStartPrint = (filename: string) => {
    const file = files.find((f) => f.filename === filename);
    const estDuration = file ? file.print_duration_est_s : 7200;

    setPrinterData((prev) => ({
      ...prev,
      state: PrinterState.Printing,
      print_filename: filename,
      elapsed_time_s: 0,
      printed_time_s: 0,
      remaining_time_s: estDuration,
      print_progress: 0,
      current_layer: 1,
      total_layers: 240,
      target_temperatures: { hotend: 220, bed: 60 },
      fan_speed: 0.5,
      speed_mult: 1.0,
      extrude_mult: 1.0,
      homed_axis: true,
    }));
  };

  const handleRunMacro = (macroName: string) => {
    if (macroName === 'G28_HOME_ALL') {
      handleHomeAxis();
    } else if (macroName === 'LOAD_FILAMENT_ABS') {
      handleSetHotendTemp(240);
    } else if (macroName === 'UNLOAD_FILAMENT') {
      handleCooldown();
    }
  };

  const handleTogglePowerDevice = (deviceName: string, state: boolean) => {
    setPowerDevices((prev) =>
      prev.map((d) => (d.name === deviceName ? { ...d, state } : d))
    );
  };

  const handleSetFanSpeed = (fraction: number) => {
    setPrinterData((prev) => ({ ...prev, fan_speed: fraction }));
  };

  const handleAdjustZOffset = (deltaMm: number, absoluteZ?: number) => {
    setPrinterData((prev) => {
      const newOffset = absoluteZ !== undefined ? absoluteZ : prev.z_offset + deltaMm;
      return { ...prev, z_offset: Number(newOffset.toFixed(3)) };
    });
  };

  const handleSetSpeedMult = (fraction: number) => {
    setPrinterData((prev) => ({ ...prev, speed_mult: fraction }));
  };

  const handleSetFlowMult = (fraction: number) => {
    setPrinterData((prev) => ({ ...prev, extrude_mult: fraction }));
  };

  const handleResetCalibration = () => {
    alert('Screen touch calibration reset to factory defaults.');
  };

  const handleRestart = () => {
    setPrinterData((prev) => ({
      ...prev,
      state: PrinterState.Idle,
      state_message: 'ESP32 rebooted',
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Top Navigation & Status Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        printerData={printerData}
        activeConfig={activeConfig}
        onEmergencyStop={handleEmergencyStop}
        showEstop={globalConfig.show_estop}
        onRestartSimulation={handleRestart}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'screen' && (
          <CydDeviceFrame
            printerData={printerData}
            activeConfig={activeConfig}
            allConfigs={printerConfigs}
            globalConfig={globalConfig}
            files={files}
            macros={macros}
            powerDevices={powerDevices}
            onUpdateGlobalConfig={handleUpdateGlobalConfig}
            onUpdatePrinterConfig={handleUpdatePrinterConfig}
            onSelectPrinter={handleSelectPrinter}
            onRenamePrinter={handleRenamePrinter}
            onAddNewPrinter={handleAddNewPrinter}
            onDeletePrinter={handleDeletePrinter}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            onEmergencyStop={handleEmergencyStop}
            onSetHotendTemp={handleSetHotendTemp}
            onSetBedTemp={handleSetBedTemp}
            onCooldown={handleCooldown}
            onExtrude={handleExtrude}
            onRetract={handleRetract}
            onMoveAxis={handleMoveAxis}
            onHomeAxis={handleHomeAxis}
            onDisableSteppers={handleDisableSteppers}
            onStartPrint={handleStartPrint}
            onRunMacro={handleRunMacro}
            onTogglePowerDevice={handleTogglePowerDevice}
            onSetFanSpeed={handleSetFanSpeed}
            onAdjustZOffset={handleAdjustZOffset}
            onSetSpeedMult={handleSetSpeedMult}
            onSetFlowMult={handleSetFlowMult}
            onResetCalibration={handleResetCalibration}
            onRestart={handleRestart}
          />
        )}

        {currentTab === 'freenove' && (
          <FreenoveCompilerGuide />
        )}

        {currentTab === 'serial' && (
          <SerialTerminal
            printerData={printerData}
            activeConfig={activeConfig}
            globalConfig={globalConfig}
            onUpdatePrinterConfig={handleUpdatePrinterConfig}
            onUpdateGlobalConfig={handleUpdateGlobalConfig}
            onExecuteGcode={(gcode) => {
              if (gcode.startsWith('G28')) handleHomeAxis();
              else if (gcode.startsWith('M112')) handleEmergencyStop();
              else if (gcode.startsWith('M104') || gcode.startsWith('M109')) {
                const match = gcode.match(/S(\d+)/);
                if (match) handleSetHotendTemp(parseInt(match[1]));
              } else if (gcode.startsWith('M140') || gcode.startsWith('M190')) {
                const match = gcode.match(/S(\d+)/);
                if (match) handleSetBedTemp(parseInt(match[1]));
              }
            }}
            onReboot={handleRestart}
          />
        )}

        {currentTab === 'connection' && (
          <LiveConnectionPanel
            activeConfig={activeConfig}
            onUpdatePrinterConfig={handleUpdatePrinterConfig}
            onConnectSuccess={() => setCurrentTab('screen')}
          />
        )}
      </main>

    </div>
  );
}
export default App;
