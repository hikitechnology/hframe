import {
  H_RESIZE_CURSOR,
  RESIZE_LEEWAY,
  V_RESIZE_CURSOR,
} from "../../constants";
import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { Rect } from "../../utils/shapes/rect";
import { Actions } from "./actions";
import { Element } from "./element";
import { Layout } from "./layout";

type ResizeSide = "top" | "bottom" | "left" | "right";
type Allocation = {
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

export abstract class DirectionalLayout extends Layout {
  protected elements: Element[] = [];
  protected allocations: Allocation[] = [];
  protected resizing: {
    allocation: Allocation;
    direction: ResizeSide;
  } | null = null;
  protected cachedRect: Rect | null = null;

  constructor(private isVertical: boolean) {
    super();
  }

  add(element: Element): typeof this {
    this.elements.push(element);
    this.allocations.push({
      type: "relative",
      size: 1,
      minElementSize: {
        width: element.minWidth,
        height: element.minHeight,
      },
      resizable: false,
      setByUser: false,
    });
    return this;
  }

  addSized(
    element: Element,
    size: number,
    resizable: boolean = false,
    minSize?: number,
  ): typeof this {
    this.elements.push(element);
    this.allocations.push({
      type: "pixel",
      size,
      minSize,
      minElementSize: {
        width: element.minWidth,
        height: element.minHeight,
      },
      resizable,
      setByUser: true,
    });
    return this;
  }

  addRelative(
    element: Element,
    size: number,
    resizable: boolean = false,
    minSize?: number,
  ): typeof this {
    this.elements.push(element);
    this.allocations.push({
      type: "relative",
      size,
      minSize,
      minElementSize: {
        width: element.minWidth,
        height: element.minHeight,
      },
      resizable,
      setByUser: true,
    });
    return this;
  }

  remove(element: Element): void {
    const index = this.elements.indexOf(element);
    this.elements.splice(index, 1);
    this.allocations.splice(index, 1);
  }

  includes(element: Element): boolean {
    return this.elements.includes(element);
  }

  update(rect: Rect, context: Context): void {
    this.cachedRect = rect;

    this.updateMinSizes();
    this.handleResizes(rect, context);

    const afterPadding = rect.clone().grow(-this.style.padding);
    for (const element of this.elements) {
      const elementRect = this.getAllocRect(afterPadding, element);
      const actions: Actions = {
        requestWidth: (width) => {
          const allocation = this.getAllocation(element);
          if (!this.isVertical && !allocation.setByUser) {
            allocation.type = "pixel";
            allocation.size = width;
          }
        },
        requestHeight: (height) => {
          const allocation = this.getAllocation(element);
          if (this.isVertical && !allocation.setByUser) {
            allocation.type = "pixel";
            allocation.size = height;
          }
        },
      };
      element.update(elementRect, context, actions);
    }
  }

  render(rect: Rect, painter: Painter): void {
    this.renderSelf(rect, painter);

    painter.clip(rect);
    const afterPadding = rect.clone().grow(-this.style.padding);
    for (const element of this.elements) {
      const elementRect = this.getAllocRect(afterPadding, element);
      element.render(elementRect, painter);
    }
    painter.unclip();
  }

  protected updateMinSizes() {
    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];
      const allocation = this.allocations[i];
      allocation.minElementSize.width = element.minWidth;
      allocation.minElementSize.height = element.minHeight;
    }
  }

  protected getAllocation(element: Element) {
    const index = this.elements.indexOf(element);
    return this.allocations[index];
  }

  protected getAllocRect(baseRect: Rect, element: Element) {
    const allocation = this.getAllocation(element);

    // find the x/y coord to find the allocation rect at
    let offset = 0;
    for (const alloc of this.allocations) {
      if (alloc === allocation) {
        break;
      }
      if (alloc.type === "pixel") {
        offset += alloc.size;
      } else {
        offset +=
          (alloc.size / this.sumRelativeAllocations()) *
          ((this.isVertical ? baseRect.height : baseRect.width) -
            this.sumPixelAllocations());
      }
    }

    const x = baseRect.x + (this.isVertical ? 0 : offset);
    const y = baseRect.y + (this.isVertical ? offset : 0);

    const thisAllocSize =
      allocation.type === "pixel"
        ? allocation.size
        : (allocation.size / this.sumRelativeAllocations()) *
          ((this.isVertical ? baseRect.height : baseRect.width) -
            this.sumPixelAllocations());

    const width = this.isVertical ? baseRect.width : thisAllocSize;
    const height = this.isVertical ? thisAllocSize : baseRect.height;

    return Rect.from(x, y, width, height);
  }

  protected sumPixelAllocations() {
    const sum = this.allocations
      .filter((alloc) => alloc.type === "pixel")
      .reduce((sum, alloc) => sum + alloc.size, 0);
    return sum;
  }

  protected sumRelativeAllocations() {
    const sum = this.allocations
      .filter((alloc) => alloc.type === "relative")
      .reduce((sum, alloc) => sum + alloc.size, 0);
    return sum;
  }

  protected handleResizes(baseRect: Rect, context: Context) {
    for (const element of this.elements) {
      const allocation = this.getAllocation(element);
      const rect = this.getAllocRect(baseRect, element);
      if (!allocation.resizable) {
        continue;
      }

      const hoveredEdge = this.getHoveredEdge(rect, context);
      if (hoveredEdge && this.checkIfValidResize(element, hoveredEdge)) {
        context.cursor = this.isVertical ? V_RESIZE_CURSOR : H_RESIZE_CURSOR;
        if (context.justPressedMouse) {
          this.resizing = {
            allocation,
            direction: hoveredEdge,
          };
        }
      }
    }
    if (context.justReleasedMouse) {
      this.resizing = null;
    }
    this.performResize(context);
  }

  protected getHoveredEdge(rect: Rect, context: Context): ResizeSide | null {
    if (this.isVertical) {
      if (rect.top.touchesPoint(context.mousePos, RESIZE_LEEWAY)) {
        return "top";
      } else if (rect.bottom.touchesPoint(context.mousePos, RESIZE_LEEWAY)) {
        return "bottom";
      }
    } else {
      if (rect.left.touchesPoint(context.mousePos, RESIZE_LEEWAY)) {
        return "left";
      } else if (rect.right.touchesPoint(context.mousePos, RESIZE_LEEWAY)) {
        return "right";
      }
    }

    return null;
  }

  protected checkIfValidResize(
    element: Element,
    resizeSide: ResizeSide,
  ): boolean {
    const index = this.elements.indexOf(element);
    const isFirst = index === 0;
    const isLast = index === this.elements.length - 1;
    if (!isFirst && (resizeSide === "left" || resizeSide === "top")) {
      const prevConsents =
        this.allocations[index - 1].type === "relative" ||
        this.allocations[index - 1].resizable;
      if (prevConsents) {
        return true;
      }
    } else if (!isLast && (resizeSide === "right" || resizeSide === "bottom")) {
      const nextConsents =
        this.allocations[index + 1].type === "relative" ||
        this.allocations[index + 1].resizable;
      if (nextConsents) {
        return true;
      }
    }

    return false;
  }

  protected performResize(context: Context) {
    if (this.resizing) {
      context.cursor = this.isVertical ? V_RESIZE_CURSOR : H_RESIZE_CURSOR;
      const thisAllocation = this.resizing.allocation;
      const resizeDelta = context.mouseDelta[this.isVertical ? "y" : "x"];

      if (
        this.resizing.direction === "top" ||
        this.resizing.direction === "left"
      ) {
        const prevAllocation =
          this.allocations[this.allocations.indexOf(thisAllocation) - 1];
        this.growAllocation(prevAllocation, resizeDelta);
        this.growAllocation(thisAllocation, -resizeDelta);
      } else {
        const nextAllocation =
          this.allocations[this.allocations.indexOf(thisAllocation) + 1];
        this.growAllocation(thisAllocation, resizeDelta);
        this.growAllocation(nextAllocation, -resizeDelta);
      }
    }
  }

  protected growAllocation(allocation: Allocation, adjustment: number) {
    if (allocation.type === "pixel") {
      allocation.size += adjustment;
    } else {
      if (this.cachedRect) {
        const relatives = this.allocations.filter(
          (alloc) => alloc.type === "relative",
        );
        const totalRelative =
          (this.isVertical ? this.cachedRect.height : this.cachedRect.width) -
          this.sumPixelAllocations();
        const relativeAdjustment =
          (adjustment / totalRelative) * relatives.length;
        allocation.size += relativeAdjustment;
      }
    }
  }
}
