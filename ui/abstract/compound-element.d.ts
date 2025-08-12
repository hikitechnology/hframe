import { Actions, Context, DirectionalLayout, Painter, Rect, Theme } from '../../main';
import { Element } from './element';
export declare abstract class CompoundElement extends Element {
    protected innerLayout: DirectionalLayout;
    constructor(innerLayout: DirectionalLayout);
    protected update(rect: Rect, context: Context, actions?: Actions): void;
    protected render(rect: Rect, painter: Painter): void;
    updateTheme(theme: Theme): void;
    get minWidth(): number;
    get minHeight(): number;
}
