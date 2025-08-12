import { LineSegment } from './line-segment';
import { Pos2D } from './pos2d';
import { Vec2D } from './vec2d';
/**
 * Rectangle in a 2D space
 */
export declare class Rect {
    private position;
    private size;
    /**
     * Constructs a new Rect
     * @param position - position of the top left corner
     * @param size - size vector
     */
    constructor(position: Pos2D, size: Vec2D);
    /**
     * Constructs a new rect
     * @param x - x coordinate of top left corner
     * @param y - y coordinate of top left corner
     * @param width - width of the rectangle
     * @param height - height of the rectangle
     */
    static from(x: number, y: number, width: number, height: number): Rect;
    equals(other: Rect): boolean;
    /**
     * Check if the Rect contains a Pos2D point, with optional leeway
     * @param position - Pos2D point
     * @param leeway - tolerated distance from rect (default 0)
     */
    contains(position: Pos2D, leeway?: number): boolean;
    /**
     * Grows a Rect from its center by the given distance on each side, and returns itself
     * Shrinks the Rect if the value is negative
     * @param growBy - How much to shrink each side by
     */
    grow(growBy: number): Rect;
    /**
     * Check if a Rect intersects with another Rect
     * @param other: Other Rect
     */
    intersects(other: Rect): boolean;
    /**
     * Returns a copy of this Rect
     */
    clone(): Rect;
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get width(): number;
    set width(x: number);
    get height(): number;
    set height(y: number);
    get topLeft(): Pos2D;
    get topRight(): Pos2D;
    get bottomLeft(): Pos2D;
    get bottomRight(): Pos2D;
    get center(): Pos2D;
    get left(): LineSegment;
    get right(): LineSegment;
    get top(): LineSegment;
    get bottom(): LineSegment;
}
