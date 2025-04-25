import { Style } from "../../style/style";
import { StyleManager } from "../../style/style-manager";
import { Theme } from "../../style/theme";
import { Rect } from "../../utils/shapes/rect";
import { Element } from "./element";

export abstract class Layout extends Element {
  protected elements: Element[] = [];

  updateTheme(theme: Theme): void {
    this.currentTheme = theme;
    super.updateTheme(theme);
    for (const element of this.elements) {
      element.updateTheme(theme);
    }
  }

  styleChildren(style: Partial<Style>) {
    for (const element of this.elements) {
      if (!(element.style instanceof StyleManager)) {
        throw new Error(
          "Element isn't using StyleManager, so can't override style",
        );
      }
      element.style.updateCustomStyle(style);
    }
  }

  abstract getRect(element: Element): Rect;
}
