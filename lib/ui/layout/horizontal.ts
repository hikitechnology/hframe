import { ResizeLayout } from "../abstract/resize-layout";

export class Horizontal extends ResizeLayout {
  constructor(hasOutline: boolean = true, hasFill: boolean = true) {
    super(false, hasOutline, hasFill);
  }
}
