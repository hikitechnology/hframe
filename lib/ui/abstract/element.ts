import { FALLBACK_THEME } from "../../constants";
import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { Style } from "../../style/style";
import { StyleManager } from "../../style/style-manager";
import { Theme } from "../../style/theme";
import { Rect } from "../../utils/shapes/rect";
import { Actions } from "./actions";

export abstract class Element {
  private _style: StyleManager = new StyleManager(
    FALLBACK_THEME.getStyleFor(this),
  );
  protected currentTheme: Theme = FALLBACK_THEME;
  allowPassthrough: boolean = false;

  updateTheme(theme: Theme) {
    this.currentTheme = theme;
    this._style.updateBaseStyle(theme.getStyleFor(this));
  }

  updateElement(rect: Rect, context: Context, actions?: Actions): void {
    const mouseInBounds = rect.contains(context.mousePos);
    if (!mouseInBounds) {
      context.pauseInteraction();
    }

    this.update(rect, context, actions);

    if (mouseInBounds && this.allowPassthrough === false) {
      context.pauseInteraction();
    } else {
      context.resumeInteraction();
    }
  }

  renderElement(rect: Rect, painter: Painter): void {
    this.renderSelf(rect, painter);
    this.render(rect, painter);
  }

  protected renderSelf(rect: Rect, painter: Painter): void {
    painter.setColor(this.style.fill);
    painter.fillRect(rect, this.style.rounding);
    painter.setColor(this.style.outline);
    painter.outlineRect(rect, this.style.rounding);
  }

  protected abstract update(
    rect: Rect,
    context: Context,
    actions?: Actions,
  ): void;
  protected abstract render(rect: Rect, painter: Painter): void;

  get style(): Style {
    return this._style;
  }

  set style(newStyle: Partial<Style>) {
    this._style.updateCustomStyle(newStyle);
  }

  get minWidth(): number {
    return 0;
  }

  get minHeight(): number {
    return 0;
  }
}
