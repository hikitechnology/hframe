import { Context } from '../../../context';
import { Painter } from '../../../render/painter';
import { Rect } from '../../../utils/shapes/rect';
import { Actions } from '../../abstract/actions';
import { Element } from '../../abstract/element';
export declare class Button extends Element {
    onClick: () => void;
    private hovered;
    private cachedPainter;
    private _text;
    private _minHeight;
    private _minWidth;
    private needsRecalc;
    constructor(text: string, onClick?: () => void);
    set text(newText: string);
    get text(): string;
    protected update(rect: Rect, context: Context, actions?: Actions): void;
    protected render(rect: Rect, painter: Painter): void;
    get minHeight(): number;
    get minWidth(): number;
}
