import { Pos2D } from "../main";
import { Color } from "../utils/color";
import { ImageSource } from "../utils/image/image-source";
import { LineSegment } from "../utils/shapes/line-segment";
import { Rect } from "../utils/shapes/rect";
import { Painter } from "./painter";

export class Canvas2DPainter implements Painter {
  private ctx: CanvasRenderingContext2D;
  private clipRect: Rect | null = null;
  private color: Color = Color.BLACK;

  /**
   * @param canvas - HTML canvas to draw on
   * @throws Throws error if browser doesn't support CanvasRenderingContext2D
   */
  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Your browser doesn't support CanvasRenderingContext2D");
    }

    // handle scaling for hidpi
    window.addEventListener("resize", () => {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    });
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    this.ctx = ctx;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawLine(segment: LineSegment, width: number = 1): void {
    if (!this.color.equals(Color.TRANSPARENT)) {
      this.ctx.beginPath();
      this.ctx.moveTo(segment.p1.x, segment.p1.y);
      this.ctx.lineTo(segment.p2.x, segment.p2.y);

      const prevWidth = this.ctx.lineWidth;
      this.ctx.lineWidth = width;
      this.ctx.stroke();
      this.ctx.lineWidth = prevWidth;
    }
  }

  setColor(color: Color): void {
    this.color = color;
    if (!color.equals(Color.TRANSPARENT)) {
      this.ctx.fillStyle = color.toString();
      this.ctx.strokeStyle = color.toString();
    }
  }

  fillRect(rect: Rect, rounding: number = 0): void {
    if (!this.color.equals(Color.TRANSPARENT)) {
      this.ctx.beginPath();
      this.ctx.roundRect(rect.x, rect.y, rect.width, rect.height, rounding);
      this.ctx.fill();
    }
  }

  outlineRect(rect: Rect, rounding?: number): void {
    if (!this.color.equals(Color.TRANSPARENT)) {
      this.ctx.beginPath();
      this.ctx.roundRect(rect.x, rect.y, rect.width, rect.height, rounding);
      this.ctx.stroke();
    }
  }

  fillPoly(...points: Pos2D[]): void {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.fill();
  }

  outlinePoly(...points: Pos2D[]): void {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.stroke();
  }

  clip(rect: Rect | null): void {
    if (!rect) {
      this.unclip();
      return;
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.clip();
    this.clipRect = rect;
  }

  unclip(): void {
    this.ctx.restore();
    this.clipRect = null;
  }

  getClipRect(): Rect | null {
    return this.clipRect;
  }

  text(
    text: string,
    x: number,
    y: number,
    fromCenterH: boolean = false,
    fromCenterV: boolean = false,
    fontSize: number = 12,
    font: string = "Arial",
  ) {
    this.ctx.textAlign = fromCenterH ? "center" : "start";
    this.ctx.textBaseline = fromCenterV ? "middle" : "top";

    this.ctx.font = `${fontSize}px ${font}`;
    this.ctx.fillText(text, x, y);
  }

  measureText(text: string, fontSize: number, font: string = "Arial"): number {
    this.ctx.font = `${fontSize}px ${font}`;
    const metrics = this.ctx.measureText(text);
    return metrics.width;
  }

  drawImage(image: ImageSource, rect: Rect) {
    this.ctx.drawImage(
      image.getImage(),
      rect.x,
      rect.y,
      rect.width,
      rect.height,
    );
  }
}
