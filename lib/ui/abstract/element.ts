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

  updateTheme(theme: Theme) {
    this._style.updateBaseStyle(theme.getStyleFor(this));
  }

  protected renderSelf(rect: Rect, painter: Painter): void {
    painter.setColor(this.style.fill);
    painter.fillRect(rect);
    painter.setColor(this.style.outline);
    painter.outlineRect(rect);
  }

  abstract update(rect: Rect, context: Context, actions?: Actions): void;
  abstract render(rect: Rect, painter: Painter): void;

  get style(): Style {
    return this._style;
  }

  get minWidth(): number {
    return 0;
  }

  get minHeight(): number {
    return 0;
  }
}
