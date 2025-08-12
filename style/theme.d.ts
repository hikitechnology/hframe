import { Element } from '../ui/abstract/element';
import { Style } from './style';
export declare abstract class Theme {
    protected styles: Record<string, Partial<Style>>;
    protected abstract defaultStyle: Style;
    protected static getStyles(theme: Theme): Record<string, Partial<Style>>;
    protected static getDefaultStyle(theme: Theme): Style;
    getStyleFor(element: Element | Function): Style;
    abstract get isDark(): boolean;
}
