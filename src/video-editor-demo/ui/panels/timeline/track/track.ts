import {
  Color,
  Context,
  Element,
  H_RESIZE_CURSOR,
  LineSegment,
  Painter,
  Rect,
} from "@/lib/main";
import { TrackContainer } from "../track-container";
import { Clip } from "./clip";
import { Timeline } from "../timeline";
import { TrackRow } from "./track-row";
import { DragLayer } from "../../../layers/drag-layer";
import { FileItem } from "../../../widgets/media-pool/file-item";
import { CLIP_RESIZE_LEEWAY, SNAP_DISTANCE } from "../../../../constants";
import { closestNumber } from "../../../../helpers";

export class Track extends Element {
  private clips: Clip[] = [];
  private _hovered: boolean = false;
  private previewing: { source: FileItem; clip: Clip }[] = [];
  private resizing: { clip: Clip; side: "left" | "right" } | null = null;
  private excludeFromSnapping: Clip[] = [];

  constructor(
    private timeline: Timeline,
    private container: TrackContainer,
  ) {
    super();
  }

  protected update(rect: Rect, context: Context): void {
    if (rect.contains(context.mousePos)) {
      this._hovered = true;
    } else {
      this._hovered = false;
    }

    this.handleMediaDrag(rect, context);
    this.handleClipInteraction(rect, context);
    this.cleanUpClips();
  }

  protected render(rect: Rect, painter: Painter): void {
    painter.clip(rect);
    for (const clip of this.clips.concat(
      this.previewing.map((item) => item.clip),
    )) {
      const clipRect = this.getClipRect(rect, clip);
      if (clipRect.intersects(rect)) {
        if (clipRect.width > 0) {
          painter.setColor(Color.GREEN);
          painter.fillRect(clipRect);
          painter.setColor(this.style.outline);
          painter.outlineRect(clipRect);
        } else if (this.resizing) {
          painter.setColor(this.style.outline);
          painter.drawLine(
            LineSegment.from(
              this.resizing.side === "right"
                ? clipRect.x
                : clipRect.x + clipRect.width,
              clipRect.y,
              this.resizing.side === "right"
                ? clipRect.x
                : clipRect.x + clipRect.width,
              clipRect.y + clipRect.height,
            ),
          );
        }
      }
    }
    painter.unclip();
  }

  addClip(clip: Clip) {
    this.clips.push(clip);
  }

  removeClip(clip: Clip) {
    this.clips.splice(this.clips.indexOf(clip), 1);
  }

  getSnapPointInRadius(x: number, radius: number): number | null {
    let closest = null;

    if (this.lastRect) {
      const pixelsPerSecond = this.lastRect.width / this.timeline.hZoom;

      for (const clip of this.clips.filter(
        (clip) => !this.excludeFromSnapping.includes(clip),
      )) {
        const inPx = (clip.in - this.timeline.scrollOffset) * pixelsPerSecond;
        const outPx = (clip.out - this.timeline.scrollOffset) * pixelsPerSecond;
        const closestEdge = closestNumber(x, inPx, outPx);
        if (Math.abs(closestEdge - x) < radius) {
          if (closest === null) {
            closest = closestEdge;
          } else {
            closest = closestNumber(x, closest, closestEdge);
          }
        }
      }
    }

    return closest;
  }

  private getClipRect(trackRect: Rect, clip: Clip) {
    const pixelsPerSecond = trackRect.width / this.timeline.hZoom;
    return Rect.from(
      trackRect.x +
        pixelsPerSecond * clip.in -
        pixelsPerSecond * this.timeline.scrollOffset,
      trackRect.y,
      (clip.out - clip.in) * pixelsPerSecond,
      trackRect.height,
    );
  }

  private moveDraggingClipsTo(destination: Track | TrackRow) {
    for (const clip of this.clips.filter((clip) =>
      this.container.draggingClips.some((drag) => drag.clip === clip),
    )) {
      this.removeClip(clip);
      destination.addClip(clip);
    }
  }

