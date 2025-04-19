import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { Rect } from "../../utils/shapes/rect";
import { Element } from "../abstract/element";
import { Layout } from "../abstract/layout";

type Allocation = {
  width?: number;
  height?: number;
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
  private allocations: Allocation[] = [];

  add(
    element: Element,
    width?: number,
    height?: number,
    anchorX: Allocation["anchorX"] = "left",
    anchorY: Allocation["anchorY"] = "top",
    xOffset: number = 0,
    yOffset: number = 0,
  ): void {
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

  remove(element: Element): void {
    const index = this.elements.indexOf(element);
    this.elements.splice(index, 1);
    this.allocations.splice(index, 1);
  }

  includes(element: Element): boolean {
    return this.elements.includes(element);
  }

  update(rect: Rect, context: Context): void {
    this.updateMinSizes();

    for (const element of this.elements) {
      const allocRect = this.getAllocRect(rect, element);
      element.updateElement(allocRect, context);
    }
  }

  render(rect: Rect, painter: Painter): void {
    for (const element of this.elements) {
      const allocRect = this.getAllocRect(rect, element);
      element.renderElement(allocRect, painter);
    }
  }

  private getAllocation(element: Element) {
    const index = this.elements.indexOf(element);
    return this.allocations[index];
  }

  private getAllocRect(baseRect: Rect, element: Element): Rect {
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

  private getAllocWidth(allocation: Allocation): number {
    if (!allocation.width && allocation.width !== 0) {
      return allocation.minElementSize.width;
    }
    return allocation.width;
  }

  private getAllocHeight(allocation: Allocation): number {
    if (!allocation.height && allocation.height !== 0) {
      return allocation.minElementSize.height;
    }
    return allocation.height;
  }

  private updateMinSizes() {
    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];
      const allocation = this.allocations[i];
      allocation.minElementSize.width = element.minWidth;
      allocation.minElementSize.height = element.minHeight;
    }
  }
}
