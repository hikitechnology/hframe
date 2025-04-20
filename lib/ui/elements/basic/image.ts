import { Painter } from "../../../render/painter";
import { ImageSource } from "../../../utils/image/image-source";
import { Rect } from "../../../utils/shapes/rect";
import { Element } from "../../abstract/element";

export class Image extends Element {
  constructor(public image: ImageSource) {
    super();
  }

  protected update(): void {}

  protected render(rect: Rect, painter: Painter): void {
    if (rect.width > rect.height * (this.image.width / this.image.height)) {
      const oldWidth = rect.width;
      rect.width = rect.height * (this.image.width / this.image.height);
      rect.x += (oldWidth - rect.width) / 2;
    } else if (
      rect.height >
      rect.width * (this.image.height / this.image.width)
    ) {
      const oldHeight = rect.height;
      rect.height = rect.width * (this.image.height / this.image.width);
      rect.y += (oldHeight - rect.height) / 2;
    }
    painter.drawImage(this.image, rect);
  }
}
