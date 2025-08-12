import { Context } from '../../context';
import { Painter } from '../../render/painter';
import { Rect } from '../../utils/shapes/rect';
import { Element } from '../abstract/element';
import { Layout } from '../abstract/layout';
type Allocation = {
    width: number | null;
    height: number | null;
    anchorX: "left" | "right";
    anchorY: "top" | "bottom";
    xOffset: number;
    yOffset: number;
    minElementSize: {
        width: number;
        height: number;
    };
};
export declare class Freeform extends Layout {
    protected allocations: Allocation[];
    protected cachedRect: Rect | null;
    add(element: Element, allocation?: Partial<Omit<Allocation, "minElementSize">>): typeof this;
    set(element: Element, allocation: Partial<Omit<Allocation, "minElementSize">>): void;
    remove(element: Element): void;
    includes(element: Element): boolean;
    getRect(element: Element): Rect;
    protected update(rect: Rect, context: Context): void;
    protected render(rect: Rect, painter: Painter): void;
    protected getAllocation(element: Element): Allocation;
    protected getAllocRect(baseRect: Rect, element: Element): Rect;
    protected getAllocWidth(allocation: Allocation): number;
    protected getAllocHeight(allocation: Allocation): number;
    protected updateMinSizes(): void;
}
export {};
