import React from 'react';
import { 
  FolderOpen, 
  Clock, 
  Move, 
  Flame, 
  Sliders, 
  Printer as PrinterIcon 
} from 'lucide-react';
import { ActivePanel, PrinterData, PrinterState } from '../../types/printer';

interface NavSidebarProps {
  activePanel: ActivePanel;
  onSelectPanel: (panel: ActivePanel) => void;
  printerData: PrinterData;
  printerCount: number;
}

export const NavSidebar: React.FC<NavSidebarProps> = ({
  activePanel,
  onSelectPanel,
  printerData,
  printerCount,
}) => {
  // Format remaining time exactly like update_printer_data_time in nav_buttons.cpp
  const formatTimeLabel = () => {
    if (printerData.state === PrinterState.Idle) return 'Idle';
    if (printerData.state === PrinterState.Paused) return 'Paused';
    if (printerData.state === PrinterState.Error) return 'Err';
    if (printerData.state === PrinterState.Offline) return 'Off';

    const time = printerData.remaining_time_s;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);

    if (hours >= 10) return `${hours}h`;
    if (hours >= 1) return `${hours}h${minutes < 10 ? '0' : ''}${minutes}m`;
    return `${minutes}m`;
  };

  // Format Z position e.g. Z28.4
  const formatZLabel = () => {
    return `Z${printerData.position[2].toFixed(1)}`;
  };

  // Format Temp label e.g. 245/105
  const formatTempLabel = () => {
    return `${Math.round(printerData.temperatures.hotend)}/${Math.round(printerData.temperatures.bed)}`;
  };

  return (
    <div className="w-[58px] sm:w-[62px] h-full bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between py-1 select-none shrink-0 z-10">
      
      {/* 1. Files Button */}
      <button
        onClick={() => onSelectPanel('files')}
        className={`flex flex-col items-center justify-center h-[36px] w-[52px] sm:w-[56px] mx-auto rounded transition active:scale-95 text-center ${
          activePanel === 'files'
            ? 'bg-red-600 text-white font-bold'
            : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-white'
        }`}
      >
        <FolderOpen className="w-4 h-4 mb-0.5" />
        <span className="text-[9px] leading-none uppercase font-mono tracking-tighter">Files</span>
      </button>

      {/* 2. Progress / Status Button */}
      <button
        onClick={() => onSelectPanel('progress')}
        className={`flex flex-col items-center justify-center h-[36px] w-[52px] sm:w-[56px] mx-auto rounded transition active:scale-95 text-center ${
          activePanel === 'progress'
            ? 'bg-red-600 text-white font-bold'
            : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-white'
        }`}
      >
        <Clock className="w-3.5 h-3.5 mb-0.5" />
        <span className="text-[9px] leading-none font-mono font-medium truncate max-w-[50px]">
          {formatTimeLabel()}
        </span>
      </button>

      {/* 3. Move / Jog Button */}
      <button
        onClick={() => onSelectPanel('move')}
        className={`flex flex-col items-center justify-center h-[36px] w-[52px] sm:w-[56px] mx-auto rounded transition active:scale-95 text-center ${
          activePanel === 'move'
            ? 'bg-red-600 text-white font-bold'
            : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-white'
        }`}
      >
        <Move className="w-3.5 h-3.5 mb-0.5" />
        <span className="text-[9px] leading-none font-mono font-medium truncate max-w-[50px]">
          {formatZLabel()}
        </span>
      </button>

      {/* 4. Temperature / Extrude Button */}
      <button
        onClick={() => onSelectPanel('temp')}
        className={`flex flex-col items-center justify-center h-[36px] w-[52px] sm:w-[56px] mx-auto rounded transition active:scale-95 text-center ${
          activePanel === 'temp'
            ? 'bg-red-600 text-white font-bold'
            : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-white'
        }`}
      >
        <Flame className="w-3.5 h-3.5 mb-0.5" />
        <span className="text-[9px] leading-none font-mono font-medium truncate max-w-[50px]">
          {formatTempLabel()}
        </span>
      </button>

      {/* 5. Settings / Macros Button */}
      <button
        onClick={() => onSelectPanel('macros')}
        className={`flex flex-col items-center justify-center h-[36px] w-[52px] sm:w-[56px] mx-auto rounded transition active:scale-95 text-center ${
          activePanel === 'macros' || activePanel === 'settings'
            ? 'bg-red-600 text-white font-bold'
            : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-white'
        }`}
      >
        <Sliders className="w-3.5 h-3.5 mb-0.5" />
        <span className="text-[9px] leading-none uppercase font-mono tracking-tighter">Macros</span>
      </button>

      {/* 6. Multi-Printer Switcher Button */}
      <button
        onClick={() => onSelectPanel('printers')}
        className={`flex flex-col items-center justify-center h-[36px] w-[52px] sm:w-[56px] mx-auto rounded transition active:scale-95 text-center ${
          activePanel === 'printers'
            ? 'bg-red-600 text-white font-bold'
            : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-white'
        }`}
      >
        <PrinterIcon className="w-3.5 h-3.5 mb-0.5" />
        <span className="text-[9px] leading-none font-mono font-medium truncate max-w-[50px]">
          {printerCount > 1 ? `${printerCount} Hub` : 'Printer'}
        </span>
      </button>

    </div>
  );
};
