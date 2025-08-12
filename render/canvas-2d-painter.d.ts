import { Pos2D } from '../main';
import { Color } from '../utils/color';
import { ImageSource } from '../utils/image/image-source';
import { LineSegment } from '../utils/shapes/line-segment';
import { Rect } from '../utils/shapes/rect';
import { Painter } from './painter';
export declare class Canvas2DPainter implements Painter {
    private canvas;
    private ctx;
    private clipRect;
    private color;
    /**
     * @param canvas - HTML canvas to draw on
     * @throws Throws error if browser doesn't support CanvasRenderingContext2D
     */
    constructor(canvas: HTMLCanvasElement);
    clear(): void;
    drawLine(segment: LineSegment, width?: number): void;
    setColor(color: Color): void;
    fillRect(rect: Rect, rounding?: number): void;
    outlineRect(rect: Rect, rounding?: number): void;
    fillPoly(...points: Pos2D[]): void;
    outlinePoly(...points: Pos2D[]): void;
    clip(rect: Rect | null): void;
    unclip(): void;
    getClipRect(): Rect | null;
    text(text: string, x: number, y: number, fromCenterH?: boolean, fromCenterV?: boolean, fontSize?: number, font?: string): void;
    measureText(text: string, fontSize: number, font?: string): number;
    drawImage(image: ImageSource, rect: Rect): void;
    drawVideoFrame(frame: VideoFrame, rect: Rect): void;
}
