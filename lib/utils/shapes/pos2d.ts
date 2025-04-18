/**
 * Position on a 2D plane
 */
export class Pos2D {
  /**
   * Constructs a new Pos2D object
   * @param x - x coordinate
   * @param y - y coordinate
   */
  constructor(
    public x: number,
    public y: number,
  ) {}

  /**
   * Returns a copy of this Pos2D object
   */
  clone(): Pos2D {
    return new Pos2D(this.x, this.y);
  }

  /**
   * Checks if this position is the same as another position
   * @param other - The other Pos2D to compare with
   * @returns true if the positions have the same coordinates
   */
  equals(other: Pos2D): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
