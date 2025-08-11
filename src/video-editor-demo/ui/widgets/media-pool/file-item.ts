import {
  Color,
  CompoundElement,
  Context,
  Image,
  Painter,
  Rect,
  Text,
  Vertical,
} from "@/lib/main";
import { DragLayer } from "../../layers/drag-layer";
import { MediaSource } from "../../../backend/media-source";
import { DEFAULT_FILE_ICON } from "../../../constants";
import { truncateString } from "../../../helpers";

export class FileItem extends CompoundElement {
  private hovered: boolean = false;
  private startedDrag: boolean = false;
  private dragging: boolean = false;

  constructor(
    public innerFile: MediaSource,
    private dragLayer: DragLayer,
  ) {
    super(new Vertical(false, false));

    const image = new Image(DEFAULT_FILE_ICON);
    const label = new Text(truncateString(innerFile.name, 10));
    label.style.textCenteredH = true;
    this.innerLayout.add(image).add(label).gap(10);
  }

  protected update(rect: Rect, context: Context): void {
    if (rect.contains(context.mousePos)) {
      this.hovered = true;

      if (context.justPressedMouse) {
        this.startedDrag = true;
      }
    } else {
      this.hovered = false;
    }

    if (context.justReleasedMouse && (this.dragging || this.startedDrag)) {
      this.dragLayer.drop(this);
      this.dragging = false;
      this.startedDrag = false;
    }

    if (this.startedDrag && context.mouseDelta.length > 0) {
      this.dragLayer.drag(this, rect);
      this.startedDrag = false;
      this.dragging = true;
    }

    super.update(rect, context);
  }

  renderElement(rect: Rect, painter: Painter): void {
    if (!this.dragging && this.hovered) {
      painter.setColor(
        Color.adjustBrightness(
          this.style.fill,
          this.currentTheme.isDark ? 20 : -20,
        ),
      );
      painter.fillRect(rect);
    }

    this.render(rect, painter);
  }
}
