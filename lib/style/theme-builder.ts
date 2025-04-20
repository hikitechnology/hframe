import { Color } from "../utils/color";
import { Style } from "./style";
import { Theme } from "./theme";

export class ThemeBuilder extends Theme {
  protected defaultStyle: Style = {
    padding: 0,
    fill: Color.rgb(255, 0, 255),
    outline: Color.BLACK,
    textColor: Color.BLACK,
    rounding: 0,
    fontSize: 13,
    textCenteredV: false,
    textCenteredH: false,
    lineSpacing: 1.1,
    scrollbarBackground: Color.WHITE,
    scrollbarColor: Color.BLACK,
    scrollbarOutline: Color.BLACK,
    sliderBackground: Color.WHITE,
    sliderDotFill: Color.BLACK,
  };
  protected _isDark: boolean = false;

  private constructor() {
    super();
  }

  static setDefault(style: Style): ThemeBuilder {
    const builder = new ThemeBuilder();
    builder.setDefault(style);
    return builder;
  }

  static setStyleFor(element: Function, style: Partial<Style>): ThemeBuilder {
    const builder = new ThemeBuilder();
    builder.setStyleFor(element, style);
    return builder;
  }

  static setIsDark(isDark: boolean = true): ThemeBuilder {
    const builder = new ThemeBuilder();
    builder.setIsDark(isDark);
    return builder;
  }

  setDefault(style: Style): this {
    this.defaultStyle = style;
    return this;
  }

  setStyleFor(element: Function, style: Partial<Style>): this {
    this.styles[element.name] = style;
    return this;
  }

  setIsDark(isDark: boolean = true): this {
    this._isDark = isDark;
    return this;
  }

  get isDark() {
    return this._isDark;
  }
}
