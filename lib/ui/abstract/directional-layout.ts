import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { Rect } from "../../utils/shapes/rect";
import { Gap } from "../elements/basic/gap";
import { Actions } from "./actions";
import { Element } from "./element";
import { Layout } from "./layout";

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

export abstract class DirectionalLayout extends Layout {
  protected allocations: Allocation[] = [];
  protected cachedRect: Rect | null = null;

  constructor(protected isVertical: boolean) {
    super();
  }

  gap(size?: number): typeof this {
    if (size) {
      this.addSized(new Gap(), size);
    } else {
      this.add(new Gap());
    }
    return this;
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
      element.updateElement(elementRect, context, actions);
    }

    if (!pausedBefore) {
      context.resumeInteraction();
    }
  }

  protected render(rect: Rect, painter: Painter): void {
    painter.clip(rect);
    const afterPadding = rect.clone().grow(-this.style.padding);
    for (const element of this.elements) {
      const elementRect = this.getAllocRect(afterPadding, element);
      element.renderElement(elementRect, painter);
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

  protected getMinSize(allocation: Allocation): number {
    if (!allocation.minSize && allocation.minSize !== 0) {
      return this.isVertical
        ? allocation.minElementSize.height
        : allocation.minElementSize.width;
    }
    return allocation.minSize;
  }

  get minWidth(): number {
    if (this.cachedRect) {
      if (this.isVertical) {
        let widest = 0;
        for (const alloc of this.allocations) {
          const width = alloc.minElementSize.width;
          if (width > widest) {
            widest = width;
          }
        }
        return widest + 2 * this.style.padding;
      } else {
        let width = 0;
        for (const alloc of this.allocations) {
          width += this.getSizeInPixels(alloc);
        }
        return width + 2 * this.style.padding;
      }
    } else {
      return 0;
    }
  }

  get minHeight(): number {
    if (this.cachedRect) {
      if (this.isVertical) {
        let height = 0;
        for (const alloc of this.allocations) {
          height += this.getSizeInPixels(alloc);
        }
        return height + 2 * this.style.padding;
      } else {
        let tallest = 0;
        for (const alloc of this.allocations) {
          const height = alloc.minElementSize.height;
          if (height > tallest) {
            tallest = height;
          }
        }
        return tallest + 2 * this.style.padding;
      }
    } else {
      return 0;
    }
  }
}
