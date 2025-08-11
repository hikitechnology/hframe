import {
  Actions,
  Color,
  CompoundElement,
  Context,
  LineSegment,
  MathHelpers,
  Painter,
  Rect,
  Vertical,
} from "@/lib/main";
import { TimelineControls } from "./controls";
import {
  CONTAINER_ZOOM_MULT as ZOOM_SCROLL_MULT,
  TIMELINE_CONTROLS_HEIGHT,
  TIMELINE_SCROLLBAR_HEIGHT,
  TRACK_DIVIDER_THICKNESS,
  TIMELINE_PLAYHEAD_HEIGHT,
  TRACK_HEADER_WIDTH,
  PLAYHEAD_JUMP_DISTANCE,
} from "../../../constants";
import { TrackContainer } from "./track-container";
import { PlaybackController } from "../../../backend/playback-controller";
import { Scrollbar } from "./scrollbar";
import { PlayheadRow } from "./playhead-row";

export class Timeline extends CompoundElement {
  private videoTracks: TrackContainer;
  private audioTracks: TrackContainer;
  private currentlyScrolling: boolean = false;

  hZoom: number = 60;
  scrollOffset: number = 0;

  constructor(private controller: PlaybackController) {
    super(new Vertical());

    this.videoTracks = new TrackContainer(this, true);
    this.audioTracks = new TrackContainer(this, false);

    const controls = new TimelineControls();
    this.innerLayout
      .addSized(controls, TIMELINE_CONTROLS_HEIGHT)
      .addSized(new PlayheadRow(this), TIMELINE_PLAYHEAD_HEIGHT)
      .addRelative(this.videoTracks, 1, true, 0)
      .addRelative(this.audioTracks, 1, true, 0)
      .addSized(new Scrollbar(this), TIMELINE_SCROLLBAR_HEIGHT);
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    this.handleZoom(rect, context);
    this.handleScroll(context);
    this.handleJumpToPlayhead(rect);

    super.update(rect, context, actions);
  }

  protected render(rect: Rect, painter: Painter): void {
    super.render(rect, painter);

    const dividerLine = this.innerLayout.getRect(this.videoTracks).bottom;
    painter.setColor(this.style.outline);
    painter.drawLine(dividerLine, TRACK_DIVIDER_THICKNESS);

    this.drawPlayheadLine(rect, painter);
  }

  getPlaybackController(): PlaybackController {
    return this.controller;
  }

  getSnapPointInRadius(
    x: number,
    radius: number,
    includePlayhead: boolean = true,
  ): number | null {
    let playheadPoint =
      this.lastRect && includePlayhead
        ? (this.controller.timestamp - this.scrollOffset) *
          ((this.lastRect.width - TRACK_HEADER_WIDTH) / this.hZoom)
        : null;
    if (playheadPoint !== null && Math.abs(playheadPoint - x) > radius) {
      playheadPoint = null;
    }

    const videoPoint = this.videoTracks.getSnapPointInRadius(x, radius);
    const audioPoint = this.audioTracks.getSnapPointInRadius(x, radius);

    let closest = null;
    for (const point of [playheadPoint, videoPoint, audioPoint]) {
      if (closest !== null && point !== null) {
        const closestDistance = Math.abs(x - closest);
        const thisPointDistance = Math.abs(x - point);

        if (thisPointDistance < closestDistance) {
          closest = point;
        }
      } else if (point !== null) {
        closest = point;
      }
    }

    return closest;
  }

  private drawPlayheadLine(rect: Rect, painter: Painter) {
    const pixelsPerSecond = (rect.width - TRACK_HEADER_WIDTH) / this.hZoom;
    const x =
      rect.x +
      TRACK_HEADER_WIDTH +
      pixelsPerSecond * this.controller.timestamp -
      pixelsPerSecond * this.scrollOffset;
    if (rect.x + TRACK_HEADER_WIDTH - 1 < x && x < rect.x + rect.width + 1) {
      painter.setColor(Color.RED);
      painter.drawLine(
        LineSegment.from(
          x,
          rect.y + TIMELINE_CONTROLS_HEIGHT,
          x,
          rect.y + rect.height - TIMELINE_SCROLLBAR_HEIGHT,
        ),
        2,
      );
    }
  }

  private handleJumpToPlayhead(rect: Rect) {
    const jumpAtSecs = PLAYHEAD_JUMP_DISTANCE * (this.hZoom / rect.width);
    const timestamp = this.getPlaybackController().timestamp;
    const duration = this.getPlaybackController().duration;

    if (
      this.getPlaybackController().playingState !== "paused" &&
      !this.currentlyScrolling
    ) {
      if (
        this.scrollOffset + this.hZoom - timestamp < jumpAtSecs &&
        this.scrollOffset + this.hZoom - timestamp >= 0
      ) {
        this.scrollOffset = Math.min(
          timestamp - this.hZoom / 3,
          duration - this.hZoom,
        );
      } else if (
        timestamp - this.scrollOffset < jumpAtSecs &&
        timestamp - this.scrollOffset >= 0
      ) {
        this.scrollOffset = Math.max(timestamp - (2 * this.hZoom) / 3, 0);
      }
    }
  }

  private handleZoom(rect: Rect, context: Context) {
    const timestamp = this.getPlaybackController().timestamp;
    const timestampInView =
      this.scrollOffset <= timestamp &&
      timestamp <= this.scrollOffset + this.hZoom;

    const focus = timestampInView
      ? timestamp
      : this.scrollOffset + this.hZoom / 2;
    const ratio = timestampInView
      ? (timestamp - this.scrollOffset) / this.hZoom
      : 0.5;

    if (
      rect.contains(context.mousePos) &&
      context.scrollDelta.y !== 0 &&
      context.heldKeys.includes("Shift") &&
      !context.heldKeys.includes("Control")
    ) {
      this.hZoom += context.scrollDelta.y * this.hZoom * ZOOM_SCROLL_MULT ** 3;
      this.scrollOffset = focus - this.hZoom * ratio;
    }

    this.hZoom = MathHelpers.clamp(this.hZoom, 1, this.controller.duration);
  }

  private handleScroll(context: Context) {
    const hScrollDelta = context.heldKeys.includes("Control")
      ? context.scrollDelta.y
      : context.scrollDelta.x;

    if (!context.heldKeys.includes("Shift") && hScrollDelta !== 0) {
      this.scrollOffset += hScrollDelta * this.hZoom * ZOOM_SCROLL_MULT ** 3;
      this.currentlyScrolling = true;
    } else {
      this.currentlyScrolling = false;
    }
    this.scrollOffset = MathHelpers.clamp(
      this.scrollOffset,
      0,
      this.controller.duration - this.hZoom,
    );
  }
}
