#ifdef CYD_SCREEN_DRIVER_FREENOVE_ESP32S3_28

#include "../screen_driver.h"

#ifdef CYD_SCREEN_VERTICAL
    #error "Vertical screen not supported with the FREENOVE_ESP32S3_28 driver"
#endif

#include <SPI.h>
#include <Wire.h>
#include <TFT_eSPI.h>
#include "../../conf/global_config.h"
#include "lvgl.h"
#include "../lv_setup.h"

#ifndef TFT_BL
#define TFT_BL 45
#endif

#define TOUCH_I2C_SDA 16
#define TOUCH_I2C_SCL 15
#define TOUCH_RST_PIN 18
#define TOUCH_INT_PIN 17
#define FT6336U_I2C_ADDR 0x38

static lv_disp_draw_buf_t draw_buf;
static lv_color_t buf[CYD_SCREEN_HEIGHT_PX * CYD_SCREEN_WIDTH_PX / 10];

TFT_eSPI tft = TFT_eSPI();

void screen_setBrightness(byte brightness)
{
    // 12-bit LEDC resolution (0 - 4095)
    uint32_t duty = (4095UL * brightness) / 255UL;
    ledcWrite(0, duty);
}

void screen_lv_flush(lv_disp_drv_t *disp, const lv_area_t *area, lv_color_t *color_p)
{
    uint32_t w = (area->x2 - area->x1 + 1);
    uint32_t h = (area->y2 - area->y1 + 1);

    tft.startWrite();
    tft.setAddrWindow(area->x1, area->y1, w, h);
    tft.pushColors((uint16_t *)&color_p->full, w * h, true);
    tft.endWrite();

    lv_disp_flush_ready(disp);
}

static bool ft6336u_read_touch(uint16_t &touch_x, uint16_t &touch_y)
{
    Wire.beginTransmission(FT6336U_I2C_ADDR);
    Wire.write(0x02); // TD_STATUS register
    if (Wire.endTransmission(false) != 0) {
        return false;
    }

    if (Wire.requestFrom((uint8_t)FT6336U_I2C_ADDR, (uint8_t)5) != 5) {
        return false;
    }

    uint8_t td_status = Wire.read() & 0x07;
    uint8_t xh = Wire.read();
    uint8_t xl = Wire.read();
    uint8_t yh = Wire.read();
    uint8_t yl = Wire.read();

    if (td_status == 0) {
        return false;
    }

    uint16_t raw_x = ((xh & 0x0F) << 8) | xl;
    uint16_t raw_y = ((yh & 0x0F) << 8) | yl;

    // FT6336U portrait coordinates: raw_x in [0..239], raw_y in [0..319]
    // Landscape orientation (320x240):
    uint16_t px = raw_y;
    uint16_t py = (raw_x < 240) ? (239 - raw_x) : 0;

    // Flip 180 degrees if rotate_screen is set
    if (global_config.rotate_screen) {
        px = (px < CYD_SCREEN_WIDTH_PX) ? (CYD_SCREEN_WIDTH_PX - 1 - px) : 0;
        py = (py < CYD_SCREEN_HEIGHT_PX) ? (CYD_SCREEN_HEIGHT_PX - 1 - py) : 0;
    }

    if (px >= CYD_SCREEN_WIDTH_PX) px = CYD_SCREEN_WIDTH_PX - 1;
    if (py >= CYD_SCREEN_HEIGHT_PX) py = CYD_SCREEN_HEIGHT_PX - 1;

    touch_x = px;
    touch_y = py;
    return true;
}

void screen_lv_touchRead(lv_indev_drv_t * /*indev_driver*/, lv_indev_data_t *data)
{
    uint16_t tx = 0, ty = 0;
    if (ft6336u_read_touch(tx, ty)) {
        data->state = LV_INDEV_STATE_PR;
        data->point.x = tx;
        data->point.y = ty;
    } else {
        data->state = LV_INDEV_STATE_REL;
    }
}

void set_invert_display()
{
    tft.invertDisplay(global_config.printer_config[global_config.printer_index].invert_colors);
}

void screen_setup()
{
    // Initialize I2C for capacitive touch controller
    Wire.begin(TOUCH_I2C_SDA, TOUCH_I2C_SCL, 400000);

    #if defined(TOUCH_RST_PIN) && (TOUCH_RST_PIN >= 0)
    pinMode(TOUCH_RST_PIN, OUTPUT);
    digitalWrite(TOUCH_RST_PIN, LOW);
    delay(10);
    digitalWrite(TOUCH_RST_PIN, HIGH);
    delay(50);
    #endif

    #if defined(TOUCH_INT_PIN) && (TOUCH_INT_PIN >= 0)
    pinMode(TOUCH_INT_PIN, INPUT);
    #endif

    // Backlight PWM setup
    pinMode(TFT_BL, OUTPUT);
    ledcSetup(0, 5000, 12);
    ledcAttachPin(TFT_BL, 0);

    lv_init();

    // Initialize TFT screen
    tft.init();
    tft.setRotation(global_config.rotate_screen ? 3 : 1);
    tft.fillScreen(TFT_BLACK);
    set_invert_display();

    screen_setBrightness(global_config.brightness ? global_config.brightness : 255);

    lv_disp_draw_buf_init(&draw_buf, buf, NULL, CYD_SCREEN_HEIGHT_PX * CYD_SCREEN_WIDTH_PX / 10);

    /* Initialize LVGL display driver */
    static lv_disp_drv_t disp_drv;
    lv_disp_drv_init(&disp_drv);
    disp_drv.hor_res = CYD_SCREEN_WIDTH_PX;
    disp_drv.ver_res = CYD_SCREEN_HEIGHT_PX;
    disp_drv.flush_cb = screen_lv_flush;
    disp_drv.draw_buf = &draw_buf;
    lv_disp_drv_register(&disp_drv);

    /* Initialize LVGL touch input driver */
    static lv_indev_drv_t indev_drv;
    lv_indev_drv_init(&indev_drv);
    indev_drv.type = LV_INDEV_TYPE_POINTER;
    indev_drv.read_cb = screen_lv_touchRead;
    lv_indev_drv_register(&indev_drv);
}

#endif // CYD_SCREEN_DRIVER_FREENOVE_ESP32S3_28

