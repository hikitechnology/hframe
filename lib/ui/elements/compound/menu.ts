import { Context } from "../../../context";
import { Painter } from "../../../render/painter";
import { Theme } from "../../../style/theme";
import { Color } from "../../../utils/color";
import { Pos2D } from "../../../utils/shapes/pos2d";
import { Rect } from "../../../utils/shapes/rect";
import { Element } from "../../abstract/element";
import { Freeform } from "../../layout/freeform";
import { Vertical } from "../../layout/vertical";
import { Button } from "../basic/button";

export class Menu extends Element {
  private open: boolean = false;
  private justClosed: boolean = false;
  private prevPos: Pos2D | null = null;
  private innerLayout = new Vertical();

  constructor(
    private layer: Freeform,
    buttons: Button[],
  ) {
    super();
    layer.add(this, {
      width: 0,
      height: 0,
    });
    for (const button of buttons) {
      this.innerLayout.add(button);
    }
    this.innerLayout.styleChildren({
      outline: Color.TRANSPARENT,
      rounding: 0,
      textCentered: false,
    });
  }

  openAt(x: number, y: number) {
    if (
      this.justClosed &&
      this.prevPos &&
      this.prevPos.equals(new Pos2D(x, y))
    ) {
      return;
    }
    this.open = true;
    this.layer.set(this, {
      anchorX: "left",
      anchorY: "top",
      xOffset: x,
      yOffset: y,
      width: null,
      height: null,
    });
  }

  close() {
    this.justClosed = true;
    this.open = false;
    this.prevPos = this.layer.getRect(this).topLeft;
    this.layer.set(this, {
      width: 0,
      height: 0,
    });
  }

  protected update(rect: Rect, context: Context): void {
    this.justClosed = false;
    this.innerLayout.updateElement(rect, context);
    context.resumeInteraction();
    if (
      this.open &&
      !rect.contains(context.mousePos) &&
      context.justPressedMouse
    ) {
      this.close();
    }
  }

  protected render(rect: Rect, painter: Painter): void {
    this.innerLayout.renderElement(rect, painter);
  }

  updateTheme(theme: Theme): void {
    super.updateTheme(theme);
    this.innerLayout.updateTheme(theme);
  }

  get minWidth() {
    return this.innerLayout.minWidth;
  }

  get minHeight() {
    return this.innerLayout.minHeight;
  }
}
