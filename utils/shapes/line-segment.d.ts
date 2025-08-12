import { Pos2D } from './pos2d';
import { Vec2D } from './vec2d';
/**
 * Line segment from one point to another
 */
export declare class LineSegment {
    p1: Pos2D;
    p2: Pos2D;
    /**
     * Constructs a new LineSegment
     * @param p1 - position from
     * @param p2 - position to
     */
    constructor(p1: Pos2D, p2: Pos2D);
    /**
     * Constructs a new LineSegment from a set of coordinates
     * @param x1 - x coordinate from
     * @param y1 - y coordinate from
     * @param x2 - x coordinate to
     * @param y2 - y coordinate to
     */
    static from(x1: number, y1: number, x2: number, y2: number): LineSegment;
    /**
     * Returns a copy of this LineSegment
     */
    clone(): LineSegment;
    /**
     * Determines if a point touches this segment
     * @param point - point to test
     * @param leeway - tolerated distance from the line (default 0)
     */
    touchesPoint(point: Pos2D, leeway?: number): boolean;
    /**
     * Returns the vector representation of this line segment
     */
    toVec(): Vec2D;
}
