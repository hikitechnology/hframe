import { Context } from '../../context';
import { Painter } from '../../render/painter';
import { Rect } from '../../utils/shapes/rect';
import { Element } from './element';
import { Layout } from './layout';
export type Allocation = {
    type: "pixel" | "relative";
    size: number;
    minSize?: number;
    minElementSize: {
        width: number;
        height: number;
    };
    resizable: boolean;
    setByUser: boolean;
};
export declare abstract class DirectionalLayout extends Layout {
    protected isVertical: boolean;
    protected allocations: Allocation[];
    protected cachedRect: Rect | null;
    constructor(isVertical: boolean, hasOutline: boolean, hasFill: boolean);
    gap(size?: number): typeof this;
    add(...elements: Element[]): typeof this;
    addSized(element: Element, size: number, resizable?: boolean, minSize?: number): typeof this;
    addRelative(element: Element, size: number, resizable?: boolean, minSize?: number): typeof this;
    insert(index: number, element: Element): typeof this;
    insertSized(index: number, element: Element, size: number, resizable?: boolean, minSize?: number): typeof this;
    insertRelative(index: number, element: Element, size: number, resizable?: boolean, minSize?: number): typeof this;
    remove(element: Element): void;
    includes(element: Element): boolean;
    clear(): void;
    indexOf(element: Element): number;
    setSize(element: Element, newSize: number): void;
    getRect(element: Element): Rect;
    protected update(rect: Rect, context: Context): void;
    protected render(rect: Rect, painter: Painter): void;
    protected updateMinSizes(): void;
    protected getAllocation(element: Element): Allocation;
    protected getAllocRect(baseRect: Rect, element: Element): Rect;
    protected getSizeInPixels(baseRect: Rect, allocation: Allocation): number;
    protected sumPixelAllocations(): number;
    protected sumRelativeAllocations(): number;
    protected getMinSize(allocation: Allocation): number;
    protected growAllocation(allocation: Allocation, adjustment: number): void;
    get minWidth(): number;
    get minHeight(): number;
}
