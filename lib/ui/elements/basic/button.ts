import { BUTTON_HOVERED_CHANGE } from "../../../constants";
import { Context } from "../../../context";
import { Painter } from "../../../render/painter";
import { Color } from "../../../utils/color";
import { Rect } from "../../../utils/shapes/rect";
import { Actions } from "../../abstract/actions";
import { Element } from "../../abstract/element";

export class Button extends Element {
  private hovered: boolean = false;
  private cachedPainter: Painter | null = null;
  private _text: string;
  private _minHeight: number = 0;
  private _minWidth: number = 0;
  private needsRecalc: boolean = true;

  constructor(
    text: string,
    public onClick: () => void = () => {},
  ) {
    super();
    this._text = text;
  }

  set text(newText: string) {
    if (newText !== this._text) {
      this._text = newText;
      this.needsRecalc = true;
    }
  }

  get text(): string {
    return this._text;
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

    if (this.cachedPainter && this.needsRecalc) {
      const textWidth = this.cachedPainter.measureText(
        this._text,
        this.style.fontSize,
      );
      this._minWidth = textWidth + 2 * this.style.padding;
      this._minHeight = this.style.fontSize + 2 * this.style.padding;
      this.needsRecalc = false;
    }

    if (actions) {
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
    painter.clip(rect);
    painter.text(
      this.text,
      this.style.textCenteredH
        ? rect.center.x
        : rect.topLeft.x + this.style.padding,
      this.style.textCenteredV
        ? rect.center.y
        : rect.topLeft.y + this.style.padding,
      this.style.textCenteredH,
      this.style.textCenteredV,
      this.style.fontSize,
    );
    painter.unclip();
  }

  get minHeight() {
    return this._minHeight;
  }

  get minWidth() {
    return this._minWidth;
  }
}
