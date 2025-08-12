import { Color } from '../utils/color';
import { Style } from './style';
export declare class StyleManager implements Style {
    private style;
    private custom;
    padding: number;
    fill: Color;
    altFill: Color;
    outline: Color;
    textColor: Color;
    rounding: number;
    fontSize: number;
    textCenteredV: boolean;
    textCenteredH: boolean;
    textWrap: boolean;
    lineSpacing: number;
    scrollbarColor: Color;
    scrollbarBackground: Color;
    scrollbarOutline: Color;
    sliderBackground: Color;
    sliderDotFill: Color;
    font: string;
    constructor(style: Style);
    updateBaseStyle(baseStyle: Style): void;
    updateCustomStyle(userStyle: Partial<Style>): void;
}
