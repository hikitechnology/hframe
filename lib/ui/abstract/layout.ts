import { Element } from "./element";

export abstract class Layout extends Element {
  abstract add(element: Element): void;
  abstract remove(element: Element): void;
  abstract includes(element: Element): boolean;
}
