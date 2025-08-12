import { Style } from '../../style/style';
import { Theme } from '../../style/theme';
import { Rect } from '../../utils/shapes/rect';
import { Element } from './element';
export declare abstract class Layout extends Element {
    protected elements: Element[];
    updateTheme(theme: Theme): void;
    styleChildren(style: Partial<Style>): void;
    abstract getRect(element: Element): Rect;
}
