export class Color {
  /**
   * Constructs a new Color
   * @param r - red (0-255)
   * @param g - green (0-255)
   * @param b - blue (0-255)
   * @param a - alpha (0-1, defaults to 1)
   */
  constructor(
    private r: number,
    private g: number,
    private b: number,
    private a: number = 1,
  ) {}

  /**
   * Constructs a new Color from RGBA values
   * @param r - red (0-255)
   * @param g - green (0-255)
   * @param b - blue (0-255)
   * @param a - alpha (0-1)
   */
  static rgba(r: number, g: number, b: number, a: number) {
    return new Color(r, g, b, a);
  }

  /**
   * Constructs a new Color from RGB values
   * @param r - red (0-255)
   * @param g - green (0-255)
   * @param b - blue (0-255)
   */
  static rgb(r: number, g: number, b: number) {
    return new Color(r, g, b, 1);
  }

  /**
   * Constructs a new Color as a shade of gray
   * @param b - brightness (0-255)
   */
  static gray(b: number) {
    return new Color(b, b, b);
  }

  /**
   * Constructs a new Color using HSL values
   * @param h - Hue (0-360)
   * @param s - Saturation (0-100)
   * @param l - Lightness (0-100)
   * @returns A new Color object
   */
  static hsl(h: number, s: number, l: number) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    if (s === 0) {
      const value = Math.round(l * 255);
      return new Color(value, value, value, 1);
    }

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    const x = c * (1 - Math.abs((hPrime % 2) - 1));
    const m = 1 - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (hPrime >= 0 && hPrime < 1) {
      r = c;
      g = x;
    } else if (hPrime >= 1 && hPrime < 2) {
      r = x;
      g = c;
    } else if (hPrime >= 2 && hPrime < 3) {
      g = c;
      b = x;
    } else if (hPrime >= 3 && hPrime < 4) {
      g = x;
      b = c;
    } else if (hPrime >= 4 && hPrime < 5) {
      r = x;
      b = c;
    } else if (hPrime >= 5 && hPrime < 6) {
      r = c;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return new Color(r, g, b, 1);
  }

  /**
   * Returns a darker or lighter shade of a color
   * @param color - Original color
   * @param adjustment - Brightness adjustment
   */
  static adjustBrightness(color: Color, adjustment: number) {
    const newColor = color.clone();
    newColor.r += adjustment;
    newColor.g += adjustment;
    newColor.b += adjustment;
    return newColor;
  }

  /**
   * Converts the Color object to a string
   */
  toString() {
    return `rgb(${this.r} ${this.g} ${this.b} / ${this.a * 100}%)`;
  }

  /**
   * Returns a copy of the Color object
   */
  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * Check if two colors are the same
   */
  equals(other: Color): boolean {
    return (
      this.r === other.r &&
      this.g === other.g &&
      this.b === other.b &&
      this.a === other.a
    );
  }

  // ----- color constants -----

  static get RED() {
    return new Color(255, 0, 0);
  }

  static get GREEN() {
    return new Color(0, 255, 0);
  }

  static get BLUE() {
    return new Color(0, 0, 255);
  }

  static get BLACK() {
    return new Color(0, 0, 0);
  }

  static get WHITE() {
    return new Color(255, 255, 255);
  }

  static get TRANSPARENT() {
    return new Color(0, 0, 0, 0);
  }
}
