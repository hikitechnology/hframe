import { Context } from '../../../context';
import { Freeform, Painter, Pos2D, Rect, Theme } from '../../../main';
import { Actions } from '../../abstract/actions';
import { Element } from '../../abstract/element';
export declare class TooltipProvider extends Element {
    private innerElement;
    private tooltipLayer;
    text: string;
    private mouseStillFor;
    private mouseStillStart;
    private showTooltip;
    private textElement;
    constructor(innerElement: Element, tooltipLayer: Freeform, text: string);
    updateElement(rect: Rect, context: Context, actions?: Actions): void;
    renderElement(rect: Rect, painter: Painter): void;
    protected update(rect: Rect, context: Context): void;
    protected render(): void;
    protected showAt(position: Pos2D): void;
    protected hide(): void;
    updateTheme(theme: Theme): void;
}
