import { LineSegment } from "./line-segment";
import { Pos2D } from "./pos2d";
import { Vec2D } from "./vec2d";

/**
 * Rectangle in a 2D space
 */
export class Rect {
  /**
   * Constructs a new Rect
   * @param position - position of the top left corner
   * @param size - size vector
   */
  constructor(
    private position: Pos2D,
    private size: Vec2D,
  ) {}

  /**
   * Constructs a new rect
   * @param x - x coordinate of top left corner
   * @param y - y coordinate of top left corner
   * @param width - width of the rectangle
   * @param height - height of the rectangle
   */
  static from(x: number, y: number, width: number, height: number) {
    return new Rect(new Pos2D(x, y), new Vec2D(width, height));
  }

  /**
   * Check if the Rect contains a Pos2D point, with optional leeway
   * @param position - Pos2D point
   * @param leeway - tolerated distance from rect (default 0)
   */
  contains(position: Pos2D, leeway: number = 0) {
    const leftEdge = this.position.x - leeway;
    const rightEdge = this.position.x + this.size.x + leeway;

    const topEdge = this.position.y - leeway;
    const bottomEdge = this.position.y + this.size.y + leeway;

    const hContains = leftEdge <= position.x && position.x <= rightEdge;
    const vContains = topEdge <= position.y && position.y <= bottomEdge;

    return hContains && vContains;
  }

  /**
   * Grows a Rect from its center by the given distance on each side, and returns itself
   * Shrinks the Rect if the value is negative
   * @param shrinkBy - How much to shrink each side by
   */
  grow(shrinkBy: number): Rect {
    this.x -= shrinkBy;
    this.y -= shrinkBy;
    this.width += shrinkBy * 2;
    this.height += shrinkBy * 2;
    return this;
  }

  /**
   * Returns a copy of this Rect
   */
  clone(): Rect {
    return new Rect(this.position.clone(), this.size.clone());
  }

  // ----- getters & setters -----
  get x() {
    return this.position.x;
  }

  set x(x) {
    this.position.x = x;
  }

  get y() {
    return this.position.y;
  }

  set y(y) {
    this.position.y = y;
  }

  get width() {
    return this.size.x;
  }

  set width(x) {
    this.size.x = x;
  }

  get height() {
    return this.size.y;
  }

  set height(y) {
    this.size.y = y;
  }

  get topLeft() {
    return new Pos2D(this.x, this.y);
  }

  get topRight() {
    return new Pos2D(this.x + this.width, this.y);
  }

  get bottomLeft() {
    return new Pos2D(this.x, this.y + this.height);
  }

  get bottomRight() {
    return new Pos2D(this.x + this.width, this.y + this.height);
  }

  get center() {
    return new Pos2D(this.x + this.width / 2, this.y + this.height / 2);
  }

  get left() {
    return new LineSegment(this.topLeft, this.bottomLeft);
  }

  get right() {
    return new LineSegment(this.topRight, this.bottomRight);
  }

  get top() {
    return new LineSegment(this.topLeft, this.topRight);
  }

  get bottom() {
    return new LineSegment(this.bottomLeft, this.bottomRight);
  }
}
