import { Context } from '../../../context';
import { Painter } from '../../../render/painter';
import { Rect } from '../../../utils/shapes/rect';
import { Actions } from '../../abstract/actions';
import { KeyboardInput } from '../../abstract/keyboard-input';
export declare class TextInput extends KeyboardInput {
    private cachedPainter;
    private dragSelectStart;
    constructor();
    protected update(rect: Rect, context: Context, actions?: Actions): void;
    protected render(rect: Rect, painter: Painter): void;
}
