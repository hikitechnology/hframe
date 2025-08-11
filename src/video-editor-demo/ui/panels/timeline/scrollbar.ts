import { Element, Painter, Rect, SCROLLBAR_ROUNDING } from "@/lib/main";
import { Timeline } from "./timeline";

export class Scrollbar extends Element {
  constructor(private timeline: Timeline) {
    super();
  }

  protected update(): void {}

  protected render(rect: Rect, painter: Painter): void {
    const scrollbarPercent =
      this.timeline.hZoom / this.timeline.getPlaybackController().duration;
    const offsetPercent =
      this.timeline.scrollOffset /
      this.timeline.getPlaybackController().duration;
    const scrollbarRect = Rect.from(
      rect.x + offsetPercent * rect.width,
      rect.y,
      scrollbarPercent * rect.width,
      rect.height,
    );
    painter.setColor(this.style.scrollbarColor);
    painter.fillRect(scrollbarRect, SCROLLBAR_ROUNDING);
  }
}
