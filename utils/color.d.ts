export declare class Color {
    private r;
    private g;
    private b;
    private a;
    /**
     * Constructs a new Color
     * @param r - red (0-255)
     * @param g - green (0-255)
     * @param b - blue (0-255)
     * @param a - alpha (0-1, defaults to 1)
     */
    constructor(r: number, g: number, b: number, a?: number);
    /**
     * Constructs a new Color from RGBA values
     * @param r - red (0-255)
     * @param g - green (0-255)
     * @param b - blue (0-255)
     * @param a - alpha (0-1)
     */
    static rgba(r: number, g: number, b: number, a: number): Color;
    /**
     * Constructs a new Color from RGB values
     * @param r - red (0-255)
     * @param g - green (0-255)
     * @param b - blue (0-255)
     */
    static rgb(r: number, g: number, b: number): Color;
    /**
     * Constructs a new Color as a shade of gray
     * @param b - brightness (0-255)
     */
    static gray(b: number): Color;
    /**
     * Constructs a new Color using HSL values
     * @param h - Hue (0-360)
     * @param s - Saturation (0-100)
     * @param l - Lightness (0-100)
     * @returns A new Color object
     */
    static hsl(h: number, s: number, l: number): Color;
    /**
     * Returns a darker or lighter shade of a color
     * @param color - Original color
     * @param adjustment - Brightness adjustment
     */
    static adjustBrightness(color: Color, adjustment: number): Color;
    /**
     * Converts the Color object to a string
     */
    toString(): string;
    /**
     * Returns a copy of the Color object
     */
    clone(): Color;
    /**
     * Check if two colors are the same
     */
    equals(other: Color): boolean;
    static get RED(): Color;
    static get GREEN(): Color;
    static get BLUE(): Color;
    static get BLACK(): Color;
    static get WHITE(): Color;
    static get TRANSPARENT(): Color;
}
