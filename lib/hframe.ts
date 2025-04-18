import { Context } from "./context";
import { Canvas2DPainter } from "./render/canvas-2d-painter";
import { Painter } from "./render/painter";
import { Theme } from "./style/theme";
import { Layout } from "./ui/abstract/layout";
import { Rect } from "./utils/shapes/rect";

/**
 * HFrame root element
 */
export class HFrame {
  private painter: Painter;
  private layers: Layout[] = [];
  private context: Context;

  constructor(private canvas: HTMLCanvasElement) {
    canvas.tabIndex = 0; // allow keyboard input

    // make sure canvas always takes up full window
    const setupCanvas = () => {
      const ratio = window.devicePixelRatio;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    this.context = new Context(canvas);
    this.painter = new Canvas2DPainter(canvas);

    // start application loop
    this.mainLoop();
  }

  setTheme(theme: Theme) {
    this.context.setTheme(theme);
  }

  getCurrentTheme() {
    return this.context.getCurrentTheme();
  }

  addLayer(layout: Layout) {
    this.layers.push(layout);
  }

  removeLayer(layout: Layout) {
    this.layers.splice(this.layers.indexOf(layout), 1);
  }

  getLayer(index: number) {
    return this.layers[index];
  }

  setBaseLayout(layout: Layout) {
    this.layers[0] = layout;
  }

  private mainLoop() {
    this.update();
    this.render();
    requestAnimationFrame(this.mainLoop.bind(this));
  }

  private update() {
    // update layers top-to-bottom so mouse clicks etc can be handled correctly
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      layer.update(this.rect, this.context);
    }
    this.context.refresh();
  }

  private render() {
    this.painter.clear();
    for (const layer of this.layers) {
      layer.render(this.rect, this.painter);
    }
  }

  private get rect() {
    const ratio = window.devicePixelRatio;
    return Rect.from(
      0,
      0,
      this.canvas.width / ratio,
      this.canvas.height / ratio,
    );
  }
}
