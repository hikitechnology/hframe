import { TEXT_HIGHLIGHT, TEXTINPUT_CARET_COLOR } from "../../constants";
import { Context } from "../../context";
import { Painter } from "../../render/painter";
import { LineSegment } from "../../utils/shapes/line-segment";
import { Rect } from "../../utils/shapes/rect";
import { Element } from "./element";

export abstract class KeyboardInput extends Element {
  public value: string = "";
  protected focused: boolean = false;
  protected selectionStart: number = 0;
  protected selectionEnd: number = 0;
  protected textShift: number = 0;

  protected collectInput(context: Context): void {
    context.collectTextInput(
      this.value,
      (text, selectionStart, selectionEnd) => {
        if (this.focused) {
          if (context.justPressedKeys.includes("Enter")) {
            this.unfocus();
            return;
          }
          this.value = text;
          this.selectionStart = selectionStart;
          this.selectionEnd = selectionEnd;
        }
      },
    );
  }

  protected getCaretPositionFromMouse(
    mouseX: number,
    rect: Rect,
    painter: Painter,
  ): number {
    const xOffset = mouseX - rect.x - this.style.padding + this.textShift;
    let caretPos = this.value.length;
    for (let i = 0; i <= this.value.length; i++) {
      const substring = this.value.substring(0, i);
      if (painter.measureText(substring, this.style.fontSize) > xOffset) {
        caretPos = i;
        break;
      }
    }
    return caretPos;
  }

  protected drawCursor(painter: Painter, rect: Rect): void {
    if (this.selectionStart === this.selectionEnd) {
      const cursorOffset = painter.measureText(
        this.value.substring(0, this.selectionStart),
        this.style.fontSize,
      );
      painter.setColor(TEXTINPUT_CARET_COLOR);
      const cursorX =
        rect.x + this.style.padding + cursorOffset - this.textShift;
      const cursorLine = LineSegment.from(
        cursorX,
        rect.y + this.style.padding,
        cursorX,
        rect.y + rect.height - this.style.padding,
      );
      painter.drawLine(cursorLine, 1.5);
    }
  }

  protected updateTextShift(painter: Painter, rect: Rect): void {
    const textWidth = painter.measureText(
      this.value.substring(0, this.selectionEnd),
      this.style.fontSize,
    );
    if (textWidth > rect.width - 2 * this.style.padding) {
      this.textShift = textWidth - (rect.width - 2 * this.style.padding);
    } else {
      this.textShift = 0;
    }
  }

  protected selectAll(context: Context): void {
    this.selectionStart = 0;
    this.selectionEnd = this.value.length;
    context.setTextSelectionRange(0, this.value.length);
  }

  protected drawSelectionHighlight(painter: Painter, rect: Rect): void {
    if (this.selectionStart !== this.selectionEnd) {
      const startOffset = painter.measureText(
        this.value.substring(0, this.selectionStart),
        this.style.fontSize,
      );
      const endOffset = painter.measureText(
        this.value.substring(0, this.selectionEnd),
        this.style.fontSize,
      );
      painter.setColor(TEXT_HIGHLIGHT);
      const highlightRect = Rect.from(
        rect.x + this.style.padding + startOffset - this.textShift,
        rect.y + this.style.padding,
        endOffset - startOffset,
        rect.height - 2 * this.style.padding,
      );
      painter.fillRect(highlightRect);
    }
  }

  protected focus(): void {
    this.focused = true;
  }

  protected unfocus(): void {
    this.focused = false;
  }
}
