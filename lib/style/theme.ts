import { Element } from "../ui/abstract/element";
import { Style } from "./style";

export abstract class Theme {
  protected styles: Record<string, Partial<Style>> = {};
  protected abstract defaultStyle: Style;

  getStyleFor(element: Element): Style {
    // recursive lookup for most specific styling
    let currentConstructor = element.constructor;
    while (currentConstructor && currentConstructor.name) {
      const style = this.styles[currentConstructor.name];
      if (style) {
        return { ...this.defaultStyle, ...style };
      }

      currentConstructor = Object.getPrototypeOf(currentConstructor);
    }

    // fallback case: return default style
    return this.defaultStyle;
  }

  abstract get isDark(): boolean;
}
