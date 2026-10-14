import { PrinterConfiguration, PrinterData, PrinterState, PrinterType, GcodeFile, MacroItem, PowerDevice } from '../types/printer';

export const INITIAL_PRINTER_CONFIGS: PrinterConfiguration[] = [
  {
    id: 'printer-1',
    printer_name: 'Voron 2.4 R2 350',
    printer_host: '192.168.1.150',
    printer_auth: '',
    klipper_port: 7125,
    printer_type: PrinterType.Klipper,
    light_mode: false,
    invert_colors: false,
    color_scheme: 0, // Red / Voron Accent
    remaining_time_calc_mode: 2, // Slicer
    show_stats_on_progress_panel: 3, // All
    hotend_presets: [210, 245, 260],
    bed_presets: [60, 80, 110],
    printer_move_x_steps: [1, 10, 50],
    printer_move_y_steps: [1, 10, 50],
    printer_move_z_steps: [0.1, 1, 10],
  },
  {
    id: 'printer-2',
    printer_name: 'Bambu Lab X1-C',
    printer_host: '192.168.1.185',
    printer_auth: 'bambu_access_code_9921',
    klipper_port: 8883,
    printer_type: PrinterType.BambuLocal,
    light_mode: false,
    invert_colors: false,
    color_scheme: 2, // Green / Bambu Accent
    remaining_time_calc_mode: 2,
    show_stats_on_progress_panel: 2,
    hotend_presets: [220, 255, 280],
    bed_presets: [55, 75, 100],
    printer_move_x_steps: [1, 10, 50],
    printer_move_y_steps: [1, 10, 50],
    printer_move_z_steps: [0.1, 1, 10],
  },
  {
    id: 'printer-3',
    printer_name: 'Ender 3 V2 (Octo)',
    printer_host: '192.168.1.204',
    printer_auth: 'octo_api_secret_4401',
    klipper_port: 5000,
    printer_type: PrinterType.Octoprint,
    light_mode: false,
    invert_colors: false,
    color_scheme: 1, // Orange / Creality
    remaining_time_calc_mode: 0,
    show_stats_on_progress_panel: 1,
    hotend_presets: [200, 215, 230],
    bed_presets: [50, 60, 70],
    printer_move_x_steps: [1, 10, 50],
    printer_move_y_steps: [1, 10, 50],
    printer_move_z_steps: [0.1, 1, 10],
  },
];

export const INITIAL_PRINTER_DATA: PrinterData = {
  state: PrinterState.Printing,
  state_message: 'Printing layer 142/320',
  popup_message: '',
  temperatures: {
    hotend: 245.2,
    bed: 105.1,
    chamber: 48.6,
  },
  target_temperatures: {
    hotend: 245,
    bed: 105,
  },
  temp_history: [
    { time: '19:40', hotend: 24.0, target_hotend: 245, bed: 23.5, target_bed: 105 },
    { time: '19:42', hotend: 110.4, target_hotend: 245, bed: 55.0, target_bed: 105 },
    { time: '19:44', hotend: 210.8, target_hotend: 245, bed: 88.2, target_bed: 105 },
    { time: '19:46', hotend: 245.0, target_hotend: 245, bed: 104.9, target_bed: 105 },
    { time: '19:48', hotend: 245.3, target_hotend: 245, bed: 105.2, target_bed: 105 },
    { time: '19:50', hotend: 245.1, target_hotend: 245, bed: 105.0, target_bed: 105 },
    { time: '19:52', hotend: 244.9, target_hotend: 245, bed: 105.1, target_bed: 105 },
    { time: '19:54', hotend: 245.2, target_hotend: 245, bed: 105.0, target_bed: 105 },
    { time: '19:56', hotend: 245.0, target_hotend: 245, bed: 105.1, target_bed: 105 },
    { time: '19:58', hotend: 245.2, target_hotend: 245, bed: 105.1, target_bed: 105 },
  ],
  position: [175.4, 182.9, 28.4],
  elapsed_time_s: 4320, // 1h 12m
  printed_time_s: 4320,
  remaining_time_s: 6480, // 1h 48m
  filament_used_mm: 14250,
  print_filename: 'Freenove_ESP32S3_Enclosure_v2.gcode',
  print_progress: 0.4437, // 44.37%
  fan_speed: 0.65, // 65%
  speed_mult: 1.0, // 100%
  extrude_mult: 1.0, // 100%
  z_offset: -0.045,
  total_layers: 320,
  current_layer: 142,
  pressure_advance: 0.038,
  smooth_time: 0.04,
  feedrate_mm_per_s: 180,
  homed_axis: true,
  absolute_coords: true,
  can_extrude: true,
};

export const SAMPLE_GCODE_FILES: GcodeFile[] = [
  {
    filename: 'Freenove_ESP32S3_Enclosure_v2.gcode',
    size_bytes: 18452100,
    print_duration_est_s: 10800,
    filament_total_mm: 32400,
    modified: '2026-10-13 14:22',
  },
  {
    filename: 'Voron_Stealthburner_Main_Body.gcode',
    size_bytes: 24150000,
    print_duration_est_s: 14400,
    filament_total_mm: 48900,
    modified: '2026-10-12 18:40',
  },
  {
    filename: 'CYD_Screen_Mount_2020_Extrusion.gcode',
    size_bytes: 4210000,
    print_duration_est_s: 3200,
    filament_total_mm: 8700,
    modified: '2026-10-11 09:15',
  },
  {
    filename: 'Benchy_Speed_PLA_0.2mm.gcode',
    size_bytes: 6540000,
    print_duration_est_s: 1560,
    filament_total_mm: 5200,
    modified: '2026-10-10 11:30',
  },
  {
    filename: 'Calibration_Cube_XYZ_20mm.gcode',
    size_bytes: 1200400,
    print_duration_est_s: 900,
    filament_total_mm: 2100,
    modified: '2026-10-09 20:00',
  },
];

export const SAMPLE_MACROS: MacroItem[] = [
  { name: 'G28_HOME_ALL', description: 'CYD_SCREEN_MACRO: Home all axes safely' },
  { name: 'QUAD_GANTRY_LEVEL', description: 'CYD_SCREEN_MACRO: Automatic 4-point gantry leveling' },
  { name: 'BED_MESH_CALIBRATE', description: 'CYD_SCREEN_MACRO: Adaptive bed mesh probe' },
  { name: 'CLEAN_NOZZLE', description: 'CYD_SCREEN_MACRO: Purge & brass brush wipe routine' },
  { name: 'LOAD_FILAMENT_ABS', description: 'CYD_SCREEN_MACRO: Heat to 240C and feed 80mm' },
  { name: 'UNLOAD_FILAMENT', description: 'CYD_SCREEN_MACRO: Quick retract and cooldown' },
  { name: 'FILAMENT_RUNOUT_RESUME', description: 'CYD_SCREEN_MACRO: Resume after spool reload' },
  { name: 'NEVERMORE_FILTER_ON', description: 'CYD_SCREEN_MACRO: Recirculate chamber air filter' },
];

export const SAMPLE_POWER_DEVICES: PowerDevice[] = [
  { name: 'Printer PSU (Main Power)', state: true, type: 'relay' },
  { name: 'Chamber LED Strip', state: true, type: 'light' },
  { name: 'Nevermore Carbon Filter', state: true, type: 'fan' },
  { name: 'Exhaust Ventilation Fan', state: false, type: 'fan' },
];
