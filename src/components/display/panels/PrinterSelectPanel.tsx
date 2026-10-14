import React, { useState } from 'react';
import { 
  Printer, 
  Wifi, 
  Plus, 
  CheckCircle, 
  Edit2, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { PrinterConfiguration, PrinterData, PrinterState, PrinterType } from '../../../types/printer';

interface PrinterSelectPanelProps {
  configs: PrinterConfiguration[];
  activeConfigIndex: number;
  onSelectPrinter: (index: number) => void;
  onRenamePrinter: (index: number, newName: string) => void;
  onAddNewPrinter: () => void;
  onDeletePrinter: (index: number) => void;
}

export const PrinterSelectPanel: React.FC<PrinterSelectPanelProps> = ({
  configs,
  activeConfigIndex,
  onSelectPrinter,
  onRenamePrinter,
  onAddNewPrinter,
  onDeletePrinter,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editNameText, setEditNameText] = useState('');

  const handleStartRename = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditNameText(currentName);
  };

  const handleSaveRename = (index: number) => {
    if (editNameText.trim()) {
      onRenamePrinter(index, editNameText.trim());
    }
    setEditingIndex(null);
  };

  const getTypeName = (type: PrinterType) => {
    switch (type) {
      case PrinterType.Klipper:
      case PrinterType.KlipperSerial:
        return 'Klipper';
      case PrinterType.BambuLocal:
        return 'Bambu Lab';
      case PrinterType.Octoprint:
        return 'OctoPrint';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white text-xs font-sans">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
        <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Multi-Printer Control Hub</span>
        <span className="text-[10px] font-mono text-zinc-500">{configs.length}/6 Printers</span>
      </div>

      {/* Printers List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar my-1 space-y-1.5 pr-1">
        {configs.map((printer, index) => {
          const isActive = index === activeConfigIndex;

          return (
            <div
              key={printer.id}
              className={`p-1.5 rounded border transition ${
                isActive
                  ? 'bg-zinc-900 border-red-500/80 shadow-md shadow-red-950/40'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
                  
                  {editingIndex === index ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editNameText}
                        onChange={(e) => setEditNameText(e.target.value)}
                        className="bg-black border border-red-500 rounded px-1.5 py-0.5 text-[11px] font-mono text-white w-28"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(index)}
                        className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px]"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono font-bold text-[11px] text-zinc-100 truncate">
                      {printer.printer_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[9px] font-mono px-1 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                    {getTypeName(printer.printer_type)}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-mono px-1 py-0.5 bg-red-600 text-white font-bold rounded">
                      IN CONTROL
                    </span>
                  )}
                </div>
              </div>

              {/* Host and action row */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mt-1">
                <span className="truncate pr-1">
                  {printer.printer_host}:{printer.klipper_port}
                </span>

                <div className="flex items-center gap-1">
                  {editingIndex !== index && (
                    <button
                      onClick={() => handleStartRename(index, printer.printer_name)}
                      className="p-1 hover:text-white text-zinc-400"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}

                  {!isActive ? (
                    <>
                      <button
                        onClick={() => onSelectPrinter(index)}
                        className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[10px] transition active:scale-95"
                      >
                        Switch Control
                      </button>
                      {configs.length > 1 && (
                        <button
                          onClick={() => onDeletePrinter(index)}
                          className="p-1 text-zinc-500 hover:text-red-400 transition"
                          title="Delete Printer Profile"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Printer Button */}
        {configs.length < 6 && (
          <button
            onClick={onAddNewPrinter}
            className="w-full py-1.5 border border-dashed border-zinc-700 hover:border-zinc-500 rounded text-zinc-400 hover:text-white font-mono text-[10px] flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-3 h-3" />
            <span>Add New Printer Profile</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="pt-1 border-t border-zinc-800 text-[9px] font-mono text-zinc-500 flex items-center justify-between">
        <span>CYD-Klipper allows instantaneous switching between 6 printers</span>
      </div>

    </div>
  );
};
