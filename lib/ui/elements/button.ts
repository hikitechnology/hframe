import { BUTTON_HOVERED_CHANGE } from "../../constants";
import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { Color } from "../../utils/color";
import { Rect } from "../../utils/shapes/rect";
import { Actions } from "../abstract/actions";
import { Element } from "../abstract/element";

export class Button extends Element {
  private hovered: boolean = false;
  private cachedPainter: Painter | null = null;

  constructor(
    public text: string,
    public onClick: () => void = () => {},
  ) {
    super();
  }

  update(rect: Rect, context: Context, actions?: Actions): void {
    if (rect.contains(context.mousePos)) {
      this.hovered = true;

      if (context.justPressedMouse) {
        this.onClick();
      }
    } else {
      this.hovered = false;
    }

    if (this.cachedPainter && actions) {
      const textWidth = this.cachedPainter.measureText(
        this.text,
        this.style.fontSize,
      );
      actions.requestWidth(textWidth + 2 * this.style.padding);
      actions.requestHeight(this.style.fontSize + 2 * this.style.padding);
    }
  }

  render(rect: Rect, painter: Painter): void {
    if (!this.cachedPainter) {
      this.cachedPainter = painter;
    }

    if (this.hovered) {
      painter.setColor(
        Color.adjustBrightness(this.style.fill, BUTTON_HOVERED_CHANGE),
      );
    } else {
      painter.setColor(this.style.fill);
    }
    painter.fillRect(rect, this.style.rounding);
    painter.setColor(this.style.outline);
    painter.outlineRect(rect, this.style.rounding);
    painter.setColor(this.style.textColor);
    painter.text(
      this.text,
      rect.center.x,
      rect.center.y,
      true,
      this.style.fontSize,
    );
  }
}
