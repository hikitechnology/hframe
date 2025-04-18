export abstract class ImageSource {
  /**
   * @returns HTMLImageElement representation of the ImageSource
   */
  abstract getImage(): HTMLImageElement;

  /**
   * @returns The width of the image in pixels
   */
  abstract get width(): number;

  /**
   * @returns The height of the image in pixels
   */
  abstract get height(): number;
}
