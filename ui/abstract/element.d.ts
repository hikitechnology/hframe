import { Context } from '../../context';
import { Painter } from '../../render/painter';
import { Style } from '../../style/style';
import { Theme } from '../../style/theme';
import { Rect } from '../../utils/shapes/rect';
import { Actions } from './actions';
export declare abstract class Element {
    private _style;
    protected currentTheme: Theme;
    protected lastRect: Rect | null;
    allowPassthrough: boolean;
    updateTheme(theme: Theme): void;
    updateElement(rect: Rect, context: Context, actions?: Actions): void;
    renderElement(rect: Rect, painter: Painter): void;
    protected renderSelf(rect: Rect, painter: Painter): void;
    protected abstract update(rect: Rect, context: Context, actions?: Actions): void;
    protected abstract render(rect: Rect, painter: Painter): void;
    get style(): Style;
    set style(newStyle: Partial<Style>);
    get minWidth(): number;
    get minHeight(): number;
}
