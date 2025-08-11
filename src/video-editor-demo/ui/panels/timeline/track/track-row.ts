import { CompoundElement, Horizontal } from "@/lib/main";
import { TrackHeader } from "./track-header";
import { Track } from "./track";
import { Timeline } from "../timeline";
import { TrackContainer } from "../track-container";
import { TRACK_HEADER_WIDTH } from "../../../../constants";
import { Clip } from "./clip";

export class TrackRow extends CompoundElement {
  private header: TrackHeader;
  private track: Track;

  constructor(
    isVideo: boolean,
    public name: string,
    timeline: Timeline,
    container: TrackContainer,
  ) {
    super(new Horizontal());
    this.header = new TrackHeader(isVideo, name);
    this.track = new Track(timeline, container);
    this.innerLayout.addSized(this.header, TRACK_HEADER_WIDTH).add(this.track);
  }

  addClip(clip: Clip) {
    this.track.addClip(clip);
  }

  getSnapPointInRadius(x: number, radius: number) {
    return this.track.getSnapPointInRadius(x, radius);
  }

  get hovered(): boolean {
    return this.track.hovered;
  }
}
