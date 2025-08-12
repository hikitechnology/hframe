import { Context } from '../../context';
import { Rect } from '../../utils/shapes/rect';
import { Allocation, DirectionalLayout } from './directional-layout';
import { Element } from './element';
type ResizeSide = "top" | "bottom" | "left" | "right";
export declare abstract class ResizeLayout extends DirectionalLayout {
    protected resizing: {
        allocation: Allocation;
        direction: ResizeSide;
    } | null;
    protected update(rect: Rect, context: Context): void;
    protected handleResizes(baseRect: Rect, context: Context): void;
    protected getHoveredEdge(rect: Rect, context: Context): ResizeSide | null;
    protected checkIfValidResize(element: Element, resizeSide: ResizeSide): boolean;
    protected performResize(context: Context): void;
}
export {};
