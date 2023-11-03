/**
 * Type of shape that a tile can be in the Q Game.
 * Used in tiles that inherit the ShapeColorTile interface.
 * Ordered from lowest to highest.
 */
export const shapeList = [
  'star',
  '8star',
  'square',
  'circle',
  'clover',
  'diamond'
] as const;
export type Shape = (typeof shapeList)[number];

/**
 * Type of color that a tile can be in the Q Game.
 * Used in tiles that inherit the ShapeColorTile interface.
 * Ordered from lowest to highest.
 */
export const colorList = [
  'red',
  'green',
  'blue',
  'yellow',
  'orange',
  'purple'
] as const;
export type Color = (typeof colorList)[number];

/**
 * Type representing the dimensions of a board.
 * Contains the x coordinate of furthest point in the left and right directions
 * and the y coordinate of the furthest point in the up and down directions.
 */
export type Dimensions = {
  topmost: number;
  bottommost: number;
  leftmost: number;
  rightmost: number;
};
