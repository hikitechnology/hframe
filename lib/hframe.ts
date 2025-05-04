import { FALLBACK_THEME } from "./constants";
import { Context } from "./context";
import { Element } from "./main";
import { Canvas2DPainter } from "./render/canvas-2d-painter";
import { Painter } from "./render/painter";
import { Theme } from "./style/theme";
import { Rect } from "./utils/shapes/rect";

/**
 * HFrame root element
 */
export class HFrame {
  private theme: Theme = FALLBACK_THEME;
  private painter: Painter;
  private layers: Element[] = [];
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
    this.theme = theme;
    for (const layout of this.layers) {
      layout.updateTheme(theme);
    }
  }

  getCurrentTheme() {
    return this.theme;
  }

  addLayer(layer: Element) {
    this.layers.push(layer);
  }

  removeLayer(layer: Element) {
    this.layers.splice(this.layers.indexOf(layer), 1);
  }

  getLayer(index: number) {
    return this.layers[index];
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
      layer.updateElement(this.rect, this.context);
    }
    this.context.refresh();
  }

  private render() {
    this.painter.clear();
    for (const layer of this.layers) {
      layer.renderElement(this.rect, this.painter);
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
