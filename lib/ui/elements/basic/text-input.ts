import { Context } from "../../../context";
import { Painter } from "../../../render/painter";
import { Rect } from "../../../utils/shapes/rect";
import { Actions } from "../../abstract/actions";
import { KeyboardInput } from "../../abstract/keyboard-input";

export class TextInput extends KeyboardInput {
  private cachedPainter: Painter | null = null;
  private dragSelectStart: number | null = null;

  constructor() {
    super();
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    if (actions) {
      actions.requestHeight(this.style.fontSize + 2 * this.style.padding);
    }
    if (rect.contains(context.mousePos)) {
      context.cursor = "text";

      if (context.justPressedMouse) {
        this.focus();
        this.collectInput(context);

        if (this.cachedPainter) {
          const caretPos = this.getCaretPositionFromMouse(
            context.mousePos.x,
            rect,
            this.cachedPainter,
          );
          if (context.justDoubleClicked) {
            this.selectAll(context);
          } else {
            this.selectionStart = caretPos;
            this.selectionEnd = caretPos;
            this.dragSelectStart = caretPos;
            context.setTextSelectionRange(caretPos, caretPos);
          }
        }
      }
    } else if (context.justPressedMouse) {
      this.unfocus();
    }

    if (
      this.dragSelectStart !== null &&
      this.cachedPainter &&
      !context.justDoubleClicked
    ) {
      const caretPos = this.getCaretPositionFromMouse(
        context.mousePos.x,
        rect,
        this.cachedPainter,
      );
      const selectionStart = Math.min(this.dragSelectStart, caretPos);
      const selectionEnd = Math.max(this.dragSelectStart, caretPos);
      this.selectionStart = selectionStart;
      this.selectionEnd = selectionEnd;
      context.setTextSelectionRange(selectionStart, selectionEnd);
    }

    if (context.justReleasedMouse) {
      this.dragSelectStart = null;
    }

    if (this.focused && this.cachedPainter) {
      this.updateTextShift(this.cachedPainter, rect);
    } else {
      this.textShift = 0;
    }
  }

  protected render(rect: Rect, painter: Painter): void {
    if (!this.cachedPainter) {
      this.cachedPainter = painter;
    }

    painter.clip(rect);
    if (this.focused) {
      this.drawSelectionHighlight(painter, rect);
      this.drawCursor(painter, rect);
    }
    painter.setColor(this.style.textColor);
    painter.text(
      this.value,
      rect.x + this.style.padding - this.textShift,
      rect.y + this.style.padding,
      false,
      false,
      this.style.fontSize,
    );
    painter.unclip();
  }
}
