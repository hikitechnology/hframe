import { Style } from './style';
import { Theme } from './theme';
export declare class ThemeBuilder extends Theme {
    protected defaultStyle: Style;
    protected _isDark: boolean;
    private constructor();
    static extend(theme: Theme): ThemeBuilder;
    static setDefault(style: Style): ThemeBuilder;
    static setStyleFor(element: Function, style: Partial<Style>): ThemeBuilder;
    static setIsDark(isDark?: boolean): ThemeBuilder;
    setDefault(style: Style): this;
    setStyleFor(element: Function, style: Partial<Style>): this;
    setIsDark(isDark?: boolean): this;
    lock(): Theme;
    get isDark(): boolean;
}
