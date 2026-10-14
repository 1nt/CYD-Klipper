export interface FreenoveBoardPinout {
  name: string;
  pin: string;
  functionDescription: string;
  hardwareNotes: string;
}

export const FREENOVE_ESP32_S3_SPECS = {
  boardName: 'Freenove ESP32-S3 Touch Display 2.8" (FNK0085)',
  mcu: 'ESP32-S3-WROOM-1 (Xtensa LX7 Dual-Core 240 MHz)',
  aiFeatures: 'Vector Instructions for Neural Network Inference & Acceleration',
  display: '2.8-inch IPS LCD, 320x240 RGB, Wide Viewing Angle',
  displayDriver: 'ST7789V2 (SPI @ 40-55 MHz)',
  touchscreen: 'Capacitive Multi-touch (FT6336U / CST816D via I2C)',
  flash: '16MB QSPI Flash',
  psram: '8MB Octal SPI PSRAM (OPI high speed)',
  wireless: '2.4 GHz Wi-Fi 4 (802.11 b/g/n) + Bluetooth 5.0 LE',
  usbPorts: 'Dual Type-C (CH343 UART for Flashing/Logs + ESP32-S3 Native USB OTG)',
  peripherals: 'MicroSD Card slot, WS2812B RGB LED, Onboard Microphone & Speaker amp, I2C Qwiic/Stemma connector',
};

export const FREENOVE_PINOUT: FreenoveBoardPinout[] = [
  { name: 'TFT_MOSI', pin: 'GPIO 11', functionDescription: 'SPI Data In (MOSI)', hardwareNotes: 'Hardware SPI bus FSPI' },
  { name: 'TFT_SCLK', pin: 'GPIO 12', functionDescription: 'SPI Clock (SCK)', hardwareNotes: 'Up to 55 MHz clock' },
  { name: 'TFT_CS', pin: 'GPIO 10', functionDescription: 'TFT Chip Select', hardwareNotes: 'Active LOW' },
  { name: 'TFT_DC', pin: 'GPIO 13', functionDescription: 'Data / Command Select', hardwareNotes: 'LOW = Command, HIGH = Data' },
  { name: 'TFT_RST', pin: 'GPIO 9', functionDescription: 'TFT Hardware Reset', hardwareNotes: 'Active LOW or connected to EN' },
  { name: 'TFT_BL', pin: 'GPIO 14', functionDescription: 'Backlight PWM control', hardwareNotes: 'LEDC PWM for smooth dimming' },
  { name: 'TOUCH_SDA', pin: 'GPIO 17', functionDescription: 'Capacitive Touch I2C SDA', hardwareNotes: '4.7k pull-up resistor' },
  { name: 'TOUCH_SCL', pin: 'GPIO 18', functionDescription: 'Capacitive Touch I2C SCL', hardwareNotes: '400 kHz Fast I2C' },
  { name: 'TOUCH_INT', pin: 'GPIO 15', functionDescription: 'Touch Interrupt', hardwareNotes: 'Falling edge on finger touch' },
  { name: 'TOUCH_RST', pin: 'GPIO 16', functionDescription: 'Touch IC Reset', hardwareNotes: 'Active LOW hardware reset' },
  { name: 'RGB_LED', pin: 'GPIO 38', functionDescription: 'WS2812B NeoPixel RGB', hardwareNotes: 'Single-wire addressable LED' },
  { name: 'SD_CS', pin: 'GPIO 21', functionDescription: 'MicroSD Card CS', hardwareNotes: 'SPI SD Card interface' },
];

