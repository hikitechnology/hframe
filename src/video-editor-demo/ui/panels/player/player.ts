import { CompoundElement, Image, URIImageSource, Vertical } from "@/lib/main";
import { PlayerControls } from "./controls";
import { PLAYER_CONTROLS_HEIGHT } from "../../../constants";
import { PlaybackController } from "../../../backend/playback-controller";

export class Player extends CompoundElement {
  constructor(controller: PlaybackController) {
    super(new Vertical());

    const imageSource = new URIImageSource(
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    );
    const topMiddleImage = new Image(imageSource);

    this.innerLayout
      .addRelative(topMiddleImage, 1)
      .addSized(new PlayerControls(controller), PLAYER_CONTROLS_HEIGHT);
  }
}
