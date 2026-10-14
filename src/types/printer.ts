export enum PrinterType {
  None = 0,
  Klipper = 1,
  KlipperSerial = 2,
  BambuLocal = 3,
  Octoprint = 4,
}

export enum PrinterState {
  Offline = 0,
  Error = 1,
  Idle = 2,
  Printing = 3,
  Paused = 4,
}

export interface PrinterData {
  state: PrinterState;
  state_message: string;
  popup_message: string;
  temperatures: {
    hotend: number;
    bed: number;
    chamber?: number;
  };
  target_temperatures: {
    hotend: number;
    bed: number;
  };
  temp_history: {
    time: string;
    hotend: number;
    target_hotend: number;
    bed: number;
    target_bed: number;
  }[];
  position: [number, number, number]; // X, Y, Z
  elapsed_time_s: number;
  printed_time_s: number;
  remaining_time_s: number;
  filament_used_mm: number;
  print_filename: string;
  print_progress: number; // 0 -> 1
  fan_speed: number; // 0 -> 1
  speed_mult: number; // 1.0 = 100%
  extrude_mult: number; // 1.0 = 100%
  z_offset: number; // mm
  total_layers: number;
  current_layer: number;
  pressure_advance: number;
  smooth_time: number;
  feedrate_mm_per_s: number;
  homed_axis: boolean;
  absolute_coords: boolean;
  can_extrude: boolean;
}

export interface PrinterConfiguration {
  id: string;
  printer_name: string;
  printer_host: string;
  printer_auth: string;
  klipper_port: number;
  printer_type: PrinterType;
  light_mode: boolean;
  invert_colors: boolean;
  color_scheme: number; // 0: Red (Default), 1: Orange, 2: Green, 3: Cyan, 4: Violet
  remaining_time_calc_mode: number; // 0: Percentage, 1: Interpolated, 2: Slicer
  show_stats_on_progress_panel: number; // 0: None, 1: Layer, 2: Partial, 3: All
  hotend_presets: [number, number, number];
  bed_presets: [number, number, number];
  printer_move_x_steps: [number, number, number]; // e.g. [1, 10, 50]
  printer_move_y_steps: [number, number, number];
  printer_move_z_steps: [number, number, number];
}

export interface GlobalConfig {
  version: number;
  rotate_screen: boolean;
  auto_ota_update: boolean;
  multi_printer_mode: boolean;
  on_during_print: boolean;
  display_mode: boolean;
  disable_m117_messaging: boolean;
  sort_macros: boolean;
  show_estop: boolean;
  full_filenames: boolean;
  double_size_gcode_img: boolean;
  wifi_SSID: string;
  brightness: number; // 64 -> 255
  screen_timeout: number; // minutes
  printer_index: number;
}

export interface GcodeFile {
  filename: string;
  size_bytes: number;
  print_duration_est_s: number;
  filament_total_mm: number;
  thumbnail?: string; // base64 or SVG data url
  modified: string;
}

export interface MacroItem {
  name: string;
  description: string;
}

export interface PowerDevice {
  name: string;
  state: boolean;
  type: string;
}

export type ActivePanel =
  | 'progress'
  | 'temp'
  | 'move'
  | 'files'
  | 'macros'
  | 'settings'
  | 'printers'
  | 'stats';
