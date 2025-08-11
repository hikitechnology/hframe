import {
  Actions,
  CompoundElement,
  Context,
  Horizontal,
  Rect,
  Text,
  Vertical,
} from "@/lib/main";
import { TRACK_HEADER_WIDTH } from "../../../constants";
import { Timeline } from "./timeline";
import { Playhead } from "./playhead";

export class PlayheadRow extends CompoundElement {
  private timeDisplay: Text;

  constructor(private timeline: Timeline) {
    super(new Horizontal());

    const timeContainer = new Vertical();
    this.timeDisplay = new Text(
      this.formatTime(timeline.getPlaybackController().timestamp),
    );
    this.timeDisplay.style = {
      textCenteredH: true,
      textCenteredV: true,
      fontSize: 18,
    };
    timeContainer.addRelative(this.timeDisplay, 1);

    this.innerLayout
      .addSized(timeContainer, TRACK_HEADER_WIDTH)
      .add(new Playhead(timeline));
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    this.timeDisplay.text = this.formatTime(
      this.timeline.getPlaybackController().timestamp,
    );
    super.update(rect, context, actions);
  }

  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
}