  private handleMediaDrag(rect: Rect, context: Context) {
    const mousePos = context.peekAtRealMousePos();
    const secondsPerPixel = this.timeline.hZoom / rect.width;
    const hoveredTimestamp =
      (mousePos.x - rect.x) * secondsPerPixel + this.timeline.scrollOffset;
    const layer = DragLayer.getInstance();

    const droppedElements = layer.droppedElements();
    if (droppedElements && rect.contains(mousePos)) {
      for (const element of droppedElements.filter(
        (element) => element instanceof FileItem,
      )) {
        const existingClip = this.previewing.find(
          (item) => item.source === element,
        )?.clip;
        if (existingClip) {
          this.clips.push(existingClip);
          this.trimClipsAround(existingClip);
        }
      }
    }

    const draggingElements = layer.draggingElements();
    if (draggingElements && rect.contains(mousePos)) {
      for (const element of draggingElements.filter(
        (element) => element instanceof FileItem,
      )) {
        const preview = this.previewing.find((item) => item.source === element);
        const clipDuration = element.innerFile.fullDuration;

        const tentativeClipIn = hoveredTimestamp - clipDuration / 2;
        const snappedClipIn = this.getSnappedStartTime(
          tentativeClipIn,
          clipDuration,
        );

        let clipIn = snappedClipIn;
        let clipOut = clipIn + clipDuration;

        const duration = this.timeline.getPlaybackController().duration;
        if (clipIn < 0) {
          clipOut += Math.abs(clipIn);
          clipIn = 0;
        } else if (clipOut > duration) {
          clipIn -= clipOut - duration;
          clipOut = duration;
        }

        if (preview) {
          preview.clip.in = clipIn;
          preview.clip.out = clipOut;
        } else {
          this.previewing.push({
            source: element,
            clip: {
              in: clipIn,
              out: clipOut,
              mediaSource: element.innerFile,
            },
          });
        }
      }
    } else {
      this.previewing = [];
    }
  }

  private trimClipsAround(origin: Clip) {
    for (const clip of this.clips) {
      if (clip === origin) continue;

      const frontOverlapping = clip.in <= origin.in && origin.in <= clip.out;
      const endOverlapping = clip.in <= origin.out && origin.out <= clip.out;
      const completelyOverlapping =
        origin.in <= clip.in && clip.out <= origin.out;
      if (frontOverlapping && endOverlapping) {
        const frontDistance = origin.in - clip.in;
        const endDistance = clip.out - origin.out;
        if (frontDistance < endDistance) {
          clip.in = origin.out;
        } else {
          clip.out = origin.in;
        }
      } else if (frontOverlapping) {
        clip.out = origin.in;
      } else if (endOverlapping) {
        clip.in = origin.out;
      } else if (completelyOverlapping) {
        this.removeClip(clip);
      }
    }
  }

