/**
 * 2D measurement of direction and magnitude
 */
export class Vec2D {
  /**
   * Constructs a new Vec2D object
   * @param x - width
   * @param y - height
   */
  constructor(
    public x: number,
    public y: number,
  ) {}

  /**
   * Returns a copy of this Vec2D object
   */
  clone() {
    return new Vec2D(this.x, this.y);
  }

  equals(other: Vec2D): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Returns the length of a vector
   */
  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}
