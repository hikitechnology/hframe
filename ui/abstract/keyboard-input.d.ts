import { Context } from '../../context';
import { Painter } from '../../render/painter';
import { Rect } from '../../utils/shapes/rect';
import { Element } from './element';
export declare abstract class KeyboardInput extends Element {
    value: string;
    protected focused: boolean;
    protected selectionStart: number;
    protected selectionEnd: number;
    protected textShift: number;
    protected collectInput(context: Context): void;
    protected getCaretPositionFromMouse(mouseX: number, rect: Rect, painter: Painter): number;
    protected drawCursor(painter: Painter, rect: Rect): void;
    protected updateTextShift(painter: Painter, rect: Rect): void;
    protected selectAll(context: Context): void;
    protected drawSelectionHighlight(painter: Painter, rect: Rect): void;
    protected focus(): void;
    protected unfocus(): void;
}
