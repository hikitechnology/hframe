import {
  Actions,
  Button,
  CompoundElement,
  Context,
  Horizontal,
  LineSegment,
  MathHelpers,
  Painter,
  Rect,
  VerticalScroll,
} from "@/lib/main";
import {
  ADD_TRACK_BUTTON_HEIGHT,
  ADD_TRACK_PADDING,
  BASE_TRACK_ZOOM,
  CONTAINER_ZOOM_MULT,
  MAX_TRACK_HEIGHT,
  MIN_TRACK_HEIGHT,
  TRACK_HEADER_WIDTH,
} from "../../../constants";
import { Clip } from "./track/clip";
import { TrackRow } from "./track/track-row";
import { Timeline } from "./timeline";
import { closestNumber } from "../../../helpers";

type Dragging = {
  clip: Clip;
  mouseOffset: number;
};

export class TrackContainer extends CompoundElement {
  private tracks: TrackRow[] = [];
  private vZoom: number = BASE_TRACK_ZOOM;
  draggingClips: Dragging[] = [];
  justDroppedClips: Dragging[] = [];

  constructor(
    private timeline: Timeline,
    private startFromBottom: boolean,
  ) {
    super(new VerticalScroll(false, startFromBottom, ["Control", "Shift"]));

    const addTrackContainer = new Horizontal(false, false);
    addTrackContainer.style.padding = ADD_TRACK_PADDING;
    const addTrackButton = new Button("Add track", () => {
      this.addTrack();
    });
    addTrackContainer.addSized(
      addTrackButton,
      TRACK_HEADER_WIDTH - 2 * ADD_TRACK_PADDING,
    );
    this.innerLayout.addSized(addTrackContainer, ADD_TRACK_BUTTON_HEIGHT);

    this.addTrack();
  }

  addTrack() {
    const track = new TrackRow(
      this.startFromBottom,
      `Track ${this.tracks.length + 1}`,
      this.timeline,
      this,
    );
    this.tracks.push(track);
    if (this.startFromBottom) {
      this.innerLayout.insertSized(1, track, this.vZoom);
    } else {
      this.innerLayout.insertSized(this.tracks.length - 1, track, this.vZoom);
    }
  }

  getHoveredTrack() {
    for (const track of this.tracks) {
      if (track.hovered) {
        return track;
      }
    }

    return null;
  }

  getSnapPointInRadius(x: number, radius: number): number | null {
    let closest = null;
    for (const track of this.tracks) {
      const trackPoint = track.getSnapPointInRadius(x, radius);
      if (trackPoint === null) {
        continue;
      }
      if (closest === null) {
        closest = trackPoint;
        continue;
      }

      closest = closestNumber(x, trackPoint, closest);
    }

    return closest;
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    if (
      rect.contains(context.mousePos) &&
      ["Control", "Shift"].every((value) => context.heldKeys.includes(value)) &&
      context.scrollDelta.y !== 0
    ) {
      this.vZoom = MathHelpers.clamp(
        this.vZoom - context.scrollDelta.y * CONTAINER_ZOOM_MULT,
        MIN_TRACK_HEIGHT,
        MAX_TRACK_HEIGHT,
      );
      for (const track of this.tracks) {
        this.innerLayout.setSize(track, this.vZoom);
      }
    }

    if (context.justReleasedMouse) {
      this.justDroppedClips = this.draggingClips;
      this.draggingClips = [];
    }

    super.update(rect, context, actions);

    this.justDroppedClips = [];
  }

  protected render(rect: Rect, painter: Painter): void {
    super.render(rect, painter);

    painter.setColor(this.style.outline);
    painter.drawLine(
      LineSegment.from(
        rect.x + TRACK_HEADER_WIDTH,
        rect.y,
        rect.x + TRACK_HEADER_WIDTH,
        rect.y + rect.height,
      ),
    );
  }
}
