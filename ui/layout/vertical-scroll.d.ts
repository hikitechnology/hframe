import { Context } from '../../context';
import { Painter } from '../../render/painter';
import { Rect } from '../../utils/shapes/rect';
import { Actions } from '../abstract/actions';
import { DirectionalLayout } from '../abstract/directional-layout';
import { Element } from '../abstract/element';
export declare class VerticalScroll extends DirectionalLayout {
    protected shiftContentForScrollbar: boolean;
    protected startFromBottom: boolean;
    protected dontScrollWhenHeld: string[];
    protected scrollOffset: number;
    protected scrollbarHovered: boolean;
    protected draggingScrollbar: boolean;
    constructor(shiftContentForScrollbar?: boolean, startFromBottom?: boolean, dontScrollWhenHeld?: string[]);
    protected update(rect: Rect, context: Context, actions?: Actions): void;
    protected render(rect: Rect, painter: Painter): void;
    protected updateScrollbar(rect: Rect, context: Context): void;
    protected renderScrollbar(rect: Rect, painter: Painter): void;
    protected getAllocRect(baseRect: Rect, element: Element): Rect;
    protected constrainScroll(rect: Rect): void;
    protected getContentRect(baseRect: Rect): Rect;
    protected get contentHeight(): number;
}
