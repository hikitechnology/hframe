import { DRAGINPUT_SCALING, H_RESIZE_CURSOR } from "../../../constants";
import { Context } from "../../../context";
import { Painter } from "../../../render/painter";
import { MathHelpers } from "../../../utils/math-helpers";
import { Rect } from "../../../utils/shapes/rect";
import { Actions } from "../../abstract/actions";
import { KeyboardInput } from "../../abstract/keyboard-input";

export class NumberInput extends KeyboardInput {
  private numValue: number;
  private dragging: boolean = false;

  constructor(
    public minValue: number,
    public maxValue: number,
    value: number,
    public step: number,
    public onChange: (value: number) => void = () => {},
  ) {
    super();
    this.numValue = value;
    this.value = value.toString();
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    if (actions) {
      actions.requestHeight(this.style.fontSize + 2 * this.style.padding);
    }

    if (rect.contains(context.mousePos)) {
      context.cursor = H_RESIZE_CURSOR;
      if (context.justDoubleClicked) {
        this.focus();
        this.collectInput(context);
        this.selectAll(context);
      }
    } else if (context.justPressedMouse) {
      this.unfocus();
    }

    this.handleDrag(rect, context);
  }

  protected render(rect: Rect, painter: Painter): void {
    painter.clip(rect);
    if (this.focused) {
      this.drawSelectionHighlight(painter, rect);
      this.drawCursor(painter, rect);
    }
    painter.setColor(this.style.textColor);
    painter.text(
      this.value,
      rect.x + this.style.padding - this.textShift,
      rect.y + this.style.padding,
      false,
      false,
      this.style.fontSize,
    );
    painter.unclip();
  }

  protected unfocus(): void {
    this.focused = false;
    const numValue = MathHelpers.clamp(
      Number(this.value),
      this.minValue,
      this.maxValue,
    );
    if (!Number.isNaN(numValue)) {
      this.numValue = numValue;
    }
    this.value = this.numValue.toString();
    this.onChange(this.numValue);
  }

  private handleDrag(rect: Rect, context: Context): void {
    if (rect.contains(context.mousePos) && context.justPressedMouse) {
      this.dragging = true;
    }
    if (context.justReleasedMouse) {
      this.dragging = false;
    }
    if (this.dragging) {
      this.numValue = MathHelpers.strip(
        MathHelpers.clamp(
          this.numValue +
            MathHelpers.roundToNearest(
              context.mouseDelta.x * DRAGINPUT_SCALING * this.step,
              this.step,
            ),
          this.minValue,
          this.maxValue,
        ),
      );
      this.value = this.numValue.toString();
      this.onChange(this.numValue);
    }
  }
}
