import { Context } from '../../../context';
import { Painter } from '../../../render/painter';
import { Rect } from '../../../utils/shapes/rect';
import { Actions } from '../../abstract/actions';
import { KeyboardInput } from '../../abstract/keyboard-input';
export declare class NumberInput extends KeyboardInput {
    minValue: number;
    maxValue: number;
    step: number;
    onChange: (value: number) => void;
    private numValue;
    private dragging;
    constructor(minValue: number, maxValue: number, value: number, step: number, onChange?: (value: number) => void);
    protected update(rect: Rect, context: Context, actions?: Actions): void;
    protected render(rect: Rect, painter: Painter): void;
    protected unfocus(): void;
    private handleDrag;
}
