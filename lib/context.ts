import { DOUBLE_CLICK_INTERVAL } from "./constants";
import { Pos2D } from "./utils/shapes/pos2d";
import { Vec2D } from "./utils/shapes/vec2d";

export class Context {
  private interactionHolds: number = 0;
  private _mousePos: Pos2D = new Pos2D(Number.NaN, Number.NaN);
  private _mouseDelta: Vec2D = new Vec2D(0, 0);
  private _isMouseDown: boolean = false;
  private _justPressedMouse: boolean = false;
  private _justReleasedMouse: boolean = false;
  private _justPressedRightMouse: boolean = false;
  private _justDoubleClicked: boolean = false;
  private _scrollDelta: number = 0;
  private _cursor: string = "default";
  private _heldKeys: string[] = [];
  private _justPressedKeys: string[] = [];
  private _justReleasedKeys: string[] = [];
  private _isDraggingFile: boolean = false;
  private _droppedFiles: FileList | null = null;

  private hiddenTextarea: HTMLTextAreaElement;

  constructor(private canvas: HTMLCanvasElement) {
    // set up hidden text input
    this.hiddenTextarea = document.createElement("textarea");
    this.hiddenTextarea.style.position = "absolute";
    this.hiddenTextarea.style.left = "-9999px";
    document.body.append(this.hiddenTextarea);

    // set up listeners
    let lastClickTime = 0;
    let lastClickPos = new Pos2D(NaN, NaN);
    document.addEventListener("mousedown", (event) => {
      const isLeft = event.buttons === 1;
      if (isLeft) {
        this._isMouseDown = true;
        this._justPressedMouse = true;
        if (
          performance.now() - lastClickTime < DOUBLE_CLICK_INTERVAL &&
          lastClickPos.equals(this._mousePos)
        ) {
          this._justDoubleClicked = true;
        }
        lastClickTime = performance.now();
        lastClickPos = this._mousePos.clone();
      }
    });
    document.addEventListener("mouseup", () => {
      this._isMouseDown = false;
      this._justReleasedMouse = true;
    });
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this._justPressedRightMouse = true;
    });
    document.addEventListener("mousemove", (event) => {
      this._mouseDelta.x += event.x - this._mousePos.x;
      this._mouseDelta.y += event.y - this._mousePos.y;

      this._mousePos.x = event.x;
      this._mousePos.y = event.y;
    });
    document.addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey) {
          event.preventDefault();
        }
        this._scrollDelta += event.deltaY;
      },
      { passive: false },
    );

    // prevent browser keypress handling when canvas focused
    canvas.addEventListener("keydown", (event) => {
      // don't interrupt f key keypresses (f1, f2, ...)
      if (event.key.startsWith("F") && event.key.length > 1) return;
      event.preventDefault();
    });

    // collect keypresses even when canvas isn't focused, like when inputting text
    document.addEventListener("keydown", (event) => {
      if (!this._heldKeys.includes(event.key)) {
        this._heldKeys.push(event.key);
      }
      this._justPressedKeys.push(event.key);
    });
    document.addEventListener("keyup", (event) => {
      this._heldKeys.splice(this._heldKeys.indexOf(event.key), 1);
      this._justReleasedKeys.push(event.key);
    });

    // file drag detection
    canvas.addEventListener("dragover", (event) => {
      event.preventDefault();
      this._mousePos.x = event.x;
      this._mousePos.y = event.y;
      if (event.dataTransfer?.types.includes("Files")) {
        this._isDraggingFile = true;
      }
    });
    canvas.addEventListener("dragleave", (event) => {
      event.preventDefault();
      this._isDraggingFile = false;
    });
    canvas.addEventListener("drop", (event) => {
      event.preventDefault();
      this._isDraggingFile = false;
      if (event.dataTransfer) {
        this._droppedFiles = event.dataTransfer.files;
      }
    });
  }

  pauseInteraction(): void {
    this.interactionHolds++;
  }

  resumeInteraction(): void {
    this.interactionHolds = Math.max(this.interactionHolds - 1, 0);
  }

  peekAtRealMousePos(): Pos2D {
    return this._mousePos;
  }

  refresh() {
    this.interactionHolds = 0;
    this.canvas.style.cursor = this._cursor;
    this._cursor = "default";

    this._mouseDelta = new Vec2D(0, 0);
    this._justPressedMouse = false;
    this._justReleasedMouse = false;
    this._justPressedRightMouse = false;
    this._justDoubleClicked = false;
    this._scrollDelta = 0;
    this._justPressedKeys = [];
    this._justReleasedKeys = [];
    this._droppedFiles = null;
  }

  collectTextInput(
    initialText: string,
    callback: (
      updatedText: string,
      selectionStart: number,
      selectionEnd: number,
    ) => void,
  ) {
    this.hiddenTextarea.value = initialText;
    this.hiddenTextarea.focus();
    this.hiddenTextarea.oninput = () => {
      callback(
        this.hiddenTextarea.value,
        this.hiddenTextarea.selectionStart,
        this.hiddenTextarea.selectionEnd,
      );
    };
    this.hiddenTextarea.onselectionchange = () => {
      // update selection/cursor whenver it's moved
      callback(
        this.hiddenTextarea.value,
        this.hiddenTextarea.selectionStart,
        this.hiddenTextarea.selectionEnd,
      );
    };
    this.hiddenTextarea.onkeydown = (event) => {
      // prevent moving up, moving down, undo to prevent conflicts
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        (event.ctrlKey && event.key === "z")
      ) {
        event.preventDefault();
      }
    };
    // initial values
    callback(
      this.hiddenTextarea.value,
      this.hiddenTextarea.selectionStart,
      this.hiddenTextarea.selectionEnd,
    );
  }

  setTextSelectionRange(start: number, end: number = start) {
    this.hiddenTextarea.setSelectionRange(start, end);
  }

  get mousePos(): Pos2D {
    if (this.interactionHolds > 0) {
      return new Pos2D(NaN, NaN);
    }
    return this._mousePos;
  }

  get mouseDelta(): Vec2D {
    return this._mouseDelta;
  }

  get isMouseDown(): boolean {
    return this._isMouseDown;
  }

  get justPressedMouse(): boolean {
    return this._justPressedMouse;
  }

  get justReleasedMouse(): boolean {
    return this._justReleasedMouse;
  }

  get justPressedRightMouse(): boolean {
    return this._justPressedRightMouse;
  }

  get justDoubleClicked(): boolean {
    return this._justDoubleClicked;
  }

  get scrollDelta(): number {
    return this._scrollDelta;
  }

  get cursor(): string {
    return this._cursor;
  }

  set cursor(cursor: string) {
    this._cursor = cursor;
  }

  get heldKeys(): string[] {
    return this._heldKeys;
  }

  get justPressedKeys(): string[] {
    return this._justPressedKeys;
  }

  get justReleasedKeys(): string[] {
    return this._justReleasedKeys;
  }

  get isDraggingFile(): boolean {
    return this._isDraggingFile;
  }

  get droppedFiles(): FileList | null {
    return this._droppedFiles;
  }
}
