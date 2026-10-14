import React, { useState } from 'react';
import { 
  FileText, 
  Play, 
  X, 
  Clock, 
  HardDrive, 
  CheckCircle,
  Eye
} from 'lucide-react';
import { GcodeFile, GlobalConfig, PrinterData, PrinterState } from '../../../types/printer';

interface FilesPanelProps {
  files: GcodeFile[];
  globalConfig: GlobalConfig;
  printerData: PrinterData;
  onStartPrint: (filename: string) => void;
}

export const FilesPanel: React.FC<FilesPanelProps> = ({
  files,
  globalConfig,
  printerData,
  onStartPrint,
}) => {
  const [selectedFile, setSelectedFile] = useState<GcodeFile | null>(null);

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const isPrinting = printerData.state === PrinterState.Printing;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white text-xs font-sans">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
        <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Available G-Code Files</span>
        <span className="text-[10px] font-mono text-zinc-500">{files.length} items</span>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar my-1 space-y-1 pr-1">
        {files.map((file) => (
          <button
            key={file.filename}
            onClick={() => setSelectedFile(file)}
            className="w-full text-left p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between gap-2 transition active:scale-99 group"
          >
            <div className="flex items-center gap-2 min-w-0">
              {/* Simulated 32x32 Thumbnail Box */}
              <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-700/60 flex items-center justify-center shrink-0 overflow-hidden text-red-500 group-hover:text-red-400">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className={`font-mono text-[11px] text-zinc-200 truncate ${globalConfig.full_filenames ? 'whitespace-normal' : ''}`}>
                  {file.filename}
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 mt-0.5">
                  <span>{(file.size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
                  <span>•</span>
                  <span>{formatSeconds(file.print_duration_est_s)}</span>
                  <span>•</span>
                  <span>{(file.filament_total_mm / 1000).toFixed(1)}m</span>
                </div>
              </div>
            </div>

            <div className="p-1 rounded bg-zinc-800 group-hover:bg-red-600 text-zinc-400 group-hover:text-white transition shrink-0">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </button>
        ))}
      </div>

      {/* Bottom status */}
      <div className="pt-1 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-zinc-500">
        <span>Tap any file to preview and start print</span>
        {isPrinting && <span className="text-amber-400">Printer currently busy</span>}
      </div>

      {/* Print Confirmation Modal Popup (matching CYD-Klipper btn_print_file_verify) */}
      {selectedFile && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 p-2 flex flex-col justify-between border border-zinc-700 rounded-sm">
          
          <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
            <span className="font-mono font-bold text-xs uppercase text-zinc-200">Start Print Confirmation</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-auto flex items-center gap-3 p-1">
            {/* Double Size Thumbnail or 32x32 */}
            <div className={`${globalConfig.double_size_gcode_img ? 'w-16 h-16' : 'w-12 h-12'} bg-zinc-900 border border-red-500/40 rounded flex flex-col items-center justify-center shrink-0 shadow-lg`}>
              <FileText className="w-6 h-6 text-red-500" />
              <span className="text-[8px] font-mono text-zinc-500 mt-0.5">GCODE</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-mono font-bold text-xs text-white break-words line-clamp-2">
                {selectedFile.filename}
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1 text-[10px] font-mono text-zinc-400">
                <div>Est. Time: <strong className="text-zinc-200">{formatSeconds(selectedFile.print_duration_est_s)}</strong></div>
                <div>Filament: <strong className="text-zinc-200">{(selectedFile.filament_total_mm / 1000).toFixed(1)}m</strong></div>
                <div>File Size: <strong className="text-zinc-200">{(selectedFile.size_bytes / (1024 * 1024)).toFixed(1)} MB</strong></div>
                <div>Date: <strong className="text-zinc-200">{selectedFile.modified}</strong></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
            <button
              onClick={() => setSelectedFile(null)}
              className="flex-1 py-2 rounded bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-300 font-mono text-xs flex items-center justify-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            <button
              onClick={() => {
                onStartPrint(selectedFile.filename);
                setSelectedFile(null);
              }}
              disabled={isPrinting}
              className={`flex-1 py-2 rounded font-mono font-bold text-xs flex items-center justify-center gap-1 shadow transition active:scale-95 ${
                isPrinting
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPrinting ? 'Printer Busy' : 'Start Print'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
