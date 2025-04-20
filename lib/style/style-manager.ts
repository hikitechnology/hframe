import { Color } from "../utils/color";
import { Style } from "./style";

export class StyleManager implements Style {
  private custom: Partial<Style> = {};

  declare padding: number;
  declare fill: Color;
  declare altFill: Color;
  declare outline: Color;
  declare textColor: Color;
  declare rounding: number;
  declare fontSize: number;
  declare textCenteredV: boolean;
  declare textCenteredH: boolean;
  declare lineSpacing: number;
  declare scrollbarColor: Color;
  declare scrollbarBackground: Color;
  declare scrollbarOutline: Color;
  declare sliderBackground: Color;
  declare sliderDotFill: Color;

  constructor(private style: Style) {
    const defineProperty = <K extends keyof Style>(key: K) => {
      Object.defineProperty(this, key, {
        get: () => this.custom[key] ?? this.style[key],
        set: (value: Style[K]) => {
          this.custom[key] = value;
        },
        enumerable: true,
      });
    };

    (Object.keys(style) as (keyof Style)[]).forEach((key) => {
      defineProperty(key);
    });
  }

  updateBaseStyle(baseStyle: Style) {
    this.style = baseStyle;
  }

  updateCustomStyle(userStyle: Partial<Style>) {
    this.custom = userStyle;
  }
}
