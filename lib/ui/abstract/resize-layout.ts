import {
  H_RESIZE_CURSOR,
  RESIZE_LEEWAY,
  V_RESIZE_CURSOR,
} from "../../constants";
import { Context } from "../../context";
import { Rect } from "../../utils/shapes/rect";
import { Allocation } from "./allocation";
import { DirectionalLayout } from "./directional-layout";
import { Element } from "./element";

type ResizeSide = "top" | "bottom" | "left" | "right";

export abstract class ResizeLayout extends DirectionalLayout {
  protected resizing: {
    allocation: Allocation;
    direction: ResizeSide;
  } | null = null;
  protected cachedRect: Rect | null = null;

  update(rect: Rect, context: Context): void {
    this.cachedRect = rect;
    this.handleResizes(rect, context);
    super.update(rect, context);
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
        if (
          this.getSizeInPixels(thisAllocation) - resizeDelta >=
            this.getMinSize(thisAllocation) &&
          this.getSizeInPixels(prevAllocation) + resizeDelta >=
            this.getMinSize(prevAllocation)
        ) {
          this.growAllocation(prevAllocation, resizeDelta);
          this.growAllocation(thisAllocation, -resizeDelta);
        }
      } else {
        const nextAllocation =
          this.allocations[this.allocations.indexOf(thisAllocation) + 1];
        if (
          this.getSizeInPixels(thisAllocation) - resizeDelta >=
            this.getMinSize(thisAllocation) &&
          this.getSizeInPixels(nextAllocation) + resizeDelta >=
            this.getMinSize(nextAllocation)
        ) {
          this.growAllocation(thisAllocation, resizeDelta);
          this.growAllocation(nextAllocation, -resizeDelta);
        }
      }

      context.haltInteraction();
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
        if (relatives.length > 1) {
          const totalRelative =
            (this.isVertical ? this.cachedRect.height : this.cachedRect.width) -
            this.sumPixelAllocations();
          const totalRelativeSize = relatives.reduce(
            (sum, alloc) => sum + alloc.size,
            0,
          );
          const relativeAdjustment =
            (adjustment / totalRelative) * totalRelativeSize;
          allocation.size += relativeAdjustment;
        }
      }
    }
  }

  protected getSizeInPixels(allocation: Allocation): number {
    if (!this.cachedRect) {
      throw new Error("No cached rect to calculate pixel size from");
    }
    if (allocation.type === "pixel") {
      return allocation.size;
    }
    return (
      (allocation.size / this.sumRelativeAllocations()) *
      ((this.isVertical ? this.cachedRect.height : this.cachedRect.width) -
        this.sumPixelAllocations())
    );
  }

  protected getMinSize(allocation: Allocation): number {
    if (!allocation.minSize && allocation.minSize !== 0) {
      return this.isVertical
        ? allocation.minElementSize.height
        : allocation.minElementSize.width;
    }
    return allocation.minSize;
  }
}
