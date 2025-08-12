/**
 * Position on a 2D plane
 */
export declare class Pos2D {
    x: number;
    y: number;
    /**
     * Constructs a new Pos2D object
     * @param x - x coordinate
     * @param y - y coordinate
     */
    constructor(x: number, y: number);
    /**
     * Returns a copy of this Pos2D object
     */
    clone(): Pos2D;
    /**
     * Checks if this position is the same as another position
     * @param other - The other Pos2D to compare with
     * @returns true if the positions have the same coordinates
     */
    equals(other: Pos2D): boolean;
}
