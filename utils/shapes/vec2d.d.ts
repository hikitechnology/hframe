/**
 * 2D measurement of direction and magnitude
 */
export declare class Vec2D {
    x: number;
    y: number;
    /**
     * Constructs a new Vec2D object
     * @param x - width
     * @param y - height
     */
    constructor(x: number, y: number);
    /**
     * Returns a copy of this Vec2D object
     */
    clone(): Vec2D;
    equals(other: Vec2D): boolean;
    /**
     * Returns the length of a vector
     */
    get length(): number;
}
