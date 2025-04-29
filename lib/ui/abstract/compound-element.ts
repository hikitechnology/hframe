import {
  Actions,
  Context,
  DirectionalLayout,
  Painter,
  Rect,
  Theme,
} from "../../main";
import { Element } from "./element";

export abstract class CompoundElement extends Element {
  protected innerLayout: DirectionalLayout;

  constructor(innerLayout: DirectionalLayout) {
    super();
    this.innerLayout = innerLayout;
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    this.innerLayout.updateElement(rect, context, actions);
  }

  protected render(rect: Rect, painter: Painter): void {
    this.innerLayout.renderElement(rect, painter);
  }

  updateTheme(theme: Theme): void {
    super.updateTheme(theme);
    this.innerLayout.updateTheme(theme);
  }
}
