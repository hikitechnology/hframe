import {
  Actions,
  Button,
  CompoundElement,
  Context,
  Horizontal,
  Painter,
  Rect,
  Text,
  Vertical,
} from "@/lib/main";
import { Icons } from "../../../../icons";
import {
  HIDE_TRACK_BUTTONS_AT,
  ICON_FONT,
  TRACK_BUTTON_SIZE,
  TRACK_HEADER_WIDTH,
} from "../../../../constants";

export class TrackHeader extends CompoundElement {
  private buttons: TrackButtons;

  constructor(isVideo: boolean, name: string) {
    super(new Vertical());

    this.buttons = new TrackButtons(isVideo, TRACK_BUTTON_SIZE);
    const label = new Text(name);
    label.style.textCenteredH = true;
    this.innerLayout.gap().add(label).gap().add(this.buttons);
    // .gap((TRACK_HEADER_WIDTH - TRACK_BUTTON_SIZE * 2) / 3);
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    if (rect.height < HIDE_TRACK_BUTTONS_AT) {
      this.buttons.hide();
    } else {
      this.buttons.show();
    }
    super.update(rect, context, actions);
  }
}

class TrackButtons extends CompoundElement {
  private hidden: boolean = false;

  constructor(
    private isVideo: boolean,
    private height: number,
  ) {
    super(new Vertical(false, false));

    const buttons = new Horizontal(false, false);
    const soloButton = new Button(this.soloIcon);
    const muteButton = new Button(this.muteIcon);
    [soloButton, muteButton].forEach((button) => {
      button.style.font = ICON_FONT;
      button.style.fontSize = 16;
    });

    buttons
      .gap()
      .addSized(soloButton, TRACK_BUTTON_SIZE)
      .gap()
      .addSized(muteButton, TRACK_BUTTON_SIZE)
      .gap();

    this.innerLayout
      .addSized(buttons, height)
      .gap((TRACK_HEADER_WIDTH - TRACK_BUTTON_SIZE * 2) / 3);
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    if (actions) {
      if (this.hidden) {
        actions.requestHeight(0);
      } else {
        actions.requestHeight(
          this.height + (TRACK_HEADER_WIDTH - TRACK_BUTTON_SIZE * 2) / 3,
        );
      }
    }
    super.update(rect, context, actions);
  }

  protected render(rect: Rect, painter: Painter): void {
    if (!this.hidden) {
      super.render(rect, painter);
    }
  }

  hide() {
    this.hidden = true;
  }

  show() {
    this.hidden = false;
  }

  private get soloIcon() {
    return this.isVideo ? Icons.Eye : Icons.Ear;
  }

  private get muteIcon() {
    return this.isVideo ? Icons.EyeCrossed : Icons.EarCrossed;
  }
}
