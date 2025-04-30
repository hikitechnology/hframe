import { Context } from "../../../context";
import {
  Freeform,
  Painter,
  Pos2D,
  Rect,
  Text,
  Theme,
  TOOLTIP_CURSOR_OFFSET_X,
  TOOLTIP_CURSOR_OFFSET_Y,
  TOOLTIP_HOVER_TIME,
} from "../../../main";
import { Actions } from "../../abstract/actions";
import { Element } from "../../abstract/element";

export class TooltipProvider extends Element {
  private mouseStillFor: number = 0;
  private mouseStillStart: number | null = null;
  private showTooltip: boolean = false;
  private textElement: Text;

  constructor(
    private innerElement: Element,
    private tooltipLayer: Freeform,
    public text: string,
  ) {
    super();
    this.textElement = new Text(text);
    this.textElement.style.textWrap = false;
    this.textElement.style.textCenteredH = true;
    this.textElement.style.textCenteredV = true;
    this.tooltipLayer.add(this.textElement, {
      anchorX: "left",
      anchorY: "top",
      xOffset: 0,
      yOffset: 0,
      width: 0,
      height: 0,
    });
  }

  updateElement(rect: Rect, context: Context, actions?: Actions): void {
    this.update(rect, context);
    this.innerElement.updateElement(rect, context, actions);
  }

  renderElement(rect: Rect, painter: Painter): void {
    this.innerElement.renderElement(rect, painter);
  }

  protected update(rect: Rect, context: Context): void {
    if (rect.contains(context.mousePos) && context.mouseDelta.length === 0) {
      if (!this.mouseStillStart) {
        this.mouseStillStart = performance.now();
      } else {
        this.mouseStillFor = performance.now() - this.mouseStillStart;
      }

      if (this.mouseStillFor > TOOLTIP_HOVER_TIME) {
        this.showTooltip = true;
      }
    } else {
      this.showTooltip = false;
      this.mouseStillFor = 0;
      this.mouseStillStart = null;
    }

    if (this.showTooltip) {
      this.showAt(context.mousePos);
    } else {
      this.hide();
    }
  }

  protected render(): void {}

  protected showAt(position: Pos2D) {
    this.tooltipLayer.set(this.textElement, {
      xOffset: position.x + TOOLTIP_CURSOR_OFFSET_X,
      yOffset: position.y + TOOLTIP_CURSOR_OFFSET_Y,
      width: this.textElement.minWidth,
      height: this.textElement.minHeight,
    });
  }

  protected hide() {
    this.tooltipLayer.set(this.textElement, {
      xOffset: 0,
      yOffset: 0,
      width: 0,
      height: 0,
    });
  }

  updateTheme(theme: Theme): void {
    super.updateTheme(theme);
    this.innerElement.updateTheme(theme);
    this.textElement.style.fill = this.style.fill;
    this.textElement.style.outline = this.style.outline;
    this.textElement.style.fontSize = this.style.fontSize;
    this.textElement.style.padding = this.style.padding;
  }
}
