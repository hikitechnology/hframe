import { Element } from './main';
import { Theme } from './style/theme';
/**
 * HFrame root element
 */
export declare class HFrame {
    private canvas;
    private theme;
    private painter;
    private layers;
    private context;
    constructor(canvas: HTMLCanvasElement);
    setTheme(theme: Theme): void;
    getCurrentTheme(): Theme;
    addLayer(layer: Element): void;
    removeLayer(layer: Element): void;
    getLayer(index: number): Element;
    private mainLoop;
    private update;
    private render;
    private get rect();
}
