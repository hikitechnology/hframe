import { Color } from "../utils/color";

export interface Style {
  padding: number;
  fill: Color;
  outline: Color;
  textColor: Color;
  rounding: number;
  fontSize: number;
  textCenteredV: boolean;
  textCenteredH: boolean;
  lineSpacing: number;
  scrollbarBackground: Color;
  scrollbarColor: Color;
  scrollbarOutline: Color;
  sliderBackground: Color;
  sliderDotFill: Color;
}
