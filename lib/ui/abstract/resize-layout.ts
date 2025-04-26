import {
  H_RESIZE_CURSOR,
  RESIZE_LEEWAY,
  V_RESIZE_CURSOR,
} from "../../constants";
import { Context } from "../../context";
import { Rect } from "../../utils/shapes/rect";
import { Allocation, DirectionalLayout } from "./directional-layout";
import { Element } from "./element";

type ResizeSide = "top" | "bottom" | "left" | "right";

export abstract class ResizeLayout extends DirectionalLayout {
  protected resizing: {
    allocation: Allocation;
    direction: ResizeSide;
  } | null = null;

  protected update(rect: Rect, context: Context): void {
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

      if (
        this.getSizeInPixels(baseRect, allocation) -
          this.getMinSize(allocation) <=
        RESIZE_LEEWAY
      ) {
        let noRoom = false;
        for (let i = 0; i < this.elements.indexOf(element) - 1; i++) {
          const element = this.elements[i];
          const allocRect = this.getAllocRect(baseRect, element);
          if (
            allocRect.top.touchesPoint(context.mousePos, RESIZE_LEEWAY) ||
            allocRect.bottom.touchesPoint(context.mousePos, RESIZE_LEEWAY) ||
            allocRect.left.touchesPoint(context.mousePos, RESIZE_LEEWAY) ||
            allocRect.right.touchesPoint(context.mousePos, RESIZE_LEEWAY)
          ) {
            noRoom = true;
            break;
          }
        }
        if (noRoom) {
          continue;
        }
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
    if (this.resizing && this.cachedRect) {
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
          (this.getSizeInPixels(this.cachedRect, thisAllocation) -
            resizeDelta >=
            this.getMinSize(thisAllocation) ||
            Math.sign(resizeDelta) === -1) &&
          (this.getSizeInPixels(this.cachedRect, prevAllocation) +
            resizeDelta >=
            this.getMinSize(prevAllocation) ||
            Math.sign(resizeDelta) === 1)
        ) {
          this.growAllocation(prevAllocation, resizeDelta);
          this.growAllocation(thisAllocation, -resizeDelta);
        }
      } else {
        const nextAllocation =
          this.allocations[this.allocations.indexOf(thisAllocation) + 1];
        if (
          (this.getSizeInPixels(this.cachedRect, thisAllocation) +
            resizeDelta >=
            this.getMinSize(thisAllocation) ||
            Math.sign(resizeDelta) === 1) &&
          (this.getSizeInPixels(this.cachedRect, nextAllocation) -
            resizeDelta >=
            this.getMinSize(nextAllocation) ||
            Math.sign(resizeDelta) === -1)
        ) {
          this.growAllocation(thisAllocation, resizeDelta);
          this.growAllocation(nextAllocation, -resizeDelta);
        }
      }
      context.pauseInteraction();
    }
  }
}
