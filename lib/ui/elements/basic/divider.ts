import { LineSegment, Painter, Pos2D, Rect } from "../../../main";
import { Element } from "../../abstract/element";

export class Divider extends Element {
  protected update(): void {}

  renderElement(rect: Rect, painter: Painter): void {
    this.render(rect, painter);
  }

  protected render(rect: Rect, painter: Painter): void {
    const centerX = rect.center.x;
    const centerTop = new Pos2D(centerX, rect.y + this.style.padding);
    const centerBottom = new Pos2D(
      centerX,
      rect.y + rect.height - this.style.padding,
    );
    const line = new LineSegment(centerTop, centerBottom);
    painter.setColor(this.style.outline);
    painter.drawLine(line);
  }
}