export const PLATFORMIO_INI_FREENOVE_SNIPPET = `; ================================================================
; PlatformIO Configuration for Freenove ESP32-S3 Touch Display 2.8"
; Board: Freenove ESP32-S3 2.8-inch IPS (ST7789 + FT6336U Capacitive)
; ================================================================

[env:freenove-esp32-s3-28]
platform = espressif32@^6.6.0
board = esp32-s3-devkitc-1
framework = arduino
monitor_speed = 115200
board_build.mcu = esp32s3
board_build.f_cpu = 240000000L
board_build.f_flash = 80000000L
board_build.flash_mode = qio
board_build.arduino.memory_type = qio_opi
board_upload.flash_size = 16MB
build_flags =
    -DBOARD_HAS_PSRAM
    -mfix-esp32-psram-cache-issue
    -DLV_CONF_PATH="../../../../src/conf/lv_conf.h"
    -DUSER_SETUP_LOADED=1
    -DST7789_DRIVER=1
    -DTFT_WIDTH=240
    -DTFT_HEIGHT=320
    -DTFT_MOSI=11
    -DTFT_SCLK=12
    -DTFT_CS=10
    -DTFT_DC=13
    -DTFT_RST=9
    -DTFT_BL=14
    -DTFT_BACKLIGHT_ON=HIGH
    -DSPI_FREQUENCY=40000000
    -DTOUCH_I2C=1
    -DTOUCH_SDA=17
    -DTOUCH_SCL=18
    -DTOUCH_INT=15
    -DTOUCH_RST=16
    -DCYD_SCREEN_HEIGHT_PX=240
    -DCYD_SCREEN_WIDTH_PX=320
    -DCYD_SCREEN_GAP_PX=8
    -DCYD_SCREEN_MIN_BUTTON_HEIGHT_PX=35
    -DCYD_SCREEN_MIN_BUTTON_WIDTH_PX=35
    -DCYD_SCREEN_FONT=lv_font_montserrat_14
    -DCYD_SCREEN_FONT_SMALL=lv_font_montserrat_10
    -DCYD_SCREEN_SIDEBAR_SIZE_PX=40
    -DCYD_SCREEN_DRIVER_FREENOVE_ESP32_S3=1
lib_deps =
    SPI
    Wire
    bblanchon/ArduinoJson@^7.0.0
    plageoj/UrlEncode@^1.0.1
    knolleary/PubSubClient@^2.8
    WiFiClientSecure
    https://github.com/suchmememanyskill/lvgl.git#v8.3.11
    https://github.com/Bodmer/TFT_eSPI.git
`;

export const FREENOVE_BOARD_JSON = `{
  "build": {
    "arduino": {
      "ldscript": "esp32s3_out.ld",
      "memory_type": "qio_opi"
    },
    "core": "esp32",
    "extra_flags": [
      "-DBOARD_HAS_PSRAM",
      "-mfix-esp32-psram-cache-issue",
      "-DUSER_SETUP_LOADED=1",
      "-DST7789_DRIVER=1",
      "-DTFT_BACKLIGHT_ON=HIGH",
      "-DTFT_BL=14",
      "-DTFT_MISO=-1",
      "-DTFT_MOSI=11",
      "-DTFT_SCLK=12",
      "-DTFT_CS=10",
      "-DTFT_DC=13",
      "-DTFT_RST=9",
      "-DSPI_FREQUENCY=40000000",
      "-DSPI_READ_FREQUENCY=20000000",
      "-DTOUCH_I2C=1",
      "-DTOUCH_SDA=17",
      "-DTOUCH_SCL=18",
      "-DTOUCH_INT=15",
      "-DTOUCH_RST=16",
      "-DCYD_SCREEN_HEIGHT_PX=240",
      "-DCYD_SCREEN_WIDTH_PX=320",
      "-DCYD_SCREEN_GAP_PX=8",
      "-DCYD_SCREEN_MIN_BUTTON_HEIGHT_PX=35",
      "-DCYD_SCREEN_MIN_BUTTON_WIDTH_PX=35",
      "-DCYD_SCREEN_FONT=lv_font_montserrat_14",
      "-DCYD_SCREEN_FONT_SMALL=lv_font_montserrat_10",
      "-DCYD_SCREEN_SIDEBAR_SIZE_PX=40",
      "-DCYD_SCREEN_DRIVER_FREENOVE_ESP32_S3=1"
    ],
    "f_cpu": "240000000L",
    "f_flash": "80000000L",
    "flash_mode": "qio",
    "mcu": "esp32s3",
    "variant": "esp32s3"
  },
  "connectivity": ["wifi", "bluetooth"],
  "frameworks": ["arduino", "espidf"],
  "name": "Freenove-ESP32-S3-28",
  "upload": {
    "flash_size": "16MB",
    "maximum_ram_size": 327680,
    "maximum_size": 16777216,
    "require_upload_port": true,
    "speed": 921600
  },
  "vendor": "Freenove"
}`;

