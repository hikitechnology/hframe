import {
  Actions,
  CompoundElement,
  Context,
  Freeform,
  HFrame,
  Horizontal,
  Rect,
  Vertical,
} from "@/lib/main";
import { PlaybackController } from "./backend/playback-controller";
import { DragLayer } from "./ui/layers/drag-layer";
import { MenuBar } from "./ui/elements/menu-bar";
import {
  DEFAULT_SIDEBAR_WIDTH,
  MENU_BAR_HEIGHT,
  MIN_SIDEBAR_WIDTH,
} from "./constants";
import { HVThemes } from "./themes";
import { Sidebar } from "./ui/panels/sidebar";
import { MediaPool } from "./ui/widgets/media-pool/media-pool";
import { Timeline } from "./ui/panels/timeline/timeline";
import { Player } from "./ui/panels/player/player";

export class App extends CompoundElement {
  static tooltipLayer: Freeform;
  private playbackController;

  constructor(private hframe: HFrame) {
    const innerLayout = new Vertical();
    super(innerLayout);

    this.playbackController = new PlaybackController(0, 120);

    const dragLayer = DragLayer.getInstance();
    const menuLayer = new Freeform();
    App.tooltipLayer = menuLayer;

    const container = new Horizontal();
    const inner = new Vertical();
    const topHalf = new Horizontal();
    const bottomHalf = new Horizontal();

    this.setupMenuBar(innerLayout, menuLayer);
    const [leftSidebar, rightSidebar] = this.setupSidebars(topHalf, container);

    const player = new Player(this.playbackController);
    const timeline = new Timeline(this.playbackController);

    innerLayout.add(
      container
        .addSized(leftSidebar, DEFAULT_SIDEBAR_WIDTH, true, MIN_SIDEBAR_WIDTH)
        .add(
          inner
            .addRelative(
              topHalf
                .add(player)
                .addSized(
                  rightSidebar,
                  DEFAULT_SIDEBAR_WIDTH,
                  true,
                  MIN_SIDEBAR_WIDTH,
                ),
              1,
              true,
            )
            .addRelative(bottomHalf.add(timeline), 1, true),
        ),
    );

    leftSidebar.addWidget(new MediaPool(dragLayer));

    hframe.addLayer(this);
    hframe.addLayer(menuLayer);
    hframe.addLayer(dragLayer);

    hframe.setTheme(
      localStorage.getItem("theme") === "light"
        ? HVThemes.light
        : HVThemes.dark,
    );
  }

  private setupMenuBar(baseLayout: Vertical, menuLayer: Freeform) {
    menuLayer.allowPassthrough = true;

    const menuBar = new MenuBar(menuLayer, {
      File: {
        Alert: (menu) => {
          alert("Alert button works :)");
          menu.close();
        },
      },
      View: {
        "Toggle theme": (menu) => {
          this.hframe.setTheme(
            this.hframe.getCurrentTheme().isDark
              ? HVThemes.light
              : HVThemes.dark,
          );
          localStorage.setItem(
            "theme",
            this.hframe.getCurrentTheme().isDark ? "dark" : "light",
          );
          menu.close();
        },
      },
    });

    baseLayout.addSized(menuBar, MENU_BAR_HEIGHT);
  }

  private setupSidebars(
    collapsedLayout: Horizontal,
    expandedLayout: Horizontal,
  ) {
    const left = new Sidebar(collapsedLayout, expandedLayout, true, true);
    const right = new Sidebar(collapsedLayout, expandedLayout, false, false);
    return [left, right];
  }

  protected update(rect: Rect, context: Context, actions?: Actions): void {
    if (context.justPressedKeys.includes(" ")) {
      if (this.playbackController.playingState === "paused") {
        this.playbackController.play();
      } else {
        this.playbackController.pause();
      }
    }
    this.playbackController.loop();
    super.update(rect, context, actions);
  }
}
