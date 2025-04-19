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
  private _minHeight: number = 0;
  private _minWidth: number = 0;

  constructor(
    public text: string,
    public onClick: () => void = () => {},
  ) {
    super();
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
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
      this._minWidth = textWidth + 2 * this.style.padding;
      this._minHeight = this.style.fontSize + 2 * this.style.padding;
      actions.requestWidth(this._minWidth);
      actions.requestHeight(this._minHeight);
    }
  }

  protected render(rect: Rect, painter: Painter): void {
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
      this.style.textCentered
        ? rect.center.x
        : rect.topLeft.x + this.style.padding,
      this.style.textCentered
        ? rect.center.y
        : rect.topLeft.y + this.style.padding,
      this.style.textCentered,
      this.style.fontSize,
    );
  }

  get minHeight() {
    return this._minHeight;
  }

  get minWidth() {
    return this._minWidth;
  }
}
