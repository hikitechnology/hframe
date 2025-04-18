import { Pos2D } from "./pos2d";
import { Vec2D } from "./vec2d";

/**
 * Line segment from one point to another
 */
export class LineSegment {
  /**
   * Constructs a new LineSegment
   * @param p1 - position from
   * @param p2 - position to
   */
  constructor(
    public p1: Pos2D,
    public p2: Pos2D,
  ) {}

  /**
   * Constructs a new LineSegment from a set of coordinates
   * @param x1 - x coordinate from
   * @param y1 - y coordinate from
   * @param x2 - x coordinate to
   * @param y2 - y coordinate to
   */
  static from(x1: number, y1: number, x2: number, y2: number) {
    return new LineSegment(new Pos2D(x1, y1), new Pos2D(x2, y2));
  }

  /**
   * Returns a copy of this LineSegment
   */
  clone(): LineSegment {
    return new LineSegment(this.p1.clone(), this.p2.clone());
  }

  /**
   * Determines if a point touches this segment
   * @param point - point to test
   * @param leeway - tolerated distance from the line (default 0)
   */
  touchesPoint(point: Pos2D, leeway: number = 0) {
    // get vector representation of this line segment
    const segVector = this.toVec();

    // get vector representation of this segment's start to the point
    const pointVector = new Vec2D(point.x - this.p1.x, point.y - this.p1.y);

    const segLengthSq = segVector.length ** 2;

    // if this segment is a point, just check the distance to that point
    if (segLengthSq === 0) {
      const distance = pointVector.length;
      return distance <= leeway;
    }

    // project the point onto this line
    const projection = Math.max(
      0,
      Math.min(
        1,
        (pointVector.x * segVector.x + pointVector.y * segVector.y) /
          segLengthSq,
      ),
    );

    // find closest point on this segment
    const closestX = this.p1.x + projection * segVector.x;
    const closestY = this.p1.y + projection * segVector.y;

    // check the distance from the point to the closest point on this segment
    const distX = point.x - closestX;
    const distY = point.y - closestY;
    const dist = Math.sqrt(distX ** 2 + distY ** 2);

    return dist <= leeway;
  }

  /**
   * Returns the vector representation of this line segment
   */
  toVec() {
    return new Vec2D(this.p2.x - this.p1.x, this.p2.y - this.p1.y);
  }
}
