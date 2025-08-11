import {
  Color,
  Context,
  Gap,
  Horizontal,
  Painter,
  Rect,
  VerticalScroll,
} from "@/lib/main";
import { Widget } from "../../abstract/widget";
import { FileItem } from "./file-item";
import { MediaSource } from "../../../backend/media-source";
import { DragLayer } from "../../layers/drag-layer";
import {
  MEDIA_POOL_FILE_HEIGHT,
  MEDIA_POOL_FILE_WIDTH,
} from "../../../constants";

export class MediaPool extends Widget {
  private fileElements: FileItem[] = [];
  private draggingFileOnto: boolean = false;
  private filesChanged: boolean = false;
  private prevWidth: number = 0;
  constructor(private dragLayer: DragLayer) {
    super(new VerticalScroll());
    for (let i = 0; i < 10; i++) {
      this.addFile(new File([], `File ${i}`));
    }
  }

  get name(): string {
    return "Media Pool";
  }

  protected update(rect: Rect, context: Context): void {
    this.handleFileDrag(rect, context);

    if (this.filesChanged || this.prevWidth !== rect.width) {
      this.innerLayout.clear();
      this.innerLayout.gap(4);
      const rows = [];
      const newRow = new Horizontal(false, false);
      rows.push(newRow);
      let pushedToRow = 0;
      for (const [index, file] of this.fileElements.entries()) {
        if ((pushedToRow + 1) * MEDIA_POOL_FILE_WIDTH < rect.width) {
          rows[rows.length - 1]
            .gap()
            .addSized(file, MEDIA_POOL_FILE_WIDTH)
            .gap();
          pushedToRow++;
        } else {
          const newRow = new Horizontal();
          newRow.style.outline = Color.TRANSPARENT;
          newRow.style.fill = Color.TRANSPARENT;
          newRow.style.padding = 1;
          rows.push(newRow);
          newRow.gap().addSized(file, MEDIA_POOL_FILE_WIDTH).gap();
          pushedToRow = 1;
        }
        if (index === this.fileElements.length - 1) {
          for (
            let i = 0;
            i <
            Math.floor(rect.width / MEDIA_POOL_FILE_WIDTH) -
              ((index % Math.floor(rect.width / MEDIA_POOL_FILE_WIDTH)) + 1);
            i++
          ) {
            rows[rows.length - 1]
              .gap()
              .addSized(new Gap(), MEDIA_POOL_FILE_WIDTH)
              .gap();
          }
        }
      }

      for (const row of rows) {
        this.innerLayout.addSized(row, MEDIA_POOL_FILE_HEIGHT);
      }

      this.innerLayout.gap(4);
    }

    super.update(rect, context);

    this.filesChanged = false;
    this.prevWidth = rect.width;
  }

  protected render(rect: Rect, painter: Painter): void {
    super.render(rect, painter);
    if (this.draggingFileOnto) {
      if (this.draggingFileOnto) {
        painter.setColor(Color.rgba(100, 100, 100, 0.5));
        painter.fillRect(rect);
        painter.setColor(Color.WHITE);
        painter.text(
          "Drop media here",
          rect.center.x,
          rect.center.y,
          true,
          true,
          20,
        );
      }
    }
  }

  private handleFileDrag(rect: Rect, context: Context) {
    this.draggingFileOnto =
      rect.contains(context.mousePos) && context.isDraggingFile;
    if (this.draggingFileOnto) {
      context.pauseInteraction();
    }
    if (rect.contains(context.mousePos) && context.droppedFiles) {
      for (const file of context.droppedFiles) {
        this.addFile(file);
      }
    }
  }

  private addFile(file: File) {
    const source = MediaSource.fromFile(file);
    this.fileElements.push(new FileItem(source, this.dragLayer));
    this.filesChanged = true;
  }
}
