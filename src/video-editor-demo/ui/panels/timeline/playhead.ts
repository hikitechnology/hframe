import {
  Color,
  Context,
  Element,
  LineSegment,
  MathHelpers,
  Painter,
  Pos2D,
  Rect,
} from "@/lib/main";
import { Timeline } from "./timeline";
import {
  PLAYHEAD_BIG_TICK_HEIGHT,
  PLAYHEAD_TICK_DENSITY,
  PLAYHEAD_TICK_HEIGHT,
  PLAYHEAD_TIMESTAMP_DENSITY,
  PLAYHEAD_TIMESTAMP_FONT_SIZE,
  PLAYHEAD_TIMESTAMP_PADDING,
  PLAYHEAD_TRIANGLE_HEIGHT,
  PLAYHEAD_TRIANGLE_WIDTH,
  SNAP_DISTANCE,
} from "../../../constants";

export class Playhead extends Element {
  private dragging: boolean = false;

  constructor(private timeline: Timeline) {
    super();
  }

  protected update(rect: Rect, context: Context): void {
    if (rect.contains(context.mousePos) && context.justPressedMouse) {
      this.dragging = true;
      this.timeline.getPlaybackController().pause();
    }

    if (context.justReleasedMouse) {
      this.dragging = false;
    }

    if (this.dragging) {
      const mouseX = context.peekAtRealMousePos().x - rect.x;
      const snappedX = this.timeline.getSnapPointInRadius(
        mouseX,
        SNAP_DISTANCE,
        false,
      );
      const pixelsPerSecond = rect.width / this.timeline.hZoom;
      const timestamp =
        this.timeline.scrollOffset + (snappedX ?? mouseX) / pixelsPerSecond;
      this.timeline.getPlaybackController().timestamp = MathHelpers.clamp(
        timestamp,
        this.timeline.scrollOffset,
        this.timeline.scrollOffset + this.timeline.hZoom,
      );
    }
  }

  protected render(rect: Rect, painter: Painter): void {
    painter.clip(rect);

    const tickInterval = this.calculateTickInterval(
      this.timeline.hZoom,
      rect.width,
    );
    this.drawTicks(rect, painter, tickInterval);

    this.drawPlayhead(rect, painter);
    painter.unclip();
  }

  private drawPlayhead(rect: Rect, painter: Painter) {
    const pixelsPerSecond = rect.width / this.timeline.hZoom;
    const x =
      rect.x +
      (this.timeline.getPlaybackController().timestamp -
        this.timeline.scrollOffset) *
        pixelsPerSecond;

    painter.setColor(Color.RED);
    painter.fillPoly(
      new Pos2D(x + PLAYHEAD_TRIANGLE_WIDTH, rect.y),
      new Pos2D(x, rect.y + PLAYHEAD_TRIANGLE_HEIGHT),
      new Pos2D(x - PLAYHEAD_TRIANGLE_WIDTH, rect.y),
    );
    painter.drawLine(LineSegment.from(x, rect.y, x, rect.y + rect.height), 2);
  }

  private calculateTickInterval(hZoom: number, rectWidth: number): number {
    const intervals = [
      0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 30,
      60, 120, 300, 600, 1800, 3600,
    ];
    const idealInterval = PLAYHEAD_TICK_DENSITY * (hZoom / rectWidth);

    let bestInterval = intervals[0];
    let minDiff = Math.abs(Math.log(intervals[0]) - Math.log(idealInterval));
    for (const interval of intervals) {
      const diff = Math.abs(Math.log(interval) - Math.log(idealInterval));
      if (diff < minDiff) {
        minDiff = diff;
        bestInterval = interval;
      }
    }
    return bestInterval;
  }

  private drawTicks(rect: Rect, painter: Painter, interval: number): void {
    const pixelsPerSecond = rect.width / this.timeline.hZoom;
    const kStart = Math.ceil(this.timeline.scrollOffset / interval);
    const tickPixelDistance = interval * pixelsPerSecond;
    const ticksPerTimestamp = Math.ceil(
      PLAYHEAD_TIMESTAMP_DENSITY / tickPixelDistance,
    );

    let k = kStart;
    let t = k * interval;
    while (true) {
      const x = (t - this.timeline.scrollOffset) * pixelsPerSecond;
      if (x >= rect.width) break;

      const kMod = (k / ticksPerTimestamp) % 1;
      const isTimestampTick = kMod < 1e-6 || kMod > 1 - 1e-6;
      const lineWidth = isTimestampTick ? 2 : 1;
      const tickHeight = isTimestampTick
        ? PLAYHEAD_BIG_TICK_HEIGHT
        : PLAYHEAD_TICK_HEIGHT;

      // Draw tick
      const segment = LineSegment.from(
        rect.x + x,
        rect.y,
        rect.x + x,
        rect.y + tickHeight,
      );
      painter.setColor(this.style.outline);
      painter.drawLine(segment, lineWidth);

      // Draw timestamp if applicable
      if (isTimestampTick && t > 0) {
        const text = this.formatTime(t);
        painter.setColor(this.style.textColor);
        painter.text(
          text,
          rect.x + x,
          rect.y + PLAYHEAD_TICK_HEIGHT + PLAYHEAD_TIMESTAMP_PADDING,
          true,
          false,
          PLAYHEAD_TIMESTAMP_FONT_SIZE,
        );
      }

      k += 1;
      t += interval;
    }
  }

  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const cs = Math.floor((seconds % 1) * 100);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}:${cs.toString().padStart(2, "0")}`;
  }
}
