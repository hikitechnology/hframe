import {
  SLIDER_DOT_RADIUS,
  SLIDER_DOT_ROUNDING,
  SLIDER_LINE_HEIGHT,
  SLIDER_LINE_ROUNDING,
} from "../../../constants";
import { Context } from "../../../context";
import { Painter } from "../../../render/painter";
import { MathHelpers } from "../../../utils/math-helpers";
import { Rect } from "../../../utils/shapes/rect";
import { Actions } from "../../abstract/actions";
import { Element } from "../../abstract/element";

export class Slider extends Element {
  private dragging: boolean = false;
  private height: number = Math.max(2 * SLIDER_DOT_RADIUS, SLIDER_LINE_HEIGHT);

  constructor(
    public minValue: number = 0,
    public maxValue: number = 10,
    public value: number = 5,
    public step: number = 1,
    public onDrag: (value: number) => void = () => {},
  ) {
    super();
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    if (actions) {
      actions.requestHeight(this.height);
    }
    this.handleDragging(rect, context);
  }

  protected render(rect: Rect, painter: Painter): void {
    const sliderLineRect = Rect.from(
      rect.x + SLIDER_DOT_RADIUS,
      rect.y +
        (rect.height - this.height) / 2 +
        SLIDER_DOT_RADIUS -
        SLIDER_LINE_HEIGHT / 2,
      rect.width - 2 * SLIDER_DOT_RADIUS,
      SLIDER_LINE_HEIGHT,
    );
    const sliderDotRect = Rect.from(
      sliderLineRect.x +
        this.valueAsPercent() * sliderLineRect.width -
        SLIDER_DOT_RADIUS,
      rect.y + (rect.height - this.height) / 2,
      SLIDER_DOT_RADIUS * 2,
      SLIDER_DOT_RADIUS * 2,
    );

    painter.setColor(this.style.sliderBackground);
    painter.fillRect(sliderLineRect, SLIDER_LINE_ROUNDING);

    painter.setColor(this.style.sliderDotFill);
    painter.fillRect(sliderDotRect, SLIDER_DOT_ROUNDING);
  }

  private handleDragging(rect: Rect, context: Context) {
    const dragZone = Rect.from(
      rect.x + SLIDER_DOT_RADIUS,
      rect.y + (rect.height - this.height) / 2,
      rect.width - 2 * SLIDER_DOT_RADIUS,
      this.height,
    );
    if (dragZone.contains(context.mousePos) && context.justPressedMouse) {
      this.dragging = true;
    }
    if (context.justReleasedMouse) {
      this.dragging = false;
    }
    if (this.dragging) {
      const percentAcross = (context.mousePos.x - dragZone.x) / dragZone.width;
      this.value = MathHelpers.strip(
        MathHelpers.roundToNearest(
          MathHelpers.clamp(
            this.percentAsValue(percentAcross),
            this.minValue,
            this.maxValue,
          ),
          this.step,
        ),
      );
      this.onDrag(this.value);
    }
  }

  private valueAsPercent() {
    const adjustedMax = this.maxValue - this.minValue;
    return (this.value - this.minValue) / adjustedMax;
  }

  private percentAsValue(percent: number) {
    const adjustedMax = this.maxValue - this.minValue;
    return adjustedMax * percent + this.minValue;
  }
}
