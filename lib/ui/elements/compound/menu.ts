import { MENU_MIN_WIDTH } from "../../../constants";
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
  private prevContents: Button[] = [];

  constructor(private layer: Freeform) {
    super();
    layer.add(this, {
      width: 0,
      height: 0,
    });
    this.innerLayout.style.fill = Color.TRANSPARENT;
    this.innerLayout.style.outline = Color.TRANSPARENT;
  }

  setContents(buttons: Button[]) {
    if (buttons === this.prevContents) {
      return;
    }
    this.innerLayout.clear();
    this.innerLayout.add(...buttons);
    this.innerLayout.styleChildren({
      outline: Color.TRANSPARENT,
      rounding: 0,
      textCenteredH: false,
    });
  }

  openAt(pos: Pos2D) {
    if (this.justClosed && this.prevPos && this.prevPos.equals(pos)) {
      return;
    }
    this.open = true;
    this.layer.set(this, {
      anchorX: "left",
      anchorY: "top",
      xOffset: pos.x,
      yOffset: pos.y,
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
    this.innerLayout.updateTheme(theme);
  }

  get minWidth() {
    return Math.max(this.innerLayout.minWidth, MENU_MIN_WIDTH);
  }

  get minHeight() {
    return this.innerLayout.minHeight;
  }
}
