# CYD-Klipper Touch Display & Freenove ESP32-S3

An interactive React application rewrite of **CYD-Klipper**, providing a full simulation and control interface for 3D printers running **Klipper (Moonraker)**, **Bambu Lab**, and **OctoPrint**, with dedicated support for the **Freenove ESP32-S3 Touch Display 2.8" IPS (Dual-core 240 MHz)**.

![Showcase](readme/PXL_20231113_171629383.jpg)

## Features

- **Interactive 320×240 LVGL Touch Display Emulation**:
  - **Progress Panel**: Live print progress bar, elapsed & remaining time estimations (slicer, interpolated, percentage modes), layer tracker, speed/flow/fan pills, pause/resume/cancel controls, and emergency stop (M112).
  - **Temperature & Extrude Panel**: Hotend and heated bed telemetry with heating PID curves, 3 hotend presets, 3 bed presets, custom temp keypad, cooldown button, and cold extrusion prevention (locked below 175°C).
  - **Move & Jogging Panel**: Absolute and relative toolhead movement (X, Y, Z), customizable step increments (0.1, 1, 10, 50mm), single-axis and all-axes homing (G28), and stepper motor shutoff (M84).
  - **Quick Tuning Matrices**: Live popups for Part Fan Speed, Z-Offset live babystepping (-0.2mm to +0.2mm), Speed Multiplier (50% to 200%), and Flow/Extrusion rate.
  - **G-Code Files Panel**: File listing with size, duration estimates, 32×32 / 64×64 thumbnail previews, and print confirmation modal.
  - **Macros & Moonraker Power Panel**: Execute Klipper macros (`CYD_SCREEN_MACRO`) and toggle network power relays.
  - **Multi-Printer Switcher**: Instant hub switching between up to 6 configured Klipper, Bambu Lab, and OctoPrint printers.
  - **Settings**: Color schemes (Voron Red, Prusa Orange, Bambu Green, Cyan, Violet), display color inversion (essential for ST7789 IPS panels), brightness adjustment, screen wake timeout, and calibration reset.
- **Freenove ESP32-S3 2.8" IPS Support & AI LVGL Tutorial**:
  - Full board specifications (Xtensa LX7 Dual-Core 240 MHz, 8MB Octal PSRAM, 16MB Flash).
  - Verified GPIO pinout mapping for ST7789V2 SPI display and FT6336U capacitive touch.
  - Ready-to-use `platformio.ini` environment snippet (`[env:freenove-esp32-s3-28]`) and board JSON (`esp32-s3-freenove-28c.json`).
  - Architectural tutorial covering dual-core FreeRTOS task separation, PSRAM double-buffering, and vector neural acceleration.
- **Web Serial Terminal**:
  - 115200 baud USB serial console connecting directly to physical ESP32 boards via Web Serial API or running the simulated firmware command shell (`help`, `status`, `ssid`, `ip`, `port`, `key`, `gcode`, `restart`).
- **Live Moonraker Connection**:
  - Test and link real Klipper/Moonraker network instances directly to the display.

## Building and Running

### Web Application
```bash
npm install
npm run dev
```

### Compiling Firmware for Freenove ESP32-S3 2.8"
```bash
# 1. Install PlatformIO CLI
pip install platformio

# 2. Build for Freenove ESP32-S3
pio run -e freenove-esp32-s3-28

# 3. Flash to board via USB-C (CH343 port)
pio run -e freenove-esp32-s3-28 -t upload

# 4. Monitor serial logs
pio device monitor -b 115200
```

## Hardware Specifications (Freenove ESP32-S3 2.8")

| Component | Specification |
|---|---|
| **MCU** | ESP32-S3-WROOM-1 (Xtensa Dual-Core 240 MHz with AI Vector Extension) |
| **RAM / Flash** | 8MB Octal PSRAM + 16MB Flash |
| **Display** | 2.8-inch IPS LCD (320×240), ST7789V2 SPI |
| **Touchscreen** | Capacitive Multi-touch, FT6336U I2C |
| **Connectivity** | 2.4 GHz Wi-Fi 4 (802.11 b/g/n) + Bluetooth 5 (LE) |
| **Ports** | Dual Type-C USB (CH343 UART + Native USB OTG) |

## License

MIT License.
