import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { Rect } from "../../utils/shapes/rect";
import { Element } from "../abstract/element";
import { Layout } from "../abstract/layout";

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

export class Freeform extends Layout {
  protected allocations: Allocation[] = [];
  protected cachedRect: Rect | null = null;

  add(
    element: Element,
    allocation: Partial<Omit<Allocation, "minElementSize">> = {},
  ): void {
    const {
      anchorX = "left",
      anchorY = "top",
      xOffset = 0,
      yOffset = 0,
      width = null,
      height = null,
    } = allocation;
    this.elements.push(element);
    this.allocations.push({
      width,
      height,
      anchorX,
      anchorY,
      xOffset,
      yOffset,
      minElementSize: {
        width: element.minWidth,
        height: element.minHeight,
      },
    });
  }

  set(
    element: Element,
    allocation: Partial<Omit<Allocation, "minElementSize">>,
  ) {
    const index = this.elements.indexOf(element);
    this.allocations[index] = {
      ...this.allocations[index],
      ...allocation,
    };
  }

  remove(element: Element): void {
    const index = this.elements.indexOf(element);
    this.elements.splice(index, 1);
    this.allocations.splice(index, 1);
  }

  includes(element: Element): boolean {
    return this.elements.includes(element);
  }

  getRect(element: Element): Rect {
    if (!this.cachedRect) {
      return Rect.from(NaN, NaN, NaN, NaN);
    }
    return this.getAllocRect(this.cachedRect, element);
  }

  protected update(rect: Rect, context: Context): void {
    const pausedBefore = context.interactionPaused;

    if (!rect.contains(context.mousePos)) {
      context.haltInteraction();
    }

    this.cachedRect = rect;
    this.updateMinSizes();

    for (const element of this.elements) {
      const allocRect = this.getAllocRect(rect, element);
      element.updateElement(allocRect, context);
    }

    if (!pausedBefore) {
      context.resumeInteraction();
    } else {
      context.haltInteraction();
    }
  }

  protected render(rect: Rect, painter: Painter): void {
    for (const element of this.elements) {
      const allocRect = this.getAllocRect(rect, element);
      element.renderElement(allocRect, painter);
    }
  }

  protected getAllocation(element: Element) {
    const index = this.elements.indexOf(element);
    return this.allocations[index];
  }

  protected getAllocRect(baseRect: Rect, element: Element): Rect {
    const allocation = this.getAllocation(element);

    let x;
    if (allocation.anchorX === "left") {
      x = baseRect.x + allocation.xOffset;
    } else {
      x =
        baseRect.x +
        baseRect.width -
        allocation.xOffset -
        this.getAllocWidth(allocation);
    }

    let y;
    if (allocation.anchorY === "top") {
      y = baseRect.y + allocation.yOffset;
    } else {
      y =
        baseRect.y +
        baseRect.height -
        allocation.yOffset -
        this.getAllocHeight(allocation);
    }

    return Rect.from(
      x,
      y,
      this.getAllocWidth(allocation),
      this.getAllocHeight(allocation),
    );
  }

  protected getAllocWidth(allocation: Allocation): number {
    if (allocation.width === null) {
      return allocation.minElementSize.width;
    }
    return allocation.width;
  }

  protected getAllocHeight(allocation: Allocation): number {
    if (allocation.height === null) {
      return allocation.minElementSize.height;
    }
    return allocation.height;
  }

  protected updateMinSizes() {
    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];
      const allocation = this.allocations[i];
      allocation.minElementSize.width = element.minWidth;
      allocation.minElementSize.height = element.minHeight;
    }
  }
}
