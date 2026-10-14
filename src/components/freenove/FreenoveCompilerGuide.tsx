import React, { useState } from 'react';
import { 
  Cpu, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  BookOpen, 
  Layers, 
  Zap, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  Code2,
  FileCode
} from 'lucide-react';
import { 
  FREENOVE_ESP32_S3_SPECS, 
  FREENOVE_PINOUT, 
  PLATFORMIO_INI_FREENOVE_SNIPPET, 
  FREENOVE_BOARD_JSON, 
  AI_LVGL_TUTORIAL_SECTIONS 
} from '../../data/freenoveEsp32s3Config';

export const FreenoveCompilerGuide: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'build' | 'pinout' | 'tutorial' | 'board_json'>('build');
  const [copiedIni, setCopiedIni] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyIni = () => {
    navigator.clipboard.writeText(PLATFORMIO_INI_FREENOVE_SNIPPET);
    setCopiedIni(true);
    setTimeout(() => setCopiedIni(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(FREENOVE_BOARD_JSON);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cliCommands = `# 1. Download / Clone CYD-Klipper
git clone https://github.com/suchmememanyskill/CYD-Klipper.git
cd CYD-Klipper

# 2. Add the Freenove ESP32-S3 2.8" env to platformio.ini (snippet below)
# and place esp32-s3-freenove-28c.json into boards/ folder

# 3. Compile firmware
pio run -e freenove-esp32-s3-28

# 4. Connect Freenove ESP32-S3 via USB-C (CH343 port) and Flash
pio run -e freenove-esp32-s3-28 -t upload

# 5. Open Serial Monitor (115200 baud)
pio device monitor -b 115200`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommands);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Hero Board Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-amber-950/30 to-zinc-900 border border-amber-500/30 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Dual-core 32-bit 240 MHz + AI Acceleration
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300">
                ESP32-S3-WROOM-1
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {FREENOVE_ESP32_S3_SPECS.boardName}
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Targeted compilation configuration, hardware pinout mappings, PlatformIO build flags, and comprehensive AI LVGL tutorial for running CYD-Klipper on the 2.8" IPS Capacitive Touch display.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={handleCopyIni}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition"
            >
              {copiedIni ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedIni ? 'Copied Config!' : 'Copy PlatformIO Config'}</span>
            </button>

            <button
              onClick={() => downloadFile('freenove-platformio-env.ini', PLATFORMIO_INI_FREENOVE_SNIPPET)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 active:scale-95 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download .ini Snippet</span>
            </button>
          </div>
        </div>

        {/* Board Key Specs Quick Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80 font-mono text-xs">
          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 text-[10px] uppercase block">Processor / Clock</span>
            <span className="text-zinc-200 font-bold">Dual-core LX7 @ 240MHz</span>
          </div>
          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 text-[10px] uppercase block">Display &amp; Driver</span>
            <span className="text-zinc-200 font-bold">2.8" IPS (ST7789 SPI)</span>
          </div>
          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 text-[10px] uppercase block">Touch Screen</span>
            <span className="text-zinc-200 font-bold">Capacitive (FT6336U I2C)</span>
          </div>
          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 text-[10px] uppercase block">RAM / Storage</span>
            <span className="text-zinc-200 font-bold">8MB PSRAM / 16MB Flash</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
        <button
          onClick={() => setActiveSubTab('build')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeSubTab === 'build'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>PlatformIO Build &amp; Compile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pinout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeSubTab === 'pinout'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Hardware Pinout Table</span>
        </button>

        <button
          onClick={() => setActiveSubTab('board_json')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeSubTab === 'board_json'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Board JSON (boards/)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tutorial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeSubTab === 'tutorial'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>AI LVGL Tutorial</span>
        </button>
      </div>

      {/* TAB 1: BUILD & COMPILATION */}
      {activeSubTab === 'build' && (
        <div className="space-y-6">
          
          {/* Quick Step Guide */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              <span>Compilation &amp; Upload Commands</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-3">
              Run these commands in your terminal or inside VS Code with the PlatformIO extension installed:
            </p>
            <div className="relative">
              <pre className="bg-black border border-zinc-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                {cliCommands}
              </pre>
              <button
                onClick={handleCopyCli}
                className="absolute top-3 right-3 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-1.5 border border-zinc-700"
              >
                {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCli ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* platformio.ini Snippet */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-400" />
                  <span>platformio.ini Configuration Snippet</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Append this environment block to <code className="text-amber-300 font-mono">CYD-Klipper/platformio.ini</code>:
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyIni}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-mono flex items-center gap-1.5 transition"
                >
                  {copiedIni ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIni ? 'Copied!' : 'Copy Snippet'}</span>
                </button>
                <button
                  onClick={() => downloadFile('freenove-platformio-env.ini', PLATFORMIO_INI_FREENOVE_SNIPPET)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 border border-zinc-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="bg-black border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-[460px] leading-relaxed">
              {PLATFORMIO_INI_FREENOVE_SNIPPET}
            </pre>
          </div>

        </div>
      )}

      {/* TAB 2: HARDWARE PINOUT TABLE */}
      {activeSubTab === 'pinout' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Freenove ESP32-S3 2.8" Pinout Mapping</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Exact GPIO assignments verified for ST7789 LCD, FT6336U Capacitive Touch, and peripherals.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] bg-zinc-950/80">
                  <th className="py-2.5 px-3">Signal Name</th>
                  <th className="py-2.5 px-3">ESP32-S3 GPIO</th>
                  <th className="py-2.5 px-3">Function</th>
                  <th className="py-2.5 px-3">Hardware &amp; Driver Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {FREENOVE_PINOUT.map((item) => (
                  <tr key={item.name} className="hover:bg-zinc-800/40">
                    <td className="py-2.5 px-3 font-bold text-amber-300">{item.name}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-400">{item.pin}</td>
                    <td className="py-2.5 px-3 text-zinc-300">{item.functionDescription}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{item.hardwareNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOARD JSON */}
      {activeSubTab === 'board_json' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <span>Board Definition: boards/esp32-s3-freenove-28c.json</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Place this file inside <code className="text-amber-300 font-mono">CYD-Klipper/boards/</code>:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-mono flex items-center gap-1.5 transition"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={() => downloadFile('esp32-s3-freenove-28c.json', FREENOVE_BOARD_JSON)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 border border-zinc-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>

          <pre className="bg-black border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-[460px] leading-relaxed">
            {FREENOVE_BOARD_JSON}
          </pre>
        </div>
      )}

      {/* TAB 4: AI LVGL TUTORIAL */}
      {activeSubTab === 'tutorial' && (
        <div className="space-y-6">
          {AI_LVGL_TUTORIAL_SECTIONS.map((section) => (
            <div key={section.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 text-amber-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>{section.title}</span>
              </h3>
              <div className="text-xs text-zinc-300 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
