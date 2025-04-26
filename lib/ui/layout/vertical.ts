import { ResizeLayout } from "../abstract/resize-layout";

export class Vertical extends ResizeLayout {
  constructor(hasOutline: boolean = true, hasFill: boolean = true) {
    super(true, hasOutline, hasFill);
  }
}
