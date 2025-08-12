import { Painter, Rect } from '../../../main';
import { Element } from '../../abstract/element';
export declare class Divider extends Element {
    protected update(): void;
    renderElement(rect: Rect, painter: Painter): void;
    protected render(rect: Rect, painter: Painter): void;
}
