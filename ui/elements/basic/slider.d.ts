import { Context } from '../../../context';
import { Painter } from '../../../render/painter';
import { Rect } from '../../../utils/shapes/rect';
import { Actions } from '../../abstract/actions';
import { Element } from '../../abstract/element';
export declare class Slider extends Element {
    minValue: number;
    maxValue: number;
    value: number;
    step: number;
    onDrag: (value: number) => void;
    private dragging;
    private height;
    constructor(minValue?: number, maxValue?: number, value?: number, step?: number, onDrag?: (value: number) => void);
    protected update(rect: Rect, context: Context, actions?: Actions): void;
    protected render(rect: Rect, painter: Painter): void;
    private handleDragging;
    private valueAsPercent;
    private percentAsValue;
}
