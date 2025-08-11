import { Button, CompoundElement, Horizontal, Slider } from "@/lib/main";
import {
  ICON_FONT,
  PLAYER_CONTROLS_HEIGHT,
  PLAYER_CONTROLS_PADDING,
} from "../../../constants";
import { Icons } from "../../../icons";
import { PlaybackController } from "../../../backend/playback-controller";

export class PlayerControls extends CompoundElement {
  constructor(controller: PlaybackController) {
    super(new Horizontal());
    this.innerLayout.style.padding = PLAYER_CONTROLS_PADDING;

    const leftContainer = new Horizontal(false, false);
    const transformButton = new Button(Icons.Transform);
    transformButton.style.font = ICON_FONT;
    transformButton.style.fontSize = 16;
    leftContainer.addSized(
      transformButton,
      PLAYER_CONTROLS_HEIGHT - PLAYER_CONTROLS_PADDING * 2,
    );

    const centerContainer = new Horizontal(false, false);
    const backButton = new Button(Icons.Back, () => {
      controller.playBackwards();
    });
    backButton.style.fontSize = 26;
    const stopButton = new Button(Icons.Stop, () => {
      controller.pause();
    });
    stopButton.style.fontSize = 20;
    const forwardButton = new Button(Icons.Forward, () => {
      controller.play();
    });
    forwardButton.style.fontSize = 26;

    centerContainer.gap().gap(PLAYER_CONTROLS_PADDING);
    [backButton, stopButton, forwardButton].forEach((button) => {
      button.style.font = ICON_FONT;
      centerContainer
        .addSized(button, PLAYER_CONTROLS_HEIGHT - 2 * PLAYER_CONTROLS_PADDING)
        .gap(PLAYER_CONTROLS_PADDING);
    });
    centerContainer.gap();

    const rightContainer = new Horizontal(false, false);
    const volumeSlider = new Slider(0, 100, 50, 1);
    rightContainer.gap().add(volumeSlider);

    this.innerLayout
      .add(leftContainer)
      .add(centerContainer)
      .add(rightContainer);
  }
}
