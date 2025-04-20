import { Color } from "../utils/color";
import { ImageSource } from "../utils/image/image-source";
import { LineSegment } from "../utils/shapes/line-segment";
import { Rect } from "../utils/shapes/rect";

/**
 * Renders shapes to a canvas
 */
export interface Painter {
  /**
   * Clear the whole canvas
   */
  clear(): void;

  /**
   * Set the pen color
   * @param color - Color object
   */
  setColor(color: Color): void;

  /**
   * Draws a line segment
   * @param segment - LineSegment to draw
   */
  drawLine(segment: LineSegment, width?: number): void;

  /**
   * Fills a rectangle
   * @param rect - Rect to fill
   * @param rounding - Corner radius (optional)
   */
  fillRect(rect: Rect, rounding?: number): void;

  /**
   * Outlines a rectangle
   * @param rect - Rect to outline
   * @param rounding - Corner radius (optional)
   */
  outlineRect(rect: Rect, rounding?: number): void;

  /**
   * Prevents the painter from drawing outside a boundary
   * @param rect - Boundary limit Rect
   */
  clip(rect: Rect | null): void;

  /**
   * Reverts any clip restrictions
   */
  unclip(): void;

  /**
   * @returns The current clip Rect of the painter, or `null` if not clipped
   */
  getClipRect(): Rect | null;

  /**
   * Draws text
   * @param text - The string to write
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param fromCenter - are these coordinates for the center of the text?
   * @param fontSize - Font size
   */
  text(
    text: string,
    x: number,
    y: number,
    fromCenterV: boolean,
    fromCenterH: boolean,
    fontSize?: number,
  ): void;

  /**
   * Returns the width of a string in pixels when painted with the given font size
   */
  measureText(text: string, fontSize: number): number;

  /**
   * Draws an image to the canvas
   * @param image - Image to draw
   * @param rect - Rect to fill with the image
   */
  drawImage(image: ImageSource, rect: Rect): void;
}
