import { Context } from "../../../context";
import { Painter } from "../../../render/painter";
import { Rect } from "../../../utils/shapes/rect";
import { Actions } from "../../abstract/actions";
import { Element } from "../../abstract/element";

export class Text extends Element {
  private cachedPainter: Painter | null = null;
  private lines: string[] = [];
  private height: number = 0;

  constructor(
    public text: string = "",
    fontSize?: number,
  ) {
    super();
    if (fontSize) {
      this.style.fontSize = fontSize;
    }
  }

  protected update(rect: Rect, _context: Context, actions?: Actions): void {
    if (this.cachedPainter) {
      const words = this.text.split(/\s+/);
      this.lines = [];

      let currentLine = words[0];
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = this.cachedPainter.measureText(
          currentLine + " " + word,
          this.style.fontSize,
        );
        if (width < rect.width) {
          currentLine += " " + word;
        } else {
          this.lines.push(currentLine);
          currentLine = word;
        }
      }
      this.lines.push(currentLine);

      this.height =
        this.style.fontSize * this.style.lineSpacing * this.lines.length;
      if (actions) {
        actions.requestHeight(this.height);
      }
    }
  }

  protected render(rect: Rect, painter: Painter): void {
    if (!this.cachedPainter) {
      this.cachedPainter = painter;
    }

    painter.clip(rect);
    painter.setColor(this.style.textColor);
    let yOffset = 0;
    for (let i = 0; i < this.lines.length; i++) {
      yOffset = i * this.style.fontSize * this.style.lineSpacing;
      painter.text(
        this.lines[i],
        this.style.textCenteredH ? rect.center.x : rect.x,
        (this.style.textCenteredV
          ? rect.center.y -
            this.height / 2 +
            (this.style.fontSize * this.style.lineSpacing) / 2
          : rect.y) + yOffset,
        this.style.textCenteredH,
        this.style.textCenteredV,
        this.style.fontSize,
      );
    }
    painter.unclip();
  }
}
