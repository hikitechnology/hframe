import {
  Button,
  CompoundElement,
  Divider,
  Horizontal,
  Slider,
  TooltipProvider,
} from "@/lib/main";
import { Icons } from "../../../icons";
import { App } from "../../../app";
import {
  ICON_FONT,
  TIMELINE_CONTROLS_HEIGHT,
  TIMELINE_CONTROLS_PADDING,
  ZOOM_SLIDER_WIDTH,
} from "../../../constants";

export class TimelineControls extends CompoundElement {
  constructor() {
    super(new Horizontal());
    this.innerLayout.style.padding = TIMELINE_CONTROLS_PADDING;

    const mouseModeButtons = this.setupMouseModeButtons();
    for (const button of mouseModeButtons) {
      this.innerLayout
        .addSized(
          button,
          TIMELINE_CONTROLS_HEIGHT - 2 * TIMELINE_CONTROLS_PADDING,
        )
        .gap(TIMELINE_CONTROLS_PADDING);
    }
    this.innerLayout.addSized(new Divider(), 1).gap(TIMELINE_CONTROLS_PADDING);

    const interactModeButtons = this.setupInteractModeButtons();
    for (const button of interactModeButtons) {
      this.innerLayout
        .addSized(
          button,
          TIMELINE_CONTROLS_HEIGHT - 2 * TIMELINE_CONTROLS_PADDING,
        )
        .gap(TIMELINE_CONTROLS_PADDING);
    }

    this.innerLayout.gap().addSized(new Slider(), ZOOM_SLIDER_WIDTH);
  }

  private setupMouseModeButtons() {
    const pointer = new Button(Icons.Pointer);
    const tPointer = new TooltipProvider(
      pointer,
      App.tooltipLayer,
      "Pointer tool",
    );

    const scissor = new Button(Icons.Scissor);
    const tScissor = new TooltipProvider(scissor, App.tooltipLayer, "Cut tool");

    const shift = new Button(Icons.Shift);
    const tShift = new TooltipProvider(shift, App.tooltipLayer, "Shift tool");

    const stretch = new Button(Icons.Stretch);
    const tStretch = new TooltipProvider(
      stretch,
      App.tooltipLayer,
      "Stretch tool",
    );

    [pointer, scissor, shift, stretch].forEach((button) => {
      button.style = {
        font: ICON_FONT,
        fontSize: 18,
      };
    });

    return [tPointer, tScissor, tShift, tStretch];
  }

  private setupInteractModeButtons() {
    const snapping = new Button(Icons.Snapping);
    const tSnapping = new TooltipProvider(
      snapping,
      App.tooltipLayer,
      "Toggle snapping",
    );

    const linking = new Button(Icons.Chain);
    const tLinking = new TooltipProvider(
      linking,
      App.tooltipLayer,
      "Toggle linked clips",
    );

    [snapping, linking].forEach((button) => {
      button.style = {
        font: ICON_FONT,
        fontSize: 18,
      };
    });

    return [tSnapping, tLinking];
  }
}
