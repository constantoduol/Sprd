import SprdRange from './SprdRange';

export const DEFAULT_HEADER_WIDTH = 80;
export const DEFAULT_ROW_HEIGHT = 24;
export const DEFAULT_NUM_HEADER_WIDTH = 50
export const DIRECTION = {UP: "up", DOWN: "down", LEFT: "left", RIGHT: "right"};

export const OUT_OF_RANGE_CELL = new SprdRange(-1,-1,-1,-1);

export const FOOTER_HEIGHT = 15;

export const EVENT = {
  CELL_VALUE_CHANGED: "CELL_VALUE_CHANGED",
  DRAG_STARTED: "DRAG_STARTED",
  DRAG_STOPPED: "DRAG_STOPPED",
  DRAG_IN_PROGRESS: "DRAG_IN_PROGRESS",
  CELL_CLICKED: "CELL_CLICKED",
  CELL_DOUBLE_CLICKED: "CELL_DOUBLE_CLICKED",
  CELL_FOCUSED: "CELL_FOCUSED",
  PASTE: "PASTE",
  MOVE: "MOVE",
  HEADER_CLICKED: "HEADER_CLICKED",
  NUMBER_CELL_CLICKED: "NUMBER_CELL_CLICKED"
};