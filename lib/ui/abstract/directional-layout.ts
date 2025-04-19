import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { Rect } from "../../utils/shapes/rect";
import { Actions } from "./actions";
import { Allocation } from "./allocation";
import { Element } from "./element";
import { Layout } from "./layout";

export abstract class DirectionalLayout extends Layout {
  protected allocations: Allocation[] = [];

  constructor(protected isVertical: boolean) {
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
}