export const AI_LVGL_TUTORIAL_SECTIONS = [
  {
    id: 'architecture',
    title: '1. Dual-Core FreeRTOS & LVGL Architecture',
    content: `
The ESP32-S3 features two 240 MHz Xtensa LX7 cores. In CYD-Klipper:
- **Core 1 (UI Thread)**: Dedicated exclusively to LVGL rendering and touch polling (\`lv_timer_handler()\`). Because LVGL is not thread-safe, all UI drawing happens on Core 1 using a FreeRTOS mutex semaphore (\`xSemaphoreTake(lvgl_mutex)\`).
- **Core 0 (Networking & Moonraker Task)**: Dedicated to Wi-Fi, HTTP/WebSocket polling, JSON parsing of printer telemetry, and background OTA checks.
- **PSRAM Buffer Allocation**: The Freenove board includes 8MB of Octal PSRAM. The LVGL display double-buffer is allocated in high-speed PSRAM (\`ps_malloc(320 * 40 * sizeof(lv_color_t))\`), eliminating internal SRAM constraints!
    `,
  },
  {
    id: 'st7789',
    title: '2. ST7789 IPS Display Driver Configuration',
    content: `
The 2.8" IPS panel uses the ST7789V2 controller over hardware SPI.
- **Color Inversion**: IPS panels frequently require color inversion (\`tft.invertDisplay(1)\` or \`TFT_INVERSION_ON\`) to display accurate blacks and reds. In CYD-Klipper settings, you can toggle color inversion dynamically.
- **SPI DMA (Direct Memory Access)**: Using ESP32-S3 DMA Channel 1/2 allows pushing rendered frame lines to the display in the background without blocking the CPU!
- **Orientation**: Rotation 1 (landscape, 320x240) aligns the USB-C port at the bottom for easy printer mounting.
    `,
  },
  {
    id: 'capacitive-touch',
    title: '3. Capacitive Touch (FT6336U / CST816D) vs Resistive',
    content: `
Unlike cheap resistive CYD screens (XPT2046) that require styluses or hard finger pressure, the Freenove ESP32-S3 has a modern smartphone-grade capacitive touch panel:
- Connected over I2C at 400 kHz (SDA: GPIO 17, SCL: GPIO 18, INT: GPIO 15, RST: GPIO 16).
- No calibration drift over time! No need for 4-point touch calibration screens.
- Smooth swipe gestures and light touch response for the micro-stepping jog dials and temperature keypads.
    `,
  },
  {
    id: 'compilation-steps',
    title: '4. Compiling & Flashing Step-by-Step',
    content: `
To compile this project locally for your Freenove ESP32-S3:
\`\`\`bash
# 1. Clone CYD-Klipper repository
git clone https://github.com/suchmememanyskill/CYD-Klipper.git
cd CYD-Klipper

# 2. Add the Freenove board config to platformio.ini
# (Append the [env:freenove-esp32-s3-28] snippet provided in the tab above)

# 3. Build firmware using PlatformIO CLI
pio run -e freenove-esp32-s3-28

# 4. Connect Freenove ESP32-S3 via the CH343 USB-C port and Flash
pio run -e freenove-esp32-s3-28 -t upload
pio device monitor -b 115200
\`\`\`
Or use the **Web Flasher** right here in this browser application via Web Serial!
    `,
  },
  {
    id: 'ai-features',
    title: '5. ESP32-S3 AI & Vector Accelerators (ESP-NN)',
    content: `
The ESP32-S3 contains specialized vector instructions (PIE - Processor Instruction Extension) capable of running neural network inference (TensorFlow Lite Micro / ESP-DL).
For 3D printing applications, this allows:
- Real-time vibration analysis from an ADXL345 accelerometer via I2C for resonance testing.
- Anomaly detection in temperature curves to prevent thermal runaway before hardware limits trip.
- Filament usage velocity estimation using linear regression on Core 0.
    `,
  },
];
