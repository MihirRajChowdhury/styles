/* eslint-disable etc/no-commented-out-code */
export const PX_TAG = "px ";
export const REM_TAG = "rem";
export const IMPORTANT = " !important";

/**
 * Spacing related defaults
 */
export const DEFAULT_MARGIN = 8;
export const DEFAULT_PADDING = 8;
export const DEFAULT_SPACING = 8;
export const DEFAULT_WORD_SPACING = 1 / 16;

/**
 * Border related defaults
 */
export const DEFAULT_BORDER_WIDTH = 1;
export const DEFAULT_BORDER_STYLE = "solid";
export const DEFAULT_BORDER_COLOR = "black";
export const DEFAULT_BORDER_RADIUS = 4;
// export const DEFAULT_BORDER = (DEFAULT_BORDER_WIDTH + PX_TAG + DEFAULT_BORDER_STYLE + " " + DEFAULT_BORDER_COLOR);

export const DEFAULT_BORDER = {
  borderColor: DEFAULT_BORDER_COLOR,
  borderStyle: DEFAULT_BORDER_STYLE,
  borderWidth: DEFAULT_BORDER_WIDTH + PX_TAG,
};

/**
 * Shadow related defaults
 */
// -- const DEFAULT_SHADOW_COLOR = "black";
export const DEFAULT_SHADOW_COLOR_RGB = "0,0,0";
