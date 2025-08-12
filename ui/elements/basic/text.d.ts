import { Context } from '../../../context';
import { Painter } from '../../../render/painter';
import { Rect } from '../../../utils/shapes/rect';
import { Actions } from '../../abstract/actions';
import { Element } from '../../abstract/element';
export declare class Text extends Element {
    private _text;
    private cachedPainter;
    private lines;
    private height;
    private lastWidth;
    private widthNoWrap;
    private textChanged;
    constructor(text?: string, fontSize?: number);
    protected update(rect: Rect, _context: Context, actions?: Actions): void;
    protected render(rect: Rect, painter: Painter): void;
    get minWidth(): number;
    get minHeight(): number;
    get text(): string;
    set text(text: string);
}
