import {
  Actions,
  Context,
  Element,
  Freeform,
  Layout,
  Painter,
  Rect,
  Theme,
} from "@/lib/main";

export class DragLayer extends Layout {
  private static instance: DragLayer;
  private innerLayout: Freeform = new Freeform();
  private dragging: Element[] = [];
  private justDropped: Element[] = [];

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DragLayer();
    }

    return this.instance;
  }

  drag(element: Element, originalRect: Rect) {
    this.innerLayout.add(element, {
      xOffset: originalRect.x,
      yOffset: originalRect.y,
      width: originalRect.width,
      height: originalRect.height,
    });
    this.dragging.push(element);
  }

  drop(element: Element) {
    this.innerLayout.remove(element);
    this.justDropped.push(element);
    this.dragging.splice(this.dragging.indexOf(element), 1);
  }

  droppedElements(): Element[] | null {
    if (this.justDropped.length > 0) {
      return this.justDropped;
    }
    return null;
  }

  draggingElements(): Element[] | null {
    if (this.dragging.length > 0) {
      return this.dragging;
    }
    return null;
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    this.justDropped = [];

    for (const element of this.dragging) {
      const elementRect = this.innerLayout.getRect(element);
      this.innerLayout.set(element, {
        anchorX: "left",
        anchorY: "top",
        xOffset: context.mousePos.x - elementRect.width / 2,
        yOffset: context.mousePos.y - elementRect.height / 2,
      });
    }
    this.innerLayout.updateElement(rect, context, actions);

    const isDragging = this.dragging.length > 0;
    if (isDragging) {
      context.cursor = "grabbing";
      this.allowPassthrough = false;
    } else {
      this.allowPassthrough = true;
    }
  }

  protected render(rect: Rect, painter: Painter): void {
    this.innerLayout.renderElement(rect, painter);
  }

  getRect(element: Element): Rect {
    return this.innerLayout.getRect(element);
  }

  updateTheme(theme: Theme): void {
    this.innerLayout.updateTheme(theme);
  }
}
