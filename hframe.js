var B = Object.defineProperty;
var K = (u, s, t) => s in u ? B(u, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[s] = t;
var l = (u, s, t) => K(u, typeof s != "symbol" ? s + "" : s, t);
class c {
  /**
   * Constructs a new Pos2D object
   * @param x - x coordinate
   * @param y - y coordinate
   */
  constructor(s, t) {
    this.x = s, this.y = t;
  }
  /**
   * Returns a copy of this Pos2D object
   */
  clone() {
    return new c(this.x, this.y);
  }
  /**
   * Checks if this position is the same as another position
   * @param other - The other Pos2D to compare with
   * @returns true if the positions have the same coordinates
   */
  equals(s) {
    return this.x === s.x && this.y === s.y;
  }
}
class S {
  /**
   * Constructs a new Vec2D object
   * @param x - width
   * @param y - height
   */
  constructor(s, t) {
    this.x = s, this.y = t;
  }
  /**
   * Returns a copy of this Vec2D object
   */
  clone() {
    return new S(this.x, this.y);
  }
  equals(s) {
    return this.x === s.x && this.y === s.y;
  }
  /**
   * Returns the length of a vector
   */
  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}
class w {
  /**
   * Constructs a new LineSegment
   * @param p1 - position from
   * @param p2 - position to
   */
  constructor(s, t) {
    this.p1 = s, this.p2 = t;
  }
  /**
   * Constructs a new LineSegment from a set of coordinates
   * @param x1 - x coordinate from
   * @param y1 - y coordinate from
   * @param x2 - x coordinate to
   * @param y2 - y coordinate to
   */
  static from(s, t, e, i) {
    return new w(new c(s, t), new c(e, i));
  }
  /**
   * Returns a copy of this LineSegment
   */
  clone() {
    return new w(this.p1.clone(), this.p2.clone());
  }
  /**
   * Determines if a point touches this segment
   * @param point - point to test
   * @param leeway - tolerated distance from the line (default 0)
   */
  touchesPoint(s, t = 0) {
    const e = this.toVec(), i = new S(s.x - this.p1.x, s.y - this.p1.y), h = e.length ** 2;
    if (h === 0)
      return i.length <= t;
    const r = Math.max(
      0,
      Math.min(
        1,
        (i.x * e.x + i.y * e.y) / h
      )
    ), o = this.p1.x + r * e.x, a = this.p1.y + r * e.y, d = s.x - o, m = s.y - a;
    return Math.sqrt(d ** 2 + m ** 2) <= t;
  }
  /**
   * Returns the vector representation of this line segment
   */
  toVec() {
    return new S(this.p2.x - this.p1.x, this.p2.y - this.p1.y);
  }
}
class g {
  /**
   * Constructs a new Rect
   * @param position - position of the top left corner
   * @param size - size vector
   */
  constructor(s, t) {
    this.position = s, this.size = t;
  }
  /**
   * Constructs a new rect
   * @param x - x coordinate of top left corner
   * @param y - y coordinate of top left corner
   * @param width - width of the rectangle
   * @param height - height of the rectangle
   */
  static from(s, t, e, i) {
    return new g(new c(s, t), new S(e, i));
  }
  equals(s) {
    return this.position.equals(s.position) && this.size.equals(s.size);
  }
  /**
   * Check if the Rect contains a Pos2D point, with optional leeway
   * @param position - Pos2D point
   * @param leeway - tolerated distance from rect (default 0)
   */
  contains(s, t = 0) {
    const e = this.position.x - t, i = this.position.x + this.size.x + t, h = this.position.y - t, r = this.position.y + this.size.y + t, o = e <= s.x && s.x <= i, a = h <= s.y && s.y <= r;
    return o && a;
  }
  /**
   * Grows a Rect from its center by the given distance on each side, and returns itself
   * Shrinks the Rect if the value is negative
   * @param growBy - How much to shrink each side by
   */
  grow(s) {
    return this.x -= s, this.y -= s, this.width += s * 2, this.height += s * 2, this;
  }
  /**
   * Check if a Rect intersects with another Rect
   * @param other: Other Rect
   */
  intersects(s) {
    return this.x <= s.x + s.width && s.x <= this.x + this.width && this.y <= s.y + s.height && s.y <= this.y + this.height;
  }
  /**
   * Returns a copy of this Rect
   */
  clone() {
    return new g(this.position.clone(), this.size.clone());
  }
  // ----- getters & setters -----
  get x() {
    return this.position.x;
  }
  set x(s) {
    this.position.x = s;
  }
  get y() {
    return this.position.y;
  }
  set y(s) {
    this.position.y = s;
  }
  get width() {
    return this.size.x;
  }
  set width(s) {
    this.size.x = s;
  }
  get height() {
    return this.size.y;
  }
  set height(s) {
    this.size.y = s;
  }
  get topLeft() {
    return new c(this.x, this.y);
  }
  get topRight() {
    return new c(this.x + this.width, this.y);
  }
  get bottomLeft() {
    return new c(this.x, this.y + this.height);
  }
  get bottomRight() {
    return new c(this.x + this.width, this.y + this.height);
  }
  get center() {
    return new c(this.x + this.width / 2, this.y + this.height / 2);
  }
  get left() {
    return new w(this.topLeft, this.bottomLeft);
  }
  get right() {
    return new w(this.topRight, this.bottomRight);
  }
  get top() {
    return new w(this.topLeft, this.topRight);
  }
  get bottom() {
    return new w(this.bottomLeft, this.bottomRight);
  }
}
class W {
  constructor(s) {
    l(this, "custom", {});
    this.style = s;
    const t = (e) => {
      Object.defineProperty(this, e, {
        get: () => this.custom[e] ?? this.style[e],
        set: (i) => {
          this.custom[e] = i;
        },
        enumerable: !0
      });
    };
    Object.keys(s).forEach((e) => {
      t(e);
    });
  }
  updateBaseStyle(s) {
    this.style = s;
  }
  updateCustomStyle(s) {
    this.custom = s;
  }
}
class y {
  constructor() {
    l(this, "_style", new W(
      b.getStyleFor(this)
    ));
    l(this, "currentTheme", b);
    l(this, "lastRect", null);
    l(this, "allowPassthrough", !1);
  }
  updateTheme(s) {
    this.currentTheme = s, this._style.updateBaseStyle(s.getStyleFor(this));
  }
  updateElement(s, t, e) {
    this.lastRect = s;
    const i = s.contains(t.mousePos);
    i || t.pauseInteraction(), this.update(s, t, e), i && this.allowPassthrough === !1 ? t.pauseInteraction() : t.resumeInteraction();
  }
  renderElement(s, t) {
    this.renderSelf(s, t), this.render(s, t);
  }
  renderSelf(s, t) {
    t.setColor(this.style.fill), t.fillRect(s, this.style.rounding), t.setColor(this.style.outline), t.outlineRect(s, this.style.rounding);
  }
  get style() {
    return this._style;
  }
  set style(s) {
    this._style.updateCustomStyle(s);
  }
  get minWidth() {
    return 0;
  }
  get minHeight() {
    return 0;
  }
}
class H extends y {
  update() {
  }
  render() {
  }
}
class F extends y {
  constructor() {
    super(...arguments);
    l(this, "elements", []);
  }
  updateTheme(t) {
    this.currentTheme = t, super.updateTheme(t);
    for (const e of this.elements)
      e.updateTheme(t);
  }
  styleChildren(t) {
    for (const e of this.elements) {
      if (!(e.style instanceof W))
        throw new Error(
          "Element isn't using StyleManager, so can't override style"
        );
      e.style.updateCustomStyle(t);
    }
  }
}
class T extends F {
  constructor(t, e, i) {
    super();
    l(this, "allocations", []);
    l(this, "cachedRect", null);
    this.isVertical = t, e || (this.style.outline = n.TRANSPARENT), i || (this.style.fill = n.TRANSPARENT);
  }
  gap(t) {
    return t ? this.addSized(new H(), t) : this.add(new H()), this;
  }
  add(...t) {
    for (const e of t)
      this.elements.push(e), this.allocations.push({
        type: "relative",
        size: 1,
        minElementSize: {
          width: e.minWidth,
          height: e.minHeight
        },
        resizable: !1,
        setByUser: !1
      }), e.updateTheme(this.currentTheme);
    return this;
  }
  addSized(t, e, i = !1, h) {
    return this.elements.push(t), this.allocations.push({
      type: "pixel",
      size: e,
      minSize: h,
      minElementSize: {
        width: t.minWidth,
        height: t.minHeight
      },
      resizable: i,
      setByUser: !0
    }), t.updateTheme(this.currentTheme), this;
  }
  addRelative(t, e, i = !1, h) {
    return this.elements.push(t), this.allocations.push({
      type: "relative",
      size: e,
      minSize: h,
      minElementSize: {
        width: t.minWidth,
        height: t.minHeight
      },
      resizable: i,
      setByUser: !0
    }), t.updateTheme(this.currentTheme), this;
  }
  insert(t, e) {
    return this.elements.splice(t, 0, e), this.allocations.splice(t, 0, {
      type: "relative",
      size: 1,
      minElementSize: {
        width: e.minWidth,
        height: e.minHeight
      },
      resizable: !1,
      setByUser: !1
    }), e.updateTheme(this.currentTheme), this;
  }
  insertSized(t, e, i, h = !1, r) {
    return this.elements.splice(t, 0, e), this.allocations.splice(t, 0, {
      type: "pixel",
      size: i,
      minSize: r,
      minElementSize: {
        width: e.minWidth,
        height: e.minHeight
      },
      resizable: h,
      setByUser: !0
    }), e.updateTheme(this.currentTheme), this;
  }
  insertRelative(t, e, i, h = !1, r) {
    return this.elements.splice(t, 0, e), this.allocations.splice(t, 0, {
      type: "relative",
      size: i,
      minSize: r,
      minElementSize: {
        width: e.minWidth,
        height: e.minHeight
      },
      resizable: h,
      setByUser: !0
    }), e.updateTheme(this.currentTheme), this;
  }
  remove(t) {
    const e = this.elements.indexOf(t);
    this.elements.splice(e, 1), this.allocations.splice(e, 1);
  }
  includes(t) {
    return this.elements.includes(t);
  }
  clear() {
    this.elements = [], this.allocations = [];
  }
  indexOf(t) {
    return this.elements.indexOf(t);
  }
  setSize(t, e) {
    const i = this.getAllocation(t);
    i.type = "pixel", i.size = e;
  }
  getRect(t) {
    return this.cachedRect ? this.getAllocRect(this.cachedRect, t) : g.from(NaN, NaN, NaN, NaN);
  }
  update(t, e) {
    this.cachedRect = t, this.updateMinSizes();
    const i = t.clone().grow(-this.style.padding);
    for (const h of this.elements) {
      const r = this.getAllocRect(i, h);
      if (r.intersects(t)) {
        const o = {
          requestWidth: (a) => {
            const d = this.getAllocation(h);
            !this.isVertical && !d.setByUser && (d.type = "pixel", d.size = a);
          },
          requestHeight: (a) => {
            const d = this.getAllocation(h);
            this.isVertical && !d.setByUser && (d.type = "pixel", d.size = a);
          }
        };
        h.updateElement(r, e, o);
      }
    }
  }
  render(t, e) {
    const i = t.clone().grow(-this.style.padding);
    for (const h of this.elements) {
      const r = this.getAllocRect(i, h);
      r.intersects(t) && h.renderElement(r, e);
    }
  }
  updateMinSizes() {
    for (let t = 0; t < this.elements.length; t++) {
      const e = this.elements[t], i = this.allocations[t];
      i.minElementSize.width = e.minWidth, i.minElementSize.height = e.minHeight;
    }
  }
  getAllocation(t) {
    const e = this.elements.indexOf(t);
    return this.allocations[e];
  }
  getAllocRect(t, e) {
    const i = this.getAllocation(e);
    let h = 0;
    for (const f of this.allocations) {
      if (f === i)
        break;
      f.type === "pixel" ? h += f.size : h += f.size / this.sumRelativeAllocations() * ((this.isVertical ? t.height : t.width) - this.sumPixelAllocations());
    }
    const r = t.x + (this.isVertical ? 0 : h), o = t.y + (this.isVertical ? h : 0), a = i.type === "pixel" ? i.size : i.size / this.sumRelativeAllocations() * ((this.isVertical ? t.height : t.width) - this.sumPixelAllocations()), d = this.isVertical ? t.width : a, m = this.isVertical ? a : t.height;
    return g.from(r, o, d, m);
  }
  getSizeInPixels(t, e) {
    return e.type === "pixel" ? e.size : e.size / this.sumRelativeAllocations() * ((this.isVertical ? t.height : t.width) - this.sumPixelAllocations());
  }
  sumPixelAllocations() {
    return this.allocations.filter((e) => e.type === "pixel").reduce((e, i) => e + i.size, 0);
  }
  sumRelativeAllocations() {
    return this.allocations.filter((e) => e.type === "relative").reduce((e, i) => e + i.size, 0);
  }
  getMinSize(t) {
    return !t.minSize && t.minSize !== 0 ? this.isVertical ? t.minElementSize.height : t.minElementSize.width : t.minSize;
  }
  growAllocation(t, e) {
    if (t.type === "pixel")
      t.size += e;
    else if (this.cachedRect) {
      const i = this.allocations.filter(
        (h) => h.type === "relative"
      );
      if (i.length > 1) {
        const h = (this.isVertical ? this.cachedRect.height : this.cachedRect.width) - this.sumPixelAllocations(), r = i.reduce(
          (a, d) => a + d.size,
          0
        ), o = e / h * r;
        t.size += o;
      }
    }
  }
  get minWidth() {
    if (this.cachedRect)
      if (this.isVertical) {
        let t = 0;
        for (const e of this.allocations) {
          const i = e.minElementSize.width;
          i > t && (t = i);
        }
        return t + 2 * this.style.padding;
      } else {
        let t = 0;
        for (const e of this.allocations)
          e.type === "pixel" ? t += this.getSizeInPixels(this.cachedRect, e) : t += this.getMinSize(e);
        return t + 2 * this.style.padding;
      }
    else
      return 0;
  }
  get minHeight() {
    if (this.cachedRect)
      if (this.isVertical) {
        let t = 0;
        for (const e of this.allocations)
          e.type === "pixel" ? t += this.getSizeInPixels(this.cachedRect, e) : t += this.getMinSize(e);
        return t + 2 * this.style.padding;
      } else {
        let t = 0;
        for (const e of this.allocations) {
          const i = e.minElementSize.height;
          i > t && (t = i);
        }
        return t + 2 * this.style.padding;
      }
    else
      return 0;
  }
}
class E extends y {
  constructor() {
    super(...arguments);
    l(this, "value", "");
    l(this, "focused", !1);
    l(this, "selectionStart", 0);
    l(this, "selectionEnd", 0);
    l(this, "textShift", 0);
  }
  collectInput(t) {
    t.collectTextInput(
      this.value,
      (e, i, h) => {
        if (this.focused) {
          if (t.justPressedKeys.includes("Enter")) {
            this.unfocus();
            return;
          }
          this.value = e, this.selectionStart = i, this.selectionEnd = h;
        }
      }
    );
  }
  getCaretPositionFromMouse(t, e, i) {
    const h = t - e.x - this.style.padding + this.textShift;
    let r = this.value.length;
    for (let o = 0; o <= this.value.length; o++) {
      const a = this.value.substring(0, o);
      if (i.measureText(a, this.style.fontSize) > h) {
        r = o;
        break;
      }
    }
    return r;
  }
  drawCursor(t, e) {
    if (this.selectionStart === this.selectionEnd) {
      const i = t.measureText(
        this.value.substring(0, this.selectionStart),
        this.style.fontSize
      );
      t.setColor(Q);
      const h = e.x + this.style.padding + i - this.textShift, r = w.from(
        h,
        e.y + this.style.padding,
        h,
        e.y + e.height - this.style.padding
      );
      t.drawLine(r, 1.5);
    }
  }
  updateTextShift(t, e) {
    const i = t.measureText(
      this.value.substring(0, this.selectionEnd),
      this.style.fontSize
    );
    i > e.width - 2 * this.style.padding ? this.textShift = i - (e.width - 2 * this.style.padding) : this.textShift = 0;
  }
  selectAll(t) {
    this.selectionStart = 0, this.selectionEnd = this.value.length, t.setTextSelectionRange(0, this.value.length);
  }
  drawSelectionHighlight(t, e) {
    if (this.selectionStart !== this.selectionEnd) {
      const i = t.measureText(
        this.value.substring(0, this.selectionStart),
        this.style.fontSize
      ), h = t.measureText(
        this.value.substring(0, this.selectionEnd),
        this.style.fontSize
      );
      t.setColor(J);
      const r = g.from(
        e.x + this.style.padding + i - this.textShift,
        e.y + this.style.padding,
        h - i,
        e.height - 2 * this.style.padding
      );
      t.fillRect(r);
    }
  }
  focus() {
    this.focused = !0;
  }
  unfocus() {
    this.focused = !1;
  }
}
class n {
  /**
   * Constructs a new Color
   * @param r - red (0-255)
   * @param g - green (0-255)
   * @param b - blue (0-255)
   * @param a - alpha (0-1, defaults to 1)
   */
  constructor(s, t, e, i = 1) {
    this.r = s, this.g = t, this.b = e, this.a = i;
  }
  /**
   * Constructs a new Color from RGBA values
   * @param r - red (0-255)
   * @param g - green (0-255)
   * @param b - blue (0-255)
   * @param a - alpha (0-1)
   */
  static rgba(s, t, e, i) {
    return new n(s, t, e, i);
  }
  /**
   * Constructs a new Color from RGB values
   * @param r - red (0-255)
   * @param g - green (0-255)
   * @param b - blue (0-255)
   */
  static rgb(s, t, e) {
    return new n(s, t, e, 1);
  }
  /**
   * Constructs a new Color as a shade of gray
   * @param b - brightness (0-255)
   */
  static gray(s) {
    return new n(s, s, s);
  }
  /**
   * Constructs a new Color using HSL values
   * @param h - Hue (0-360)
   * @param s - Saturation (0-100)
   * @param l - Lightness (0-100)
   * @returns A new Color object
   */
  static hsl(s, t, e) {
    if (s = (s % 360 + 360) % 360, t = Math.max(0, Math.min(100, t)) / 100, e = Math.max(0, Math.min(100, e)) / 100, t === 0) {
      const f = Math.round(e * 255);
      return new n(f, f, f, 1);
    }
    const i = (1 - Math.abs(2 * e - 1)) * t, h = s / 60, r = i * (1 - Math.abs(h % 2 - 1)), o = 1 - i / 2;
    let a = 0, d = 0, m = 0;
    return h >= 0 && h < 1 ? (a = i, d = r) : h >= 1 && h < 2 ? (a = r, d = i) : h >= 2 && h < 3 ? (d = i, m = r) : h >= 3 && h < 4 ? (d = r, m = i) : h >= 4 && h < 5 ? (a = r, m = i) : h >= 5 && h < 6 && (a = i, m = r), a = Math.round((a + o) * 255), d = Math.round((d + o) * 255), m = Math.round((m + o) * 255), new n(a, d, m, 1);
  }
  /**
   * Returns a darker or lighter shade of a color
   * @param color - Original color
   * @param adjustment - Brightness adjustment
   */
  static adjustBrightness(s, t) {
    const e = s.clone();
    return e.r += t, e.g += t, e.b += t, e;
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
    return new n(this.r, this.g, this.b, this.a);
  }
  /**
   * Check if two colors are the same
   */
  equals(s) {
    return this.r === s.r && this.g === s.g && this.b === s.b && this.a === s.a;
  }
  // ----- color constants -----
  static get RED() {
    return new n(255, 0, 0);
  }
  static get GREEN() {
    return new n(0, 255, 0);
  }
  static get BLUE() {
    return new n(0, 0, 255);
  }
  static get BLACK() {
    return new n(0, 0, 0);
  }
  static get WHITE() {
    return new n(255, 255, 255);
  }
  static get TRANSPARENT() {
    return new n(0, 0, 0, 0);
  }
}
class M extends y {
  constructor(t, e = () => {
  }) {
    super();
    l(this, "hovered", !1);
    l(this, "cachedPainter", null);
    l(this, "_text");
    l(this, "_minHeight", 0);
    l(this, "_minWidth", 0);
    l(this, "needsRecalc", !0);
    this.onClick = e, this._text = t;
  }
  set text(t) {
    t !== this._text && (this._text = t, this.needsRecalc = !0);
  }
  get text() {
    return this._text;
  }
  update(t, e, i) {
    if (t.contains(e.mousePos) ? (this.hovered = !0, e.justPressedMouse && this.onClick()) : this.hovered = !1, this.cachedPainter && this.needsRecalc) {
      const h = this.cachedPainter.measureText(
        this._text,
        this.style.fontSize,
        this.style.font
      );
      this._minWidth = h + 2 * this.style.padding, this._minHeight = this.style.fontSize + 2 * this.style.padding, this.needsRecalc = !1;
    }
    i && (i.requestWidth(this._minWidth), i.requestHeight(this._minHeight));
  }
  render(t, e) {
    this.cachedPainter || (this.cachedPainter = e), this.hovered ? e.setColor(
      n.adjustBrightness(this.style.fill, Y)
    ) : e.setColor(this.style.fill), e.fillRect(t, this.style.rounding), e.setColor(this.style.outline), e.outlineRect(t, this.style.rounding), e.setColor(this.style.textColor), e.clip(t), e.text(
      this.text,
      this.style.textCenteredH ? t.center.x : t.topLeft.x + this.style.padding,
      this.style.textCenteredV ? t.center.y : t.topLeft.y + this.style.padding,
      this.style.textCenteredH,
      this.style.textCenteredV,
      this.style.fontSize,
      this.style.font
    ), e.unclip();
  }
  get minHeight() {
    return this._minHeight;
  }
  get minWidth() {
    return this._minWidth;
  }
}
class v extends y {
  update() {
  }
  renderElement(s, t) {
    this.render(s, t);
  }
  render(s, t) {
    const e = s.center.x, i = new c(e, s.y + this.style.padding), h = new c(
      e,
      s.y + s.height - this.style.padding
    ), r = new w(i, h);
    t.setColor(this.style.outline), t.drawLine(r);
  }
}
class L extends y {
  constructor(t = "", e) {
    super();
    l(this, "_text");
    l(this, "cachedPainter", null);
    l(this, "lines", []);
    l(this, "height", 0);
    l(this, "lastWidth", -1);
    l(this, "widthNoWrap", 0);
    l(this, "textChanged", !1);
    this._text = t, e && (this.style.fontSize = e);
  }
  update(t, e, i) {
    if (this.cachedPainter && (this.lastWidth !== t.width || this.textChanged)) {
      this.style.textWrap || (this.widthNoWrap = this.cachedPainter.measureText(
        this._text,
        this.style.fontSize,
        this.style.font
      ));
      const h = this._text.split(/\s+/);
      this.lines = [];
      let r = h[0];
      for (let o = 1; o < h.length; o++) {
        const a = h[o];
        (this.style.textWrap ? this.cachedPainter.measureText(
          r + " " + a,
          this.style.fontSize,
          this.style.font
        ) : -1) < t.width ? r += " " + a : (this.lines.push(r), r = a);
      }
      this.lines.push(r), this.height = this.style.fontSize * this.style.lineSpacing * this.lines.length, this.lastWidth = t.width;
    }
    i && i.requestHeight(this.height), this.textChanged = !1;
  }
  render(t, e) {
    this.cachedPainter || (this.cachedPainter = e), e.clip(t), e.setColor(this.style.textColor);
    let i = 0;
    for (let h = 0; h < this.lines.length; h++)
      i = h * this.style.fontSize * this.style.lineSpacing, e.text(
        this.lines[h],
        this.style.textCenteredH ? t.center.x : t.x,
        (this.style.textCenteredV ? t.center.y - this.height / 2 + this.style.fontSize * this.style.lineSpacing / 2 : t.y) + i,
        this.style.textCenteredH,
        this.style.textCenteredV,
        this.style.fontSize,
        this.style.font
      );
    e.unclip();
  }
  get minWidth() {
    return this.style.textWrap ? 0 : this.widthNoWrap + this.style.padding * 2;
  }
  get minHeight() {
    return this.style.textWrap ? 0 : this.style.fontSize * this.style.lineSpacing + this.style.padding * 2;
  }
  get text() {
    return this._text;
  }
  set text(t) {
    t !== this._text && (this.textChanged = !0), this._text = t;
  }
}
class N extends y {
  constructor(t, e, i) {
    super();
    l(this, "mouseStillFor", 0);
    l(this, "mouseStillStart", null);
    l(this, "showTooltip", !1);
    l(this, "textElement");
    this.innerElement = t, this.tooltipLayer = e, this.text = i, this.textElement = new L(i), this.textElement.style.textWrap = !1, this.textElement.style.textCenteredH = !0, this.textElement.style.textCenteredV = !0, this.tooltipLayer.add(this.textElement, {
      anchorX: "left",
      anchorY: "top",
      xOffset: 0,
      yOffset: 0,
      width: 0,
      height: 0
    });
  }
  updateElement(t, e, i) {
    this.update(t, e), this.innerElement.updateElement(t, e, i);
  }
  renderElement(t, e) {
    this.innerElement.renderElement(t, e);
  }
  update(t, e) {
    t.contains(e.mousePos) && e.mouseDelta.length === 0 ? (this.mouseStillStart ? this.mouseStillFor = performance.now() - this.mouseStillStart : this.mouseStillStart = performance.now(), this.mouseStillFor > st && (this.showTooltip = !0)) : (this.showTooltip = !1, this.mouseStillFor = 0, this.mouseStillStart = null), this.showTooltip ? this.showAt(e.mousePos) : this.hide();
  }
  render() {
  }
  showAt(t) {
    this.tooltipLayer.set(this.textElement, {
      xOffset: t.x + it,
      yOffset: t.y + ht,
      width: null,
      height: null
    });
  }
  hide() {
    this.tooltipLayer.set(this.textElement, {
      xOffset: 0,
      yOffset: 0,
      width: 0,
      height: 0
    });
  }
  updateTheme(t) {
    super.updateTheme(t), this.innerElement.updateTheme(t), this.textElement.style.fill = this.style.fill, this.textElement.style.outline = this.style.outline, this.textElement.style.fontSize = this.style.fontSize, this.textElement.style.padding = this.style.padding;
  }
}
class j extends T {
  constructor() {
    super(...arguments);
    l(this, "resizing", null);
  }
  update(t, e) {
    this.handleResizes(t, e), super.update(t, e);
  }
  handleResizes(t, e) {
    for (const i of this.elements) {
      const h = this.getAllocation(i), r = this.getAllocRect(t, i);
      if (!h.resizable)
        continue;
      if (this.getSizeInPixels(t, h) - this.getMinSize(h) <= p) {
        let a = !1;
        for (let d = 0; d < this.elements.indexOf(i) - 1; d++) {
          const m = this.elements[d], f = this.getAllocRect(t, m);
          if (f.top.touchesPoint(e.mousePos, p) || f.bottom.touchesPoint(e.mousePos, p) || f.left.touchesPoint(e.mousePos, p) || f.right.touchesPoint(e.mousePos, p)) {
            a = !0;
            break;
          }
        }
        if (a)
          continue;
      }
      const o = this.getHoveredEdge(r, e);
      o && this.checkIfValidResize(i, o) && (e.cursor = this.isVertical ? O : D, e.justPressedMouse && (this.resizing = {
        allocation: h,
        direction: o
      }));
    }
    e.justReleasedMouse && (this.resizing = null), this.performResize(e);
  }
  getHoveredEdge(t, e) {
    if (this.isVertical) {
      if (t.top.touchesPoint(e.mousePos, p))
        return "top";
      if (t.bottom.touchesPoint(e.mousePos, p))
        return "bottom";
    } else {
      if (t.left.touchesPoint(e.mousePos, p))
        return "left";
      if (t.right.touchesPoint(e.mousePos, p))
        return "right";
    }
    return null;
  }
  checkIfValidResize(t, e) {
    const i = this.elements.indexOf(t), h = i === 0, r = i === this.elements.length - 1;
    if (!h && (e === "left" || e === "top")) {
      if (this.allocations[i - 1].type === "relative" || this.allocations[i - 1].resizable)
        return !0;
    } else if (!r && (e === "right" || e === "bottom") && (this.allocations[i + 1].type === "relative" || this.allocations[i + 1].resizable))
      return !0;
    return !1;
  }
  performResize(t) {
    if (this.resizing && this.cachedRect) {
      t.cursor = this.isVertical ? O : D;
      const e = this.resizing.allocation, i = t.mouseDelta[this.isVertical ? "y" : "x"];
      if (this.resizing.direction === "top" || this.resizing.direction === "left") {
        const h = this.allocations[this.allocations.indexOf(e) - 1];
        (this.getSizeInPixels(this.cachedRect, e) - i >= this.getMinSize(e) || Math.sign(i) === -1) && (this.getSizeInPixels(this.cachedRect, h) + i >= this.getMinSize(h) || Math.sign(i) === 1) && (this.growAllocation(h, i), this.growAllocation(e, -i));
      } else {
        const h = this.allocations[this.allocations.indexOf(e) + 1];
        (this.getSizeInPixels(this.cachedRect, e) + i >= this.getMinSize(e) || Math.sign(i) === 1) && (this.getSizeInPixels(this.cachedRect, h) - i >= this.getMinSize(h) || Math.sign(i) === -1) && (this.growAllocation(e, i), this.growAllocation(h, -i));
      }
      t.pauseInteraction();
    }
  }
}
class q extends j {
  constructor(s = !0, t = !0) {
    super(!0, s, t);
  }
}
class I extends y {
  constructor(t) {
    super();
    l(this, "open", !1);
    l(this, "justClosed", !1);
    l(this, "prevPos", null);
    l(this, "innerLayout", new q());
    l(this, "prevContents", []);
    this.layer = t, t.add(this, {
      width: 0,
      height: 0
    }), this.innerLayout.style.fill = n.TRANSPARENT, this.innerLayout.style.outline = n.TRANSPARENT;
  }
  setContents(t) {
    t !== this.prevContents && (this.innerLayout.clear(), this.innerLayout.add(...t), this.innerLayout.styleChildren({
      outline: n.TRANSPARENT,
      rounding: 0,
      textCenteredH: !1
    }));
  }
  openAt(t) {
    this.justClosed && this.prevPos && this.prevPos.equals(t) || (this.open = !0, this.layer.set(this, {
      anchorX: "left",
      anchorY: "top",
      xOffset: t.x,
      yOffset: t.y,
      width: null,
      height: null
    }));
  }
  close() {
    this.justClosed = !0, this.open = !1, this.prevPos = this.layer.getRect(this).topLeft, this.layer.set(this, {
      width: 0,
      height: 0
    });
  }
  update(t, e) {
    this.justClosed = !1, this.innerLayout.updateElement(t, e), this.open && !t.contains(e.mousePos) && e.justPressedMouse && this.close();
  }
  render(t, e) {
    this.innerLayout.renderElement(t, e);
  }
  updateTheme(t) {
    this.innerLayout.updateTheme(t);
  }
  get minWidth() {
    return Math.max(this.innerLayout.minWidth, et);
  }
  get minHeight() {
    return this.innerLayout.minHeight;
  }
}
class z {
  constructor() {
    l(this, "styles", {});
  }
  static getStyles(s) {
    return s.styles;
  }
  static getDefaultStyle(s) {
    return s.defaultStyle;
  }
  getStyleFor(s) {
    let t = s instanceof y ? s.constructor : s;
    for (; t && t.name; ) {
      const e = this.styles[t.name];
      if (e)
        return { ...this.defaultStyle, ...e };
      t = Object.getPrototypeOf(t);
    }
    return this.defaultStyle;
  }
}
class R extends z {
  constructor() {
    super();
    l(this, "defaultStyle", {
      padding: 0,
      fill: n.rgb(255, 0, 255),
      outline: n.BLACK,
      textColor: n.BLACK,
      rounding: 0,
      fontSize: 13,
      textCenteredV: !1,
      textCenteredH: !1,
      textWrap: !1,
      lineSpacing: 1.1,
      scrollbarBackground: n.WHITE,
      scrollbarColor: n.BLACK,
      scrollbarOutline: n.BLACK,
      sliderBackground: n.WHITE,
      sliderDotFill: n.BLACK,
      font: "Arial"
    });
    l(this, "_isDark", !1);
  }
  static extend(t) {
    const e = new R(), i = z.getDefaultStyle(t), h = z.getStyles(t);
    return e.defaultStyle = { ...i }, e.styles = { ...h }, e._isDark = t.isDark, e;
  }
  static setDefault(t) {
    const e = new R();
    return e.setDefault(t), e;
  }
  static setStyleFor(t, e) {
    const i = new R();
    return i.setStyleFor(t, e), i;
  }
  static setIsDark(t = !0) {
    const e = new R();
    return e.setIsDark(t), e;
  }
  setDefault(t) {
    return this.defaultStyle = t, this;
  }
  setStyleFor(t, e) {
    return this.styles[t.name] = e, this;
  }
  setIsDark(t = !0) {
    return this._isDark = t, this;
  }
  lock() {
    return this;
  }
  get isDark() {
    return this._isDark;
  }
}
const U = {
  light: R.setDefault({
    padding: 0,
    fill: n.TRANSPARENT,
    outline: n.TRANSPARENT,
    textColor: n.BLACK,
    rounding: 0,
    fontSize: 13,
    textCenteredV: !1,
    textCenteredH: !1,
    textWrap: !1,
    lineSpacing: 1.1,
    scrollbarBackground: n.gray(200),
    scrollbarColor: n.gray(50),
    scrollbarOutline: n.gray(144),
    sliderBackground: n.gray(144),
    sliderDotFill: n.gray(60),
    font: "Arial"
  }).setStyleFor(T, {
    fill: n.gray(234),
    outline: n.gray(144)
  }).setStyleFor(M, {
    padding: 4,
    fill: n.gray(211),
    outline: n.gray(144),
    rounding: 3,
    textCenteredV: !0,
    textCenteredH: !0
  }).setStyleFor(E, {
    padding: 4,
    fill: n.gray(211),
    outline: n.gray(144)
  }).setStyleFor(L, {
    textWrap: !0
  }).setStyleFor(I, {
    fill: n.gray(211),
    outline: n.gray(144)
  }).setStyleFor(v, {
    outline: n.gray(144),
    padding: 1
  }).setStyleFor(N, {
    fill: n.gray(234),
    outline: n.gray(144),
    padding: 2
  }).lock(),
  dark: R.setIsDark(!0).setDefault({
    padding: 0,
    fill: n.TRANSPARENT,
    outline: n.TRANSPARENT,
    textColor: n.WHITE,
    rounding: 0,
    fontSize: 13,
    textCenteredV: !1,
    textCenteredH: !1,
    textWrap: !1,
    lineSpacing: 1.1,
    scrollbarBackground: n.gray(0),
    scrollbarColor: n.gray(100),
    scrollbarOutline: n.gray(80),
    sliderBackground: n.gray(144),
    sliderDotFill: n.gray(60),
    font: "Arial"
  }).setStyleFor(T, {
    fill: n.gray(30),
    outline: n.gray(80)
  }).setStyleFor(M, {
    padding: 4,
    fill: n.gray(45),
    outline: n.gray(80),
    rounding: 3,
    textCenteredV: !0,
    textCenteredH: !0
  }).setStyleFor(E, {
    padding: 4,
    fill: n.gray(45),
    outline: n.gray(80)
  }).setStyleFor(L, {
    textWrap: !0
  }).setStyleFor(I, {
    fill: n.gray(45),
    outline: n.gray(80)
  }).setStyleFor(v, {
    outline: n.gray(80),
    padding: 1
  }).setStyleFor(N, {
    outline: n.gray(80),
    fill: n.gray(45),
    padding: 2
  }).lock()
}, b = U.light, X = 500, p = 4, D = "ew-resize", O = "ns-resize", Y = -15, V = 4, A = 9, G = 999, _ = 6, x = 8, $ = 999, Z = 999, J = n.rgb(0, 150, 237), Q = n.rgb(66, 117, 245), tt = 0.5, et = 100, st = 500, it = 0, ht = 22;
class lt {
  constructor(s) {
    l(this, "interactionHolds", 0);
    l(this, "_mousePos", new c(Number.NaN, Number.NaN));
    l(this, "_mouseDelta", new S(0, 0));
    l(this, "_isMouseDown", !1);
    l(this, "_justPressedMouse", !1);
    l(this, "_justReleasedMouse", !1);
    l(this, "_justPressedRightMouse", !1);
    l(this, "_justDoubleClicked", !1);
    l(this, "_scrollDelta", new S(0, 0));
    l(this, "_cursor", "default");
    l(this, "_heldKeys", []);
    l(this, "_justPressedKeys", []);
    l(this, "_justReleasedKeys", []);
    l(this, "_isDraggingFile", !1);
    l(this, "_droppedFiles", null);
    l(this, "hiddenTextarea");
    this.canvas = s, this.hiddenTextarea = document.createElement("textarea"), this.hiddenTextarea.style.position = "absolute", this.hiddenTextarea.style.left = "-9999px", document.body.append(this.hiddenTextarea);
    let t = 0, e = new c(NaN, NaN);
    document.addEventListener("mousedown", (i) => {
      i.buttons === 1 && (this._isMouseDown = !0, this._justPressedMouse = !0, performance.now() - t < X && e.equals(this._mousePos) && (this._justDoubleClicked = !0), t = performance.now(), e = this._mousePos.clone());
    }), document.addEventListener("mouseup", () => {
      this._isMouseDown = !1, this._justReleasedMouse = !0;
    }), document.addEventListener("contextmenu", (i) => {
      i.preventDefault(), this._justPressedRightMouse = !0;
    }), document.addEventListener("mousemove", (i) => {
      this._mouseDelta.x += i.x - this._mousePos.x, this._mouseDelta.y += i.y - this._mousePos.y, this._mousePos.x = i.x, this._mousePos.y = i.y;
    }), document.addEventListener(
      "wheel",
      (i) => {
        i.preventDefault(), this._scrollDelta.x += i.deltaX, this._scrollDelta.y += i.deltaY;
      },
      { passive: !1 }
    ), s.addEventListener("keydown", (i) => {
      i.key.startsWith("F") && i.key.length > 1 || i.preventDefault();
    }), document.addEventListener("keydown", (i) => {
      this._heldKeys.includes(i.key) || this._heldKeys.push(i.key), this._justPressedKeys.push(i.key);
    }), document.addEventListener("keyup", (i) => {
      this._heldKeys.splice(this._heldKeys.indexOf(i.key), 1), this._justReleasedKeys.push(i.key);
    }), document.addEventListener("blur", () => {
      this._heldKeys = [];
    }), s.addEventListener("dragover", (i) => {
      var h;
      i.preventDefault(), this._mousePos.x = i.x, this._mousePos.y = i.y, (h = i.dataTransfer) != null && h.types.includes("Files") && (this._isDraggingFile = !0);
    }), s.addEventListener("dragleave", (i) => {
      i.preventDefault(), this._isDraggingFile = !1;
    }), s.addEventListener("drop", (i) => {
      i.preventDefault(), this._isDraggingFile = !1, i.dataTransfer && (this._droppedFiles = i.dataTransfer.files);
    });
  }
  pauseInteraction() {
    this.interactionHolds++;
  }
  resumeInteraction() {
    this.interactionHolds = Math.max(this.interactionHolds - 1, 0);
  }
  peekAtRealMousePos() {
    return this._mousePos;
  }
  refresh() {
    this.interactionHolds = 0, this.canvas.style.cursor = this._cursor, this._cursor = "default", this._mouseDelta = new S(0, 0), this._justPressedMouse = !1, this._justReleasedMouse = !1, this._justPressedRightMouse = !1, this._justDoubleClicked = !1, this._scrollDelta = new S(0, 0), this._justPressedKeys = [], this._justReleasedKeys = [], this._droppedFiles = null;
  }
  collectTextInput(s, t) {
    this.hiddenTextarea.value = s, this.hiddenTextarea.focus(), this.hiddenTextarea.oninput = () => {
      t(
        this.hiddenTextarea.value,
        this.hiddenTextarea.selectionStart,
        this.hiddenTextarea.selectionEnd
      );
    }, this.hiddenTextarea.onselectionchange = () => {
      t(
        this.hiddenTextarea.value,
        this.hiddenTextarea.selectionStart,
        this.hiddenTextarea.selectionEnd
      );
    }, this.hiddenTextarea.onkeydown = (e) => {
      (e.key === "ArrowUp" || e.key === "ArrowDown" || e.ctrlKey && e.key === "z") && e.preventDefault();
    }, t(
      this.hiddenTextarea.value,
      this.hiddenTextarea.selectionStart,
      this.hiddenTextarea.selectionEnd
    );
  }
  setTextSelectionRange(s, t = s) {
    this.hiddenTextarea.setSelectionRange(s, t);
  }
  get mousePos() {
    return this.interactionHolds > 0 ? new c(NaN, NaN) : this._mousePos;
  }
  get mouseDelta() {
    return this._mouseDelta;
  }
  get isMouseDown() {
    return this._isMouseDown;
  }
  get justPressedMouse() {
    return this._justPressedMouse;
  }
  get justReleasedMouse() {
    return this._justReleasedMouse;
  }
  get justPressedRightMouse() {
    return this._justPressedRightMouse;
  }
  get justDoubleClicked() {
    return this._justDoubleClicked;
  }
  get scrollDelta() {
    return this._scrollDelta;
  }
  get cursor() {
    return this._cursor;
  }
  set cursor(s) {
    this._cursor = s;
  }
  get heldKeys() {
    return this._heldKeys;
  }
  get justPressedKeys() {
    return this._justPressedKeys;
  }
  get justReleasedKeys() {
    return this._justReleasedKeys;
  }
  get isDraggingFile() {
    return this._isDraggingFile;
  }
  get droppedFiles() {
    return this._droppedFiles;
  }
}
class nt {
  /**
   * @param canvas - HTML canvas to draw on
   * @throws Throws error if browser doesn't support CanvasRenderingContext2D
   */
  constructor(s) {
    l(this, "ctx");
    l(this, "clipRect", null);
    l(this, "color", n.BLACK);
    this.canvas = s;
    const t = s.getContext("2d");
    if (!t)
      throw new Error("Your browser doesn't support CanvasRenderingContext2D");
    window.addEventListener("resize", () => {
      t.scale(window.devicePixelRatio, window.devicePixelRatio);
    }), t.scale(window.devicePixelRatio, window.devicePixelRatio), this.ctx = t;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawLine(s, t = 1) {
    if (!this.color.equals(n.TRANSPARENT)) {
      this.ctx.beginPath(), this.ctx.moveTo(s.p1.x, s.p1.y), this.ctx.lineTo(s.p2.x, s.p2.y);
      const e = this.ctx.lineWidth;
      this.ctx.lineWidth = t, this.ctx.stroke(), this.ctx.lineWidth = e;
    }
  }
  setColor(s) {
    !s.equals(n.TRANSPARENT) && !s.equals(this.color) && (this.ctx.fillStyle = s.toString(), this.ctx.strokeStyle = s.toString()), this.color = s;
  }
  fillRect(s, t = 0) {
    this.color.equals(n.TRANSPARENT) || (this.ctx.beginPath(), this.ctx.roundRect(s.x, s.y, s.width, s.height, t), this.ctx.fill());
  }
  outlineRect(s, t) {
    this.color.equals(n.TRANSPARENT) || (this.ctx.beginPath(), this.ctx.roundRect(s.x, s.y, s.width, s.height, t), this.ctx.stroke());
  }
  fillPoly(...s) {
    this.ctx.beginPath(), this.ctx.moveTo(s[0].x, s[0].y);
    for (let t = 1; t < s.length; t++)
      this.ctx.lineTo(s[t].x, s[t].y);
    this.ctx.fill();
  }
  outlinePoly(...s) {
    this.ctx.beginPath(), this.ctx.moveTo(s[0].x, s[0].y);
    for (let t = 1; t < s.length; t++)
      this.ctx.lineTo(s[t].x, s[t].y);
    this.ctx.stroke();
  }
  clip(s) {
    if (!s) {
      this.unclip();
      return;
    }
    this.ctx.save(), this.ctx.beginPath(), this.ctx.rect(s.x, s.y, s.width, s.height), this.ctx.clip(), this.clipRect = s;
  }
  unclip() {
    this.ctx.restore(), this.clipRect = null;
  }
  getClipRect() {
    return this.clipRect;
  }
  text(s, t, e, i = !1, h = !1, r = 12, o = "Arial") {
    this.ctx.textAlign = i ? "center" : "start", this.ctx.textBaseline = h ? "middle" : "top", this.ctx.font = `${r}px ${o}`, this.ctx.fillText(s, t, e);
  }
  measureText(s, t, e = "Arial") {
    return this.ctx.font = `${t}px ${e}`, this.ctx.measureText(s).width;
  }
  drawImage(s, t) {
    this.ctx.drawImage(
      s.getImage(),
      t.x,
      t.y,
      t.width,
      t.height
    );
  }
  drawVideoFrame(s, t) {
    this.ctx.drawImage(s, t.x, t.y, t.width, t.height);
  }
}
class ut {
  constructor(s) {
    l(this, "theme", b);
    l(this, "painter");
    l(this, "layers", []);
    l(this, "context");
    this.canvas = s, s.tabIndex = 0;
    const t = () => {
      const e = window.devicePixelRatio;
      s.width = window.innerWidth * e, s.height = window.innerHeight * e, s.style.position = "absolute", s.style.left = "0", s.style.top = "0", s.style.width = window.innerWidth + "px", s.style.height = window.innerHeight + "px";
    };
    t(), window.addEventListener("resize", t), this.context = new lt(s), this.painter = new nt(s), this.mainLoop();
  }
  setTheme(s) {
    this.theme = s;
    for (const t of this.layers)
      t.updateTheme(s);
  }
  getCurrentTheme() {
    return this.theme;
  }
  addLayer(s) {
    this.layers.push(s), s.updateTheme(this.theme);
  }
  removeLayer(s) {
    this.layers.splice(this.layers.indexOf(s), 1);
  }
  getLayer(s) {
    return this.layers[s];
  }
  mainLoop() {
    this.update(), this.render(), requestAnimationFrame(this.mainLoop.bind(this));
  }
  update() {
    for (let s = this.layers.length - 1; s >= 0; s--)
      this.layers[s].updateElement(this.rect, this.context);
    this.context.refresh();
  }
  render() {
    this.painter.clear();
    for (const s of this.layers)
      s.renderElement(this.rect, this.painter);
  }
  get rect() {
    const s = window.devicePixelRatio;
    return g.from(
      0,
      0,
      this.canvas.width / s,
      this.canvas.height / s
    );
  }
}
class dt extends y {
  constructor(t) {
    super();
    l(this, "innerLayout");
    this.innerLayout = t;
  }
  update(t, e, i) {
    this.innerLayout.updateElement(t, e, i);
  }
  render(t, e) {
    this.innerLayout.renderElement(t, e);
  }
  updateTheme(t) {
    super.updateTheme(t), this.innerLayout.updateTheme(t);
  }
  get minWidth() {
    return this.innerLayout.minWidth;
  }
  get minHeight() {
    return this.innerLayout.minHeight;
  }
}
let ct = class extends y {
  constructor(s) {
    super(), this.image = s;
  }
  update() {
  }
  render(s, t) {
    if (s.width > s.height * (this.image.width / this.image.height)) {
      const e = s.width;
      s.width = s.height * (this.image.width / this.image.height), s.x += (e - s.width) / 2;
    } else if (s.height > s.width * (this.image.height / this.image.width)) {
      const e = s.height;
      s.height = s.width * (this.image.height / this.image.width), s.y += (e - s.height) / 2;
    }
    t.drawImage(this.image, s);
  }
};
class P {
  static clamp(s, t, e) {
    if (t > e)
      throw new Error(
        "Minimum value must be less than or equal to maximum value"
      );
    return Math.max(t, Math.min(e, s));
  }
  static roundToNearest(s, t) {
    return Math.round(s / t) * t;
  }
  static strip(s) {
    return Number(s.toPrecision(12));
  }
}
class ft extends E {
  constructor(t, e, i, h, r = () => {
  }) {
    super();
    l(this, "numValue");
    l(this, "dragging", !1);
    this.minValue = t, this.maxValue = e, this.step = h, this.onChange = r, this.numValue = i, this.value = i.toString();
  }
  update(t, e, i) {
    i && i.requestHeight(this.style.fontSize + 2 * this.style.padding), t.contains(e.mousePos) ? (e.cursor = D, e.justDoubleClicked && (this.focus(), this.collectInput(e), this.selectAll(e))) : e.justPressedMouse && this.unfocus(), this.handleDrag(t, e);
  }
  render(t, e) {
    e.clip(t), this.focused && (this.drawSelectionHighlight(e, t), this.drawCursor(e, t)), e.setColor(this.style.textColor), e.text(
      this.value,
      t.x + this.style.padding - this.textShift,
      t.y + this.style.padding,
      !1,
      !1,
      this.style.fontSize,
      this.style.font
    ), e.unclip();
  }
  unfocus() {
    this.focused = !1;
    const t = P.clamp(
      Number(this.value),
      this.minValue,
      this.maxValue
    );
    Number.isNaN(t) || (this.numValue = t), this.value = this.numValue.toString(), this.onChange(this.numValue);
  }
  handleDrag(t, e) {
    t.contains(e.mousePos) && e.justPressedMouse && (this.dragging = !0), e.justReleasedMouse && (this.dragging = !1), this.dragging && (this.numValue = P.strip(
      P.clamp(
        this.numValue + P.roundToNearest(
          e.mouseDelta.x * tt * this.step,
          this.step
        ),
        this.minValue,
        this.maxValue
      )
    ), this.value = this.numValue.toString(), this.onChange(this.numValue));
  }
}
class mt extends y {
  constructor(t = 0, e = 10, i = 5, h = 1, r = () => {
  }) {
    super();
    l(this, "dragging", !1);
    l(this, "height", Math.max(2 * x, _));
    this.minValue = t, this.maxValue = e, this.value = i, this.step = h, this.onDrag = r;
  }
  update(t, e, i) {
    i && i.requestHeight(this.height), this.handleDragging(t, e);
  }
  render(t, e) {
    const i = g.from(
      t.x + x,
      t.y + (t.height - this.height) / 2 + x - _ / 2,
      t.width - 2 * x,
      _
    ), h = g.from(
      i.x + this.valueAsPercent() * i.width - x,
      t.y + (t.height - this.height) / 2,
      x * 2,
      x * 2
    );
    e.setColor(this.style.sliderBackground), e.fillRect(i, $), e.setColor(this.style.sliderDotFill), e.fillRect(h, Z);
  }
  handleDragging(t, e) {
    const i = g.from(
      t.x + x,
      t.y + (t.height - this.height) / 2,
      t.width - 2 * x,
      this.height
    );
    if (i.contains(e.mousePos) && e.justPressedMouse && (this.dragging = !0), e.justReleasedMouse && (this.dragging = !1), this.dragging) {
      const h = (e.peekAtRealMousePos().x - i.x) / i.width;
      this.value = P.strip(
        P.roundToNearest(
          P.clamp(
            this.percentAsValue(h),
            this.minValue,
            this.maxValue
          ),
          this.step
        )
      ), this.onDrag(this.value);
    }
  }
  valueAsPercent() {
    const t = this.maxValue - this.minValue;
    return (this.value - this.minValue) / t;
  }
  percentAsValue(t) {
    return (this.maxValue - this.minValue) * t + this.minValue;
  }
}
class yt extends E {
  constructor() {
    super();
    l(this, "cachedPainter", null);
    l(this, "dragSelectStart", null);
  }
  update(t, e, i) {
    if (i && i.requestHeight(this.style.fontSize + 2 * this.style.padding), t.contains(e.mousePos)) {
      if (e.cursor = "text", e.justPressedMouse && (this.focus(), this.collectInput(e), this.cachedPainter)) {
        const h = this.getCaretPositionFromMouse(
          e.mousePos.x,
          t,
          this.cachedPainter
        );
        e.justDoubleClicked ? this.selectAll(e) : (this.selectionStart = h, this.selectionEnd = h, this.dragSelectStart = h, e.setTextSelectionRange(h, h));
      }
    } else e.justPressedMouse && this.unfocus();
    if (this.dragSelectStart !== null && this.cachedPainter && !e.justDoubleClicked) {
      const h = this.getCaretPositionFromMouse(
        e.mousePos.x,
        t,
        this.cachedPainter
      ), r = Math.min(this.dragSelectStart, h), o = Math.max(this.dragSelectStart, h);
      this.selectionStart = r, this.selectionEnd = o, e.setTextSelectionRange(r, o);
    }
    e.justReleasedMouse && (this.dragSelectStart = null), this.focused && this.cachedPainter ? this.updateTextShift(this.cachedPainter, t) : this.textShift = 0;
  }
  render(t, e) {
    this.cachedPainter || (this.cachedPainter = e), e.clip(t), this.focused && (this.drawSelectionHighlight(e, t), this.drawCursor(e, t)), e.setColor(this.style.textColor), e.text(
      this.value,
      t.x + this.style.padding - this.textShift,
      t.y + this.style.padding,
      !1,
      !1,
      this.style.fontSize,
      this.style.font
    ), e.unclip();
  }
}
class pt extends F {
  constructor() {
    super(...arguments);
    l(this, "allocations", []);
    l(this, "cachedRect", null);
  }
  add(t, e = {}) {
    const {
      anchorX: i = "left",
      anchorY: h = "top",
      xOffset: r = 0,
      yOffset: o = 0,
      width: a = null,
      height: d = null
    } = e;
    return this.elements.push(t), this.allocations.push({
      width: a,
      height: d,
      anchorX: i,
      anchorY: h,
      xOffset: r,
      yOffset: o,
      minElementSize: {
        width: t.minWidth,
        height: t.minHeight
      }
    }), t.updateTheme(this.currentTheme), this;
  }
  set(t, e) {
    const i = this.elements.indexOf(t);
    this.allocations[i] = {
      ...this.allocations[i],
      ...e
    };
  }
  remove(t) {
    const e = this.elements.indexOf(t);
    this.elements.splice(e, 1), this.allocations.splice(e, 1);
  }
  includes(t) {
    return this.elements.includes(t);
  }
  getRect(t) {
    return this.cachedRect ? this.getAllocRect(this.cachedRect, t) : g.from(NaN, NaN, NaN, NaN);
  }
  update(t, e) {
    this.cachedRect = t, this.updateMinSizes();
    for (const i of this.elements) {
      const h = this.getAllocRect(t, i);
      i.updateElement(h, e);
    }
  }
  render(t, e) {
    for (const i of this.elements) {
      const h = this.getAllocRect(t, i);
      i.renderElement(h, e);
    }
  }
  getAllocation(t) {
    const e = this.elements.indexOf(t);
    return this.allocations[e];
  }
  getAllocRect(t, e) {
    const i = this.getAllocation(e);
    let h;
    i.anchorX === "left" ? h = t.x + i.xOffset : h = t.x + t.width - i.xOffset - this.getAllocWidth(i);
    let r;
    return i.anchorY === "top" ? r = t.y + i.yOffset : r = t.y + t.height - i.yOffset - this.getAllocHeight(i), g.from(
      h,
      r,
      this.getAllocWidth(i),
      this.getAllocHeight(i)
    );
  }
  getAllocWidth(t) {
    return t.width === null ? t.minElementSize.width : t.width;
  }
  getAllocHeight(t) {
    return t.height === null ? t.minElementSize.height : t.height;
  }
  updateMinSizes() {
    for (let t = 0; t < this.elements.length; t++) {
      const e = this.elements[t], i = this.allocations[t];
      i.minElementSize.width = e.minWidth, i.minElementSize.height = e.minHeight;
    }
  }
}
class xt extends j {
  constructor(s = !0, t = !0) {
    super(!1, s, t);
  }
}
class St extends T {
  constructor(t = !0, e = !1, i = []) {
    super(!0, !0, !0);
    l(this, "scrollOffset", 0);
    l(this, "scrollbarHovered", !1);
    l(this, "draggingScrollbar", !1);
    this.shiftContentForScrollbar = t, this.startFromBottom = e, this.dontScrollWhenHeld = i;
  }
  update(t, e, i) {
    t.contains(e.mousePos) && !e.heldKeys.some((h) => this.dontScrollWhenHeld.includes(h)) && (this.startFromBottom ? this.scrollOffset -= e.scrollDelta.y : this.scrollOffset += e.scrollDelta.y), i && i.requestHeight(this.contentHeight), this.updateScrollbar(t, e), this.constrainScroll(t), super.update(this.getContentRect(t), e);
  }
  render(t, e) {
    const i = this.getContentRect(t);
    e.clip(i);
    for (const h of this.elements) {
      const r = this.getAllocRect(i, h);
      r.intersects(i) && h.renderElement(r, e);
    }
    e.unclip(), this.renderScrollbar(t, e);
  }
  updateScrollbar(t, e) {
    const i = g.from(
      t.x + t.width - A,
      t.y,
      A,
      t.height
    );
    if (this.scrollbarHovered = i.contains(e.mousePos), this.scrollbarHovered && e.justPressedMouse && (this.draggingScrollbar = !0), e.justReleasedMouse && (this.draggingScrollbar = !1), this.draggingScrollbar) {
      const h = e.peekAtRealMousePos(), r = t.height / this.contentHeight;
      let o;
      this.startFromBottom ? o = 1 - ((h.y - t.y) / t.height + r / 2) : o = (h.y - t.y) / t.height - r / 2, this.scrollOffset = this.contentHeight * o;
    }
  }
  renderScrollbar(t, e) {
    if (t.height < this.contentHeight - 1) {
      const i = this.scrollbarHovered || this.draggingScrollbar ? A : V, h = g.from(
        t.x + t.width - i,
        t.y,
        i,
        t.height
      ), r = t.height / this.contentHeight * t.height;
      let o;
      this.startFromBottom ? o = t.height / this.contentHeight * -this.scrollOffset + t.y + t.height - r : o = t.height / this.contentHeight * this.scrollOffset + t.y;
      const a = g.from(
        t.x + t.width - i,
        o,
        i,
        r
      );
      e.setColor(this.style.scrollbarOutline), e.outlineRect(h), e.setColor(this.style.scrollbarBackground), e.fillRect(h), e.setColor(this.style.scrollbarColor), e.fillRect(a, G);
    }
  }
  getAllocRect(t, e) {
    const i = super.getAllocRect(t, e);
    return this.startFromBottom ? i.y -= this.contentHeight - t.height - this.scrollOffset : i.y -= this.scrollOffset, i;
  }
  constrainScroll(t) {
    this.scrollOffset = Math.max(
      Math.min(this.scrollOffset, this.contentHeight - t.height),
      0
    );
  }
  getContentRect(t) {
    if (this.shiftContentForScrollbar && t.height < this.contentHeight - 1) {
      const e = t.clone();
      return e.width -= V, e;
    } else
      return t;
  }
  get contentHeight() {
    if (this.cachedRect) {
      let t = 0;
      for (const e of this.elements) {
        const i = super.getAllocRect(this.cachedRect, e);
        i.y + i.height > t && (t = i.y + i.height);
      }
      return t - this.cachedRect.y + this.style.padding * 2;
    }
    return 0;
  }
}
class rt {
}
const C = class C extends rt {
  constructor(t) {
    super();
    l(this, "image");
    this.image = C.fallbackImage;
    const e = new Image();
    e.src = t, e.onload = () => {
      this.image = e;
    }, e.onerror = () => {
      console.error(`Failed to load image from ${t}`);
    };
  }
  getImage() {
    return this.image;
  }
  get width() {
    return this.image.width;
  }
  get height() {
    return this.image.height;
  }
  static get fallbackImage() {
    if (!this._fallbackImage) {
      const t = document.createElement("canvas");
      t.width = 1, t.height = 1, t.getContext("2d").clearRect(0, 0, 1, 1);
      const i = t.toDataURL("image/png");
      this._fallbackImage = new Image(), this._fallbackImage.src = i;
    }
    return this._fallbackImage;
  }
};
l(C, "_fallbackImage", null);
let k = C;
export {
  Y as BUTTON_HOVERED_CHANGE,
  M as Button,
  nt as Canvas2DPainter,
  n as Color,
  dt as CompoundElement,
  lt as Context,
  X as DOUBLE_CLICK_INTERVAL,
  tt as DRAGINPUT_SCALING,
  T as DirectionalLayout,
  v as Divider,
  y as Element,
  b as FALLBACK_THEME,
  pt as Freeform,
  H as Gap,
  ut as HFrame,
  D as H_RESIZE_CURSOR,
  xt as Horizontal,
  ct as Image,
  rt as ImageSource,
  E as KeyboardInput,
  F as Layout,
  w as LineSegment,
  et as MENU_MIN_WIDTH,
  P as MathHelpers,
  I as Menu,
  ft as NumberInput,
  c as Pos2D,
  p as RESIZE_LEEWAY,
  g as Rect,
  j as ResizeLayout,
  A as SCROLLBAR_HOVERED_WIDTH,
  G as SCROLLBAR_ROUNDING,
  V as SCROLLBAR_WIDTH,
  x as SLIDER_DOT_RADIUS,
  Z as SLIDER_DOT_ROUNDING,
  _ as SLIDER_LINE_HEIGHT,
  $ as SLIDER_LINE_ROUNDING,
  mt as Slider,
  W as StyleManager,
  Q as TEXTINPUT_CARET_COLOR,
  J as TEXT_HIGHLIGHT,
  it as TOOLTIP_CURSOR_OFFSET_X,
  ht as TOOLTIP_CURSOR_OFFSET_Y,
  st as TOOLTIP_HOVER_TIME,
  L as Text,
  yt as TextInput,
  z as Theme,
  R as ThemeBuilder,
  U as Themes,
  N as TooltipProvider,
  k as URIImageSource,
  O as V_RESIZE_CURSOR,
  S as Vec2D,
  q as Vertical,
  St as VerticalScroll
};