  private handleClipInteraction(rect: Rect, context: Context) {
    const secondsPerPixel = this.timeline.hZoom / rect.width;

    for (const clip of this.clips) {
      const clipRect = this.getClipRect(rect, clip);
      const leftHovered = clipRect.left.touchesPoint(
        context.mousePos,
        CLIP_RESIZE_LEEWAY,
      );
      const rightHovered = clipRect.right.touchesPoint(
        context.mousePos,
        CLIP_RESIZE_LEEWAY,
      );
      const clipHovered = clipRect.contains(context.mousePos);

      if (
        (leftHovered || rightHovered) &&
        this.container.draggingClips.length === 0
      ) {
        context.cursor = H_RESIZE_CURSOR;
        if (context.justPressedMouse) {
          this.resizing = {
            clip,
            side: leftHovered ? "left" : "right",
          };
        }
      } else if (clipHovered && context.justPressedMouse) {
        this.container.draggingClips = [
          {
            clip,
            mouseOffset: context.mousePos.x - clipRect.x,
          },
        ];
      }
    }

    if (context.justReleasedMouse && this.resizing) {
      this.trimClipsAround(this.resizing.clip);
      this.resizing = null;
    }

    for (const drag of this.container.draggingClips.filter((drag) =>
      this.clips.includes(drag.clip),
    )) {
      const clip = drag.clip;

      this.clips.push(this.clips.splice(this.clips.indexOf(clip), 1)[0]);
      this.disableSnappingFor(clip);

      const mouseX = context.peekAtRealMousePos().x;
      const newClipX = mouseX - drag.mouseOffset;
      const pxAdjustment = newClipX - this.getClipRect(rect, clip).x;
      const secsAdjustment = pxAdjustment * secondsPerPixel;
      const tentativeStart = clip.in + secsAdjustment;
      const duration = clip.out - clip.in;
      const snappedStart = this.getSnappedStartTime(tentativeStart, duration);

      clip.in = snappedStart;
      clip.out = snappedStart + duration;

      const timelineDuration = this.timeline.getPlaybackController().duration;
      if (clip.in < 0) {
        clip.in = 0;
        clip.out = duration;
      } else if (clip.out > timelineDuration) {
        clip.in = timelineDuration - duration;
        clip.out = timelineDuration;
      }

      this.enableSnappingFor(clip);
    }

    if (this.resizing) {
      this.clips.push(
        this.clips.splice(this.clips.indexOf(this.resizing.clip), 1)[0],
      );
      this.disableSnappingFor(this.resizing.clip);

      context.cursor = H_RESIZE_CURSOR;
      const clipRect = this.getClipRect(rect, this.resizing.clip);

      const oldX =
        clipRect.x +
        (this.resizing.side === "right" ? clipRect.width : 0) -
        rect.x;
      const newX =
        this.timeline.getSnapPointInRadius(
          context.peekAtRealMousePos().x - rect.x,
          SNAP_DISTANCE,
        ) ?? context.peekAtRealMousePos().x - rect.x;

      const distance = newX - oldX;
      const distanceSecs = distance * secondsPerPixel;

      if (this.resizing.side === "left") {
        this.resizing.clip.in = Math.max(
          0,
          this.resizing.clip.in + distanceSecs,
        );
      } else {
        this.resizing.clip.out = Math.min(
          this.resizing.clip.out + distanceSecs,
          this.timeline.getPlaybackController().duration,
        );
      }

      this.enableSnappingFor(this.resizing.clip);
    }

    for (const clip of this.container.justDroppedClips
      .filter((drag) => this.clips.includes(drag.clip))
      .map((drag) => drag.clip)) {
      this.trimClipsAround(clip);
    }

    if (!rect.contains(context.mousePos)) {
      const hoveredTrack = this.container.getHoveredTrack();
      if (hoveredTrack) {
        this.moveDraggingClipsTo(hoveredTrack);
      }
    }
  }

  private getSnappedStartTime(
    tentativeStart: number,
    duration: number,
  ): number {
    if (!this.lastRect) return tentativeStart;

    const pixelsPerSecond = this.lastRect.width / this.timeline.hZoom;
    const scrollOffset = this.timeline.scrollOffset;

    const startPx = (tentativeStart - scrollOffset) * pixelsPerSecond;
    const endPx = (tentativeStart + duration - scrollOffset) * pixelsPerSecond;

    const snapStartPx = this.timeline.getSnapPointInRadius(
      startPx,
      SNAP_DISTANCE,
    );
    const snapEndPx = this.timeline.getSnapPointInRadius(endPx, SNAP_DISTANCE);

    if (snapStartPx !== null && snapEndPx !== null) {
      const distToStart = Math.abs(snapStartPx - startPx);
      const distToEnd = Math.abs(snapEndPx - endPx);
      if (distToStart < distToEnd) {
        return snapStartPx / pixelsPerSecond + scrollOffset;
      } else {
        return snapEndPx / pixelsPerSecond + scrollOffset - duration;
      }
    } else if (snapStartPx !== null) {
      return snapStartPx / pixelsPerSecond + scrollOffset;
    } else if (snapEndPx !== null) {
      return snapEndPx / pixelsPerSecond + scrollOffset - duration;
    } else {
      return tentativeStart;
    }
  }

  private disableSnappingFor(clip: Clip) {
    if (!this.excludeFromSnapping.includes(clip)) {
      this.excludeFromSnapping.push(clip);
    }
  }

  private enableSnappingFor(clip: Clip) {
    if (this.excludeFromSnapping.includes(clip)) {
      this.excludeFromSnapping.splice(
        this.excludeFromSnapping.indexOf(clip),
        1,
      );
    }
  }

  private cleanUpClips() {
    for (const clip of this.clips) {
      if (clip.out <= clip.in && this.resizing?.clip !== clip) {
        this.removeClip(clip);
      }
    }
  }

  get hovered() {
    return this._hovered;
  }
}
