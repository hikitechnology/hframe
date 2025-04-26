import {
  SCROLLBAR_HOVERED_WIDTH,
  SCROLLBAR_ROUNDING,
  SCROLLBAR_WIDTH,
} from "../../constants";
import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { Rect } from "../../utils/shapes/rect";
import { Actions } from "../abstract/actions";
import { DirectionalLayout } from "../abstract/directional-layout";
import { Element } from "../abstract/element";

export class VerticalScroll extends DirectionalLayout {
  protected scrollOffset: number = 0;
  protected scrollbarHovered: boolean = false;
  protected draggingScrollbar: boolean = false;

  constructor(
    protected startFromBottom: boolean = false,
    protected dontScrollWhenHeld: string[] = [],
  ) {
    super(true);
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    if (
      rect.contains(context.mousePos) &&
      !context.heldKeys.some((key) => this.dontScrollWhenHeld.includes(key))
    ) {
      if (this.startFromBottom) {
        this.scrollOffset -= context.scrollDelta;
      } else {
        this.scrollOffset += context.scrollDelta;
      }
    }
    if (actions) {
      actions.requestHeight(this.contentHeight);
    }
    this.updateScrollbar(rect, context);
    this.constrainScroll(rect);
    super.update(this.getContentRect(rect), context);
  }

  protected render(rect: Rect, painter: Painter): void {
    super.render(this.getContentRect(rect), painter);
    this.renderScrollbar(rect, painter);
  }

  protected updateScrollbar(rect: Rect, context: Context) {
    const scrollbarCollider = Rect.from(
      rect.x + rect.width - SCROLLBAR_HOVERED_WIDTH,
      rect.y,
      SCROLLBAR_HOVERED_WIDTH,
      rect.height,
    );

    this.scrollbarHovered = scrollbarCollider.contains(context.mousePos);

    if (this.scrollbarHovered && context.justPressedMouse) {
      this.draggingScrollbar = true;
    }

    if (context.justReleasedMouse) {
      this.draggingScrollbar = false;
    }

    if (this.draggingScrollbar) {
      const mousePos = context.peekAtRealMousePos();
      const scrollBarHeightPercent = rect.height / this.contentHeight;
      let scrollPercent;
      if (this.startFromBottom) {
        scrollPercent =
          1 -
          ((mousePos.y - rect.y) / rect.height + scrollBarHeightPercent / 2);
      } else {
        scrollPercent =
          (mousePos.y - rect.y) / rect.height - scrollBarHeightPercent / 2;
      }
      this.scrollOffset = this.contentHeight * scrollPercent;
    }
  }

  protected renderScrollbar(rect: Rect, painter: Painter) {
    if (rect.height < this.contentHeight) {
      const scrollbarWidth =
        this.scrollbarHovered || this.draggingScrollbar
          ? SCROLLBAR_HOVERED_WIDTH
          : SCROLLBAR_WIDTH;

      const background = Rect.from(
        rect.x + rect.width - scrollbarWidth,
        rect.y,
        scrollbarWidth,
        rect.height,
      );

      const scrollbarHeight = (rect.height / this.contentHeight) * rect.height;
      let scrollbarY;
      if (this.startFromBottom) {
        scrollbarY =
          (rect.height / this.contentHeight) * -this.scrollOffset +
          rect.y +
          rect.height -
          scrollbarHeight;
      } else {
        scrollbarY =
          (rect.height / this.contentHeight) * this.scrollOffset + rect.y;
      }

      const scrollbar = Rect.from(
        rect.x + rect.width - scrollbarWidth,
        scrollbarY,
        scrollbarWidth,
        scrollbarHeight,
      );

      painter.setColor(this.style.scrollbarOutline);
      painter.outlineRect(background);

      painter.setColor(this.style.scrollbarBackground);
      painter.fillRect(background);

      painter.setColor(this.style.scrollbarColor);
      painter.fillRect(scrollbar, SCROLLBAR_ROUNDING);
    }
  }

  protected getAllocRect(baseRect: Rect, element: Element): Rect {
    const rect = super.getAllocRect(baseRect, element);
    if (this.startFromBottom) {
      rect.y -= this.contentHeight - baseRect.height - this.scrollOffset;
    } else {
      rect.y -= this.scrollOffset;
    }
    return rect;
  }

  protected constrainScroll(rect: Rect) {
    this.scrollOffset = Math.max(
      Math.min(this.scrollOffset, this.contentHeight - rect.height),
      0,
    );
  }

  protected getContentRect(baseRect: Rect) {
    if (baseRect.height < this.contentHeight) {
      const newRect = baseRect.clone();
      newRect.width -= SCROLLBAR_WIDTH;
      return newRect;
    } else {
      return baseRect;
    }
  }

  protected get contentHeight(): number {
    if (this.cachedRect) {
      let maxY = 0;
      for (const element of this.elements) {
        const rect = super.getAllocRect(this.cachedRect, element);
        if (rect.y + rect.height > maxY) {
          maxY = rect.y + rect.height;
        }
      }
      return maxY - this.cachedRect.y + this.style.padding * 2;
    }
    return 0;
  }
}
